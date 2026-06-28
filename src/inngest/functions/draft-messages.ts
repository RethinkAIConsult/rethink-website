import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { query, queryOne } from "@/lib/db";
import { hasOpenRouter } from "@/lib/env";
import { draftMessages } from "@/lib/anthropic";
import type { ResearchOutput } from "@/lib/parallel";

type Joined = {
  company_name: string;
  contact_name: string | null;
  contact_title: string | null;
  research_json: ResearchOutput;
};

export const draftMessagesFn = inngest.createFunction(
  {
    id: "outbound-draft-messages",
    name: "Outbound: Draft Messages",
    concurrency: { limit: 5 },
    retries: 2,
    triggers: [{ event: "outbound/prospect.researched" }],
  },
  async ({ event, step }) => {
    const { prospectId, hasUsableSignal } = event.data as {
      prospectId: string;
      hasUsableSignal: boolean;
    };

    if (!hasUsableSignal) {
      await step.run("mark-dropped", async () => {
        await query(
          `UPDATE prospects SET status = 'dropped', notes = COALESCE(notes, '') || ' [auto-dropped: no usable signal]'
           WHERE id = $1`,
          [prospectId],
        );
      });
      return { ok: true, dropped: true };
    }

    // Env-gate: no LLM key is a permanent configuration failure — stop retrying.
    if (!hasOpenRouter()) {
      await step.run("mark-failed-no-anthropic", async () => {
        await query(
          `UPDATE prospects SET status = 'failed', notes = $2 WHERE id = $1`,
          [prospectId, "Draft: OPENROUTER_API_KEY not configured"],
        );
        await query(
          `INSERT INTO jobs (prospect_id, kind, status, finished_at, error)
           VALUES ($1, 'draft', 'failed', NOW(), 'OPENROUTER_API_KEY not configured')
           ON CONFLICT (prospect_id, kind) DO UPDATE SET status = 'failed', finished_at = NOW(), error = EXCLUDED.error`,
          [prospectId],
        );
      });

      await step.sendEvent("emit-failed-no-anthropic", {
        name: "outbound/prospect.failed",
        data: {
          prospectId,
          stage: "draft" as const,
          error: "OPENROUTER_API_KEY not configured",
        },
      });

      throw new NonRetriableError("OPENROUTER_API_KEY not configured");
    }

    const joined = await step.run("load-joined", async () => {
      return queryOne<Joined>(
        `SELECT p.company_name, p.contact_name, p.contact_title, r.raw_json AS research_json
         FROM prospects p JOIN research r ON r.prospect_id = p.id
         WHERE p.id = $1`,
        [prospectId],
      );
    });

    if (!joined) throw new NonRetriableError(`prospect+research ${prospectId} not found`);

    await step.run("mark-drafting", async () => {
      await query(`UPDATE prospects SET status = 'drafting' WHERE id = $1`, [prospectId]);
      await query(
        `INSERT INTO jobs (prospect_id, kind, status) VALUES ($1, 'draft', 'running')`,
        [prospectId],
      );
    });

    const { drafts, model } = await step.run("anthropic-draft", async () => {
      return draftMessages({
        prospect: {
          companyName: joined.company_name,
          contactName: joined.contact_name,
          contactTitle: joined.contact_title,
        },
        research: joined.research_json,
      });
    });

    await step.run("persist-drafts", async () => {
      await query(
        `INSERT INTO drafts (prospect_id, connect_note, dm1, dm2, dm3, model)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (prospect_id) DO UPDATE SET
           connect_note = EXCLUDED.connect_note,
           dm1 = EXCLUDED.dm1,
           dm2 = EXCLUDED.dm2,
           dm3 = EXCLUDED.dm3,
           model = EXCLUDED.model,
           generated_at = NOW()`,
        [prospectId, drafts.connectNote, drafts.dm1, drafts.dm2, drafts.dm3, model],
      );
      await query(`UPDATE prospects SET status = 'ready' WHERE id = $1`, [prospectId]);
      await query(
        `UPDATE jobs SET status = 'succeeded', finished_at = NOW()
         WHERE prospect_id = $1 AND kind = 'draft' AND status = 'running'`,
        [prospectId],
      );
    });

    await step.sendEvent("emit-drafted", {
      name: "outbound/prospect.drafted",
      data: { prospectId },
    });

    return { ok: true };
  },
);
