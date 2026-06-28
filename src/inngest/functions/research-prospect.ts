import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { query, queryOne } from "@/lib/db";
import { hasParallel } from "@/lib/env";
import { submitResearchTask, getTaskRunStatus, getTaskResult, type ResearchOutput } from "@/lib/parallel";

// Durable poll cadence: poll every 15s up to 40 iterations (~10 min total).
// Each poll is a separate step.sleep + step.run so Inngest can checkpoint between them.
// This avoids Cloudflare 524 doom-loop that a single blocking long-poll step causes.
const RESEARCH_MAX_POLLS = 40;

type ProspectRow = {
  id: string;
  company_name: string;
  company_url: string | null;
};

export const researchProspect = inngest.createFunction(
  {
    id: "outbound-research-prospect",
    name: "Outbound: Research Prospect",
    concurrency: { limit: 3 },
    retries: 2,
    triggers: [{ event: "outbound/prospect.enriched" }],
  },
  async ({ event, step }) => {
    const { prospectId } = event.data as { prospectId: string };

    const prospect = await step.run("load-prospect", async () => {
      return queryOne<ProspectRow>(
        `SELECT id, company_name, company_url FROM prospects WHERE id = $1`,
        [prospectId],
      );
    });

    if (!prospect) throw new NonRetriableError(`prospect ${prospectId} not found`);

    await step.run("mark-researching", async () => {
      await query(`UPDATE prospects SET status = 'researching' WHERE id = $1`, [prospectId]);
      await query(
        `INSERT INTO jobs (prospect_id, kind, status) VALUES ($1, 'research', 'running')`,
        [prospectId],
      );
    });

    // Parallel is required for research. No key = permanent failure, never retry.
    if (!hasParallel()) {
      await step.run("mark-failed-no-parallel", async () => {
        await query(
          `UPDATE prospects SET status = 'failed', notes = $2 WHERE id = $1`,
          [prospectId, "Research: PARALLEL_API_KEY not configured"],
        );
        await query(
          `UPDATE jobs SET status = 'failed', finished_at = NOW(), error = $2
           WHERE prospect_id = $1 AND kind = 'research' AND status = 'running'`,
          [prospectId, "PARALLEL_API_KEY not configured"],
        );
      });

      await step.sendEvent("emit-failed-no-parallel", {
        name: "outbound/prospect.failed",
        data: {
          prospectId,
          stage: "research" as const,
          error: "PARALLEL_API_KEY not configured",
        },
      });

      throw new NonRetriableError("PARALLEL_API_KEY not configured -- research cannot run");
    }

    const { taskId } = await step.run("submit-task", async () => {
      return submitResearchTask({
        companyName: prospect.company_name,
        companyUrl: prospect.company_url,
      });
    });

    // Durable poll: step.sleep + step.run status check per iteration.
    // Each poll hits GET /v1/tasks/runs/{id} (the status endpoint, not /result).
    // The result endpoint is called exactly once after confirmed completion.
    // Never hold an HTTP connection open for 120s -- that triggers Cloudflare 524.
    let research: ResearchOutput | null = null;

    for (let i = 0; i < RESEARCH_MAX_POLLS; i++) {
      await step.sleep(`wait-${i}`, "15s");

      const pollResult = await step.run(`check-task-${i}`, async () => {
        return getTaskRunStatus(taskId);
      });

      if (pollResult.status === "completed") {
        // Fetch the result exactly once -- do not re-poll status inside awaitResearchTask.
        research = await step.run("fetch-task-result", async () => {
          return getTaskResult(taskId);
        });
        break;
      }

      if (pollResult.status === "failed") {
        await step.run("mark-failed-task-upstream", async () => {
          await query(
            `UPDATE prospects SET status = 'failed', notes = $2 WHERE id = $1`,
            [prospectId, `Research task failed: ${pollResult.error ?? "unknown"}`],
          );
          await query(
            `UPDATE jobs SET status = 'failed', finished_at = NOW(), error = $2
             WHERE prospect_id = $1 AND kind = 'research' AND status = 'running'`,
            [prospectId, pollResult.error ?? "task failed upstream"],
          );
        });

        await step.sendEvent("emit-failed-task", {
          name: "outbound/prospect.failed",
          data: {
            prospectId,
            stage: "research" as const,
            error: `Parallel task failed: ${pollResult.error ?? "unknown"}`,
          },
        });

        throw new NonRetriableError(`Parallel task failed: ${pollResult.error ?? "unknown"}`);
      }
      // status is "queued" or "running" — keep polling.
    }

    if (!research) {
      await step.run("mark-failed-timeout", async () => {
        await query(
          `UPDATE prospects SET status = 'failed', notes = $2 WHERE id = $1`,
          [prospectId, `Research: polling timed out after ${RESEARCH_MAX_POLLS} attempts`],
        );
        await query(
          `UPDATE jobs SET status = 'failed', finished_at = NOW(), error = 'polling timeout'
           WHERE prospect_id = $1 AND kind = 'research' AND status = 'running'`,
          [prospectId],
        );
      });

      await step.sendEvent("emit-failed-timeout", {
        name: "outbound/prospect.failed",
        data: {
          prospectId,
          stage: "research" as const,
          error: "Research task polling timed out",
        },
      });

      return { ok: false, reason: "timeout" };
    }

    await step.run("persist-research", async () => {
      await query(
        `INSERT INTO research (
          prospect_id, summary, uses_n8n, pain_signal, pain_signal_url, pain_signal_source,
          buyer_observation, current_stack_summary, raw_json, task_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
        ON CONFLICT (prospect_id) DO UPDATE SET
          summary = EXCLUDED.summary,
          uses_n8n = EXCLUDED.uses_n8n,
          pain_signal = EXCLUDED.pain_signal,
          pain_signal_url = EXCLUDED.pain_signal_url,
          pain_signal_source = EXCLUDED.pain_signal_source,
          buyer_observation = EXCLUDED.buyer_observation,
          current_stack_summary = EXCLUDED.current_stack_summary,
          raw_json = EXCLUDED.raw_json,
          task_id = EXCLUDED.task_id,
          generated_at = NOW()`,
        [
          prospectId,
          research.specific_observation_for_opener || null,
          research.uses_n8n_in_production,
          research.n8n_pain_signals_observed[0]?.summary ?? null,
          research.n8n_pain_signals_observed[0]?.source_url ?? null,
          research.n8n_pain_signals_observed[0]?.signal_type ?? null,
          research.specific_observation_for_opener || null,
          research.current_stack_summary || null,
          JSON.stringify(research),
          taskId,
        ],
      );
      await query(`UPDATE prospects SET fit_score = $2 WHERE id = $1`, [
        prospectId,
        research.overall_fit_score,
      ]);
      await query(
        `UPDATE jobs SET status = 'succeeded', finished_at = NOW()
         WHERE prospect_id = $1 AND kind = 'research' AND status = 'running'`,
        [prospectId],
      );
    });

    const hasUsableSignal =
      research.overall_fit_score >= 6 &&
      (research.uses_n8n_in_production === "yes_first_party_evidence" ||
        research.n8n_pain_signals_observed.length > 0);

    await step.sendEvent("emit-researched", {
      name: "outbound/prospect.researched",
      data: {
        prospectId,
        fitScore: research.overall_fit_score,
        hasUsableSignal,
      },
    });

    return { ok: true, fitScore: research.overall_fit_score, hasUsableSignal };
  },
);
