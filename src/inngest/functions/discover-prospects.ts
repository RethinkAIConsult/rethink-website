import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { query, queryOne } from "@/lib/db";
import { hasParallel, hasExa } from "@/lib/env";
import {
  entitySearch,
  createFindAllRun,
  getFindAllStatus,
  getFindAllResult,
  DEFAULT_ICP,
} from "@/lib/parallel-discovery";
import { searchCompanies } from "@/lib/exa";
import type { DiscoveryRunRow, ProspectSource } from "@/lib/types";

// Max polling iterations for FindAll (each iteration = 10s sleep + status check).
// 30 iterations × 10s = ~5 minutes max.
const FINDALL_MAX_POLLS = 30;

// Unified shape for all candidate sources before DB insert.
type CandidateInsert = {
  source: ProspectSource;
  name: string;
  url: string | null;
  description: string | null;
  signal: string | null;
  citations: unknown[];
  raw_json: unknown;
};

export const discoverProspects = inngest.createFunction(
  {
    id: "outbound-discover-prospects",
    name: "Outbound: Discover Prospects",
    concurrency: { limit: 2 },
    retries: 1,
    triggers: [{ event: "outbound/discovery.requested" }],
  },
  async ({ event, step }) => {
    const { runId, engine, objective, campaignId, matchLimit, createdBy } = event.data as {
      runId: string;
      engine: "parallel_findall" | "parallel_entity" | "exa";
      objective: string;
      campaignId: string | null;
      matchLimit: number;
      createdBy: string;
    };

    // Verify env-gate BEFORE touching DB so we fail fast with a clear message.
    const engineKeyMissing =
      (engine === "parallel_findall" || engine === "parallel_entity") && !hasParallel()
        ? "PARALLEL_API_KEY"
        : engine === "exa" && !hasExa()
          ? "EXA_API_KEY"
          : null;

    if (engineKeyMissing) {
      await step.run("mark-failed-no-creds", async () => {
        await query(
          `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
          [runId, `${engineKeyMissing} not configured`],
        );
      });
      // Missing credential is permanent — retrying will not resolve it.
      throw new NonRetriableError(`${engineKeyMissing} not configured`);
    }

    // Load the run row and verify it exists.
    const run = await step.run("load-run", async () => {
      return queryOne<DiscoveryRunRow>(
        `SELECT * FROM discovery_runs WHERE id = $1`,
        [runId],
      );
    });

    if (!run) {
      throw new NonRetriableError(`discovery_run ${runId} not found`);
    }

    await step.run("mark-running", async () => {
      await query(`UPDATE discovery_runs SET status = 'running' WHERE id = $1`, [runId]);
    });

    // ------------------------------------------------------------------
    // Engine-specific discovery — all paths produce CandidateInsert[].
    // ------------------------------------------------------------------

    let candidates: CandidateInsert[] = [];

    if (engine === "parallel_entity") {
      const result = await step.run("entity-search", async () => {
        return entitySearch({ objective, matchLimit });
      });
      if (result.skipped) {
        await step.run("mark-failed-entity-skipped", async () => {
          await query(
            `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
            [runId, `Entity search skipped: ${result.skipped}`],
          );
        });
        return { ok: false, reason: "skipped", detail: result.skipped };
      }
      candidates = result.candidates.map((c) => ({
        source: "parallel_entity" as const,
        name: c.name,
        url: c.url ?? null,
        description: c.description ?? null,
        signal: c.signal ?? null,
        citations: c.citations,
        raw_json: c.raw_json,
      }));
    } else if (engine === "exa") {
      const result = await step.run("exa-search", async () => {
        return searchCompanies({ query: objective, numResults: matchLimit });
      });
      if (result.skipped) {
        await step.run("mark-failed-exa-skipped", async () => {
          await query(
            `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
            [runId, `Exa search skipped: ${result.skipped}`],
          );
        });
        return { ok: false, reason: "skipped", detail: result.skipped };
      }
      candidates = result.results.map((r) => ({
        source: "exa" as const,
        name: r.name,
        url: r.url ?? null,
        description: r.description ?? null,
        signal: r.description ?? null,
        citations: [],
        raw_json: r.raw,
      }));
    } else {
      // parallel_findall — durable poll pattern (no blocking long poll).
      const submitResult = await step.run("findall-submit", async () => {
        return createFindAllRun({
          objective,
          matchConditions: DEFAULT_ICP.match_conditions as unknown as Array<{ name: string; description: string }>,
          generator: "core",
          matchLimit,
        });
      });

      if (submitResult.skipped || !submitResult.findallId) {
        await step.run("mark-failed-findall-submit", async () => {
          await query(
            `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
            [runId, `FindAll submit skipped/failed: ${submitResult.skipped ?? "no findall_id returned"}`],
          );
        });
        return { ok: false, reason: "findall_submit_failed" };
      }

      const findallId = submitResult.findallId;

      // Persist the external_id so it can be inspected externally.
      await step.run("persist-findall-id", async () => {
        await query(`UPDATE discovery_runs SET external_id = $2 WHERE id = $1`, [runId, findallId]);
      });

      // Durable poll: step.sleep + step.run status check, up to FINDALL_MAX_POLLS.
      let completed = false;
      for (let i = 0; i < FINDALL_MAX_POLLS; i++) {
        await step.sleep(`wait-${i}`, "10s");

        const statusResult = await step.run(`check-status-${i}`, async () => {
          return getFindAllStatus(findallId);
        });

        if (statusResult.skipped) break;

        if (statusResult.status === "completed") {
          completed = true;
          break;
        }
        if (statusResult.status === "failed") {
          await step.run("mark-failed-findall-upstream", async () => {
            await query(
              `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
              [runId, `FindAll upstream failed: ${statusResult.message ?? "unknown"}`],
            );
          });
          return { ok: false, reason: "findall_upstream_failed" };
        }
        // status === "running" — keep polling.
      }

      if (!completed) {
        await step.run("mark-failed-findall-timeout", async () => {
          await query(
            `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
            [runId, `FindAll polling timed out after ${FINDALL_MAX_POLLS} attempts`],
          );
        });
        return { ok: false, reason: "findall_timeout" };
      }

      const resultData = await step.run("findall-fetch-result", async () => {
        return getFindAllResult(findallId);
      });

      if (resultData.skipped) {
        await step.run("mark-failed-findall-result-skipped", async () => {
          await query(
            `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
            [runId, `FindAll result fetch skipped: ${resultData.skipped}`],
          );
        });
        return { ok: false, reason: "skipped" };
      }
      candidates = resultData.candidates.map((c) => ({
        source: "parallel_findall" as const,
        name: c.name,
        url: c.url ?? null,
        description: c.description ?? null,
        signal: c.signal ?? null,
        citations: c.citations,
        raw_json: c.raw_json,
      }));
    }

    // ------------------------------------------------------------------
    // Insert candidates — ON CONFLICT (campaign_id, url) DO NOTHING for idempotency.
    // ------------------------------------------------------------------

    const insertedCount = await step.run("insert-candidates", async () => {
      if (candidates.length === 0) return 0;
      let inserted = 0;
      for (const c of candidates) {
        if (c.url) {
          const res = await query<{ id: string }>(
            `INSERT INTO candidates
               (campaign_id, discovery_run_id, source, entity_type, name, url, description,
                signal, citations, raw_json, fit_score, status, created_by)
             VALUES ($1, $2, $3, 'company', $4, $5, $6, $7, $8::jsonb, $9::jsonb, NULL, 'new', $10)
             ON CONFLICT (campaign_id, url) DO NOTHING
             RETURNING id`,
            [
              campaignId,
              runId,
              c.source,
              c.name,
              c.url,
              c.description,
              c.signal,
              JSON.stringify(c.citations),
              JSON.stringify(c.raw_json),
              createdBy,
            ],
          );
          if (res.length > 0) inserted++;
        } else {
          // No URL — insert without URL-based conflict guard; name alone is not unique enough to dedupe.
          await query(
            `INSERT INTO candidates
               (campaign_id, discovery_run_id, source, entity_type, name, url, description,
                signal, citations, raw_json, fit_score, status, created_by)
             VALUES ($1, $2, $3, 'company', $4, NULL, $5, $6, $7::jsonb, $8::jsonb, NULL, 'new', $9)`,
            [
              campaignId,
              runId,
              c.source,
              c.name,
              c.description,
              c.signal,
              JSON.stringify(c.citations),
              JSON.stringify(c.raw_json),
              createdBy,
            ],
          );
          inserted++;
        }
      }
      return inserted;
    });

    await step.run("mark-succeeded", async () => {
      await query(
        `UPDATE discovery_runs
         SET status = 'succeeded', match_count = $2, finished_at = NOW()
         WHERE id = $1`,
        [runId, insertedCount],
      );
    });

    await step.sendEvent("emit-completed", {
      name: "outbound/discovery.completed",
      data: {
        runId,
        engine,
        matchCount: insertedCount,
        campaignId,
      },
    });

    return { ok: true, matchCount: insertedCount };
  },
);
