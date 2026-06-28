"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { query } from "@/lib/db";
import { hasDb, hasParallel, hasExa, hasInngest, hasClerk } from "@/lib/env";
import { inngest } from "@/inngest/client";
import { searchCompanies } from "@/lib/exa";
import { entitySearch } from "@/lib/parallel-discovery";
import {
  createEventStreamMonitor,
  cancelMonitor as cancelParallelMonitor,
  triggerMonitor as triggerParallelMonitor,
} from "@/lib/parallel-monitor";
import type { ProspectStatus, ProspectSource } from "@/lib/types";

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

async function requireUser(): Promise<string | null> {
  // Locally (no Clerk keys) there is no auth — act as a default local user so
  // the server actions work. On Vercel (keys present) require a real session.
  if (!hasClerk()) return "local-dev";
  const { userId } = await auth();
  return userId ?? null;
}

// ---------------------------------------------------------------------------
// markConnectSent
// ---------------------------------------------------------------------------

export async function markConnectSent(
  prospectId: string,
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  const updated = await query<{ id: string }>(
    `UPDATE prospects
     SET status = 'connect_sent', connect_sent_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND status = 'ready' AND created_by = $2
     RETURNING id`,
    [prospectId, userId],
  );

  // Only log the send row when the UPDATE actually changed a row.
  if (updated.length > 0) {
    await query(
      `INSERT INTO sends (prospect_id, channel, step, body, sent_by)
       SELECT $1, 'linkedin_connect', 'connect', COALESCE(d.connect_note, ''), $2
       FROM prospects p
       LEFT JOIN drafts d ON d.prospect_id = p.id
       WHERE p.id = $1`,
      [prospectId, userId],
    );
  }

  revalidatePath("/outbound");
  revalidatePath("/outbound/today");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// markDmSent
// ---------------------------------------------------------------------------

export async function markDmSent(
  prospectId: string,
  step: "dm1" | "dm2" | "dm3",
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  // Runtime allowlist — the union type does not protect against tampered server action args.
  const ALLOWED_STEPS = ["dm1", "dm2", "dm3"] as const;
  if (!(ALLOWED_STEPS as readonly string[]).includes(step)) {
    return { ok: false, error: "invalid step" };
  }

  const statusMap: Record<string, ProspectStatus> = {
    dm1: "dm1_sent",
    dm2: "dm2_sent",
    dm3: "dm3_sent",
  };
  const sentAtCol: Record<string, string> = {
    dm1: "dm1_sent_at",
    dm2: "dm2_sent_at",
    dm3: "dm3_sent_at",
  };

  const newStatus = statusMap[step];
  const col = sentAtCol[step];

  const updated = await query<{ id: string }>(
    `UPDATE prospects
     SET status = $2::prospect_status, ${col} = NOW(), updated_at = NOW()
     WHERE id = $1 AND created_by = $3
     RETURNING id`,
    [prospectId, newStatus, userId],
  );

  // Only log the send row when the UPDATE actually changed a row.
  if (updated.length > 0) {
    await query(
      `INSERT INTO sends (prospect_id, channel, step, body, sent_by)
       SELECT $1, 'linkedin_dm', $2, COALESCE(d.${step}, ''), $3
       FROM prospects p
       LEFT JOIN drafts d ON d.prospect_id = p.id
       WHERE p.id = $1`,
      [prospectId, step, userId],
    );
  }

  revalidatePath("/outbound");
  revalidatePath("/outbound/today");
  revalidatePath(`/outbound/${prospectId}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// advanceStatus
// ---------------------------------------------------------------------------

export async function advanceStatus(
  prospectId: string,
  status: ProspectStatus,
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  await query(
    `UPDATE prospects SET status = $2::prospect_status, updated_at = NOW()
     WHERE id = $1 AND created_by = $3`,
    [prospectId, status, userId],
  );

  revalidatePath("/outbound");
  revalidatePath("/outbound/today");
  revalidatePath(`/outbound/${prospectId}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// logReply
// ---------------------------------------------------------------------------

export async function logReply(
  prospectId: string,
  body: string,
  sentiment: "positive" | "neutral" | "negative" | "unsure",
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  await query(
    `INSERT INTO replies (prospect_id, body, sentiment, logged_by)
     VALUES ($1, $2, $3, $4)`,
    [prospectId, body, sentiment, userId],
  );

  await query(
    `UPDATE prospects SET status = 'replied', replied_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND created_by = $2 AND status NOT IN ('replied', 'call_booked', 'won', 'lost')`,
    [prospectId, userId],
  );

  revalidatePath("/outbound");
  revalidatePath(`/outbound/${prospectId}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// promoteCandidate
// ---------------------------------------------------------------------------

export async function promoteCandidate(
  candidateId: string,
): Promise<{ ok: boolean; error?: string; demo?: boolean; prospectId?: string }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  // Read candidate
  const candidates = await query<{
    id: string;
    name: string;
    url: string | null;
    source: ProspectSource;
    campaign_id: string | null;
  }>(
    `SELECT id, name, url, source, campaign_id FROM candidates WHERE id = $1 AND status = 'new' AND created_by = $2`,
    [candidateId, userId],
  );

  const candidate = candidates[0];
  if (!candidate) return { ok: false, error: "candidate not found or already promoted" };

  // Insert prospect
  const inserted = await query<{ id: string }>(
    `INSERT INTO prospects (company_name, company_url, source, campaign_id, created_by)
     VALUES ($1, $2, $3::prospect_source, $4, $5)
     RETURNING id`,
    [candidate.name, candidate.url, candidate.source, candidate.campaign_id, userId],
  );

  const prospectId = inserted[0]?.id;
  if (!prospectId) return { ok: false, error: "insert failed" };

  // Mark candidate promoted
  await query(
    `UPDATE candidates SET status = 'promoted', promoted_prospect_id = $2 WHERE id = $1`,
    [candidateId, prospectId],
  );

  // Emit event
  if (hasInngest()) {
    await inngest.send({
      name: "outbound/prospect.created",
      data: {
        prospectId,
        companyName: candidate.name,
        companyUrl: candidate.url,
        contactName: null,
        contactLinkedinUrl: null,
        createdBy: userId,
      },
    });
  }

  revalidatePath("/outbound");
  revalidatePath("/outbound/candidates");
  return { ok: true, prospectId };
}

// ---------------------------------------------------------------------------
// dismissCandidate
// ---------------------------------------------------------------------------

export async function dismissCandidate(
  candidateId: string,
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  await query(
    `UPDATE candidates SET status = 'dismissed' WHERE id = $1 AND status = 'new' AND created_by = $2`,
    [candidateId, userId],
  );

  revalidatePath("/outbound/candidates");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// runDiscovery
// ---------------------------------------------------------------------------

export async function runDiscovery(input: {
  engine: "parallel_findall" | "parallel_entity" | "exa";
  objective: string;
  matchLimit: number;
  campaignId: string | null;
}): Promise<{
  ok: boolean;
  runId?: string;
  error?: string;
  demo?: boolean;
  matched?: number;
  note?: string;
}> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  // Input bounds — no zod, manual clamp.
  const objective = input.objective.slice(0, 2000);
  const matchLimit = Math.max(1, Math.min(200, Math.floor(input.matchLimit)));

  const inserted = await query<{ id: string }>(
    `INSERT INTO discovery_runs (campaign_id, engine, objective, match_count, created_by)
     VALUES ($1, $2::discovery_engine, $3, 0, $4)
     RETURNING id`,
    [input.campaignId, input.engine, objective, userId],
  );

  const runId = inserted[0]?.id;
  if (!runId) return { ok: false, error: "insert failed" };

  // parallel_findall stays async — emit Inngest event if available, then return.
  if (input.engine === "parallel_findall") {
    if (hasInngest()) {
      await inngest.send({
        name: "outbound/discovery.requested",
        data: {
          runId,
          engine: input.engine,
          objective,
          campaignId: input.campaignId,
          matchLimit,
          createdBy: userId,
        },
      });
    }
    revalidatePath("/outbound/discover");
    revalidatePath("/outbound");
    return {
      ok: true,
      runId,
      note: "FindAll runs in the background via Inngest. Start the Inngest dev server (npx inngest-cli@latest dev) or deploy, then it will populate the inbox.",
    };
  }

  // exa and parallel_entity run inline — results are immediate.
  try {
    if (input.engine === "exa") {
      if (!hasExa()) {
        await query(
          `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
          [runId, "EXA_API_KEY not set"],
        );
        return { ok: false, error: "EXA_API_KEY not set" };
      }

      const result = await searchCompanies({ query: objective, numResults: matchLimit });

      // Gracefully handle skipped sentinel (key present but skipped).
      if (result.skipped) {
        await query(
          `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
          [runId, `Exa search skipped: ${result.skipped}`],
        );
        return { ok: false, error: `Exa search skipped: ${result.skipped}` };
      }

      let inserted = 0;
      for (const r of result.results) {
        if (r.url) {
          const rows = await query<{ id: string }>(
            `INSERT INTO candidates
               (campaign_id, discovery_run_id, source, entity_type, name, url, description,
                signal, citations, raw_json, fit_score, status, created_by)
             VALUES ($1, $2, 'exa', 'company', $3, $4, $5, $6, '[]'::jsonb, $7::jsonb, NULL, 'new', $8)
             ON CONFLICT (campaign_id, url) DO NOTHING
             RETURNING id`,
            [
              input.campaignId,
              runId,
              r.name,
              r.url,
              r.description ?? null,
              r.description ?? null,
              JSON.stringify(r.raw),
              userId,
            ],
          );
          if (rows.length > 0) inserted++;
        } else {
          await query(
            `INSERT INTO candidates
               (campaign_id, discovery_run_id, source, entity_type, name, url, description,
                signal, citations, raw_json, fit_score, status, created_by)
             VALUES ($1, $2, 'exa', 'company', $3, NULL, $4, $5, '[]'::jsonb, $6::jsonb, NULL, 'new', $7)`,
            [
              input.campaignId,
              runId,
              r.name,
              r.description ?? null,
              r.description ?? null,
              JSON.stringify(r.raw),
              userId,
            ],
          );
          inserted++;
        }
      }

      await query(
        `UPDATE discovery_runs SET status = 'succeeded', match_count = $2, finished_at = NOW() WHERE id = $1`,
        [runId, inserted],
      );

      revalidatePath("/outbound/discover");
      revalidatePath("/outbound");
      return { ok: true, runId, matched: inserted };
    }

    // parallel_entity
    if (!hasParallel()) {
      await query(
        `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
        [runId, "PARALLEL_API_KEY not set"],
      );
      return { ok: false, error: "PARALLEL_API_KEY not set" };
    }

    const result = await entitySearch({ objective, matchLimit });

    if (result.skipped) {
      await query(
        `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
        [runId, `Entity search skipped: ${result.skipped}`],
      );
      return { ok: false, error: `Entity search skipped: ${result.skipped}` };
    }

    let inserted = 0;
    for (const c of result.candidates) {
      if (c.url) {
        const rows = await query<{ id: string }>(
          `INSERT INTO candidates
             (campaign_id, discovery_run_id, source, entity_type, name, url, description,
              signal, citations, raw_json, fit_score, status, created_by)
           VALUES ($1, $2, 'parallel_entity', 'company', $3, $4, $5, $6, $7::jsonb, $8::jsonb, NULL, 'new', $9)
           ON CONFLICT (campaign_id, url) DO NOTHING
           RETURNING id`,
          [
            input.campaignId,
            runId,
            c.name,
            c.url,
            c.description ?? null,
            c.signal ?? null,
            JSON.stringify(c.citations),
            JSON.stringify(c.raw_json),
            userId,
          ],
        );
        if (rows.length > 0) inserted++;
      } else {
        await query(
          `INSERT INTO candidates
             (campaign_id, discovery_run_id, source, entity_type, name, url, description,
              signal, citations, raw_json, fit_score, status, created_by)
           VALUES ($1, $2, 'parallel_entity', 'company', $3, NULL, $4, $5, $6::jsonb, $7::jsonb, NULL, 'new', $8)`,
          [
            input.campaignId,
            runId,
            c.name,
            c.description ?? null,
            c.signal ?? null,
            JSON.stringify(c.citations),
            JSON.stringify(c.raw_json),
            userId,
          ],
        );
        inserted++;
      }
    }

    await query(
      `UPDATE discovery_runs SET status = 'succeeded', match_count = $2, finished_at = NOW() WHERE id = $1`,
      [runId, inserted],
    );

    revalidatePath("/outbound/discover");
    revalidatePath("/outbound");
    return { ok: true, runId, matched: inserted };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await query(
      `UPDATE discovery_runs SET status = 'failed', error = $2, finished_at = NOW() WHERE id = $1`,
      [runId, message],
    );
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// updateDrafts — edit the four draft fields for a prospect
// ---------------------------------------------------------------------------

export async function updateDrafts(
  prospectId: string,
  drafts: {
    connect_note: string;
    dm1: string;
    dm2: string;
    dm3: string;
  },
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  // Validate lengths: LinkedIn connect note cap + sane DM cap.
  if (drafts.connect_note.length > 300) {
    return { ok: false, error: "connect_note exceeds 300 characters" };
  }
  const DM_MAX = 2000;
  if (
    drafts.dm1.length > DM_MAX ||
    drafts.dm2.length > DM_MAX ||
    drafts.dm3.length > DM_MAX
  ) {
    return { ok: false, error: `DM fields must be ${DM_MAX} characters or fewer` };
  }

  // Ownership: only touch the drafts row when prospect.created_by = userId.
  const updated = await query<{ prospect_id: string }>(
    `UPDATE drafts d
     SET connect_note = $2, dm1 = $3, dm2 = $4, dm3 = $5, generated_at = NOW()
     FROM prospects p
     WHERE d.prospect_id = p.id
       AND p.id = $1
       AND p.created_by = $6
     RETURNING d.prospect_id`,
    [prospectId, drafts.connect_note, drafts.dm1, drafts.dm2, drafts.dm3, userId],
  );

  if (updated.length === 0) {
    return { ok: false, error: "drafts not found or not authorised" };
  }

  revalidatePath(`/outbound/${prospectId}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// regenerateDrafts — reset prospect to re-draft state and fire the pipeline
// ---------------------------------------------------------------------------

export async function regenerateDrafts(
  prospectId: string,
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  // Load prospect + research to reconstruct the event payload.
  // Ownership scoped by created_by.
  const rows = await query<{
    fit_score: number | null;
    uses_n8n: string | null;
    pain_signal: string | null;
  }>(
    `SELECT p.fit_score, r.uses_n8n, r.pain_signal
     FROM prospects p
     LEFT JOIN research r ON r.prospect_id = p.id
     WHERE p.id = $1 AND p.created_by = $2`,
    [prospectId, userId],
  );

  if (rows.length === 0) {
    return { ok: false, error: "prospect not found or not authorised" };
  }

  const row = rows[0];
  const fitScore = row.fit_score ?? 0;
  const hasUsableSignal =
    fitScore >= 6 &&
    (row.uses_n8n === "yes_first_party_evidence" || row.pain_signal !== null);

  // Reset status to 'drafting' so the UI reflects in-progress state.
  await query(
    `UPDATE prospects SET status = 'drafting', updated_at = NOW()
     WHERE id = $1 AND created_by = $2`,
    [prospectId, userId],
  );

  if (hasInngest()) {
    await inngest.send({
      name: "outbound/prospect.researched",
      data: {
        prospectId,
        fitScore,
        hasUsableSignal,
      },
    });
  }

  revalidatePath(`/outbound/${prospectId}`);
  revalidatePath("/outbound");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// createMonitor — insert a monitors row and register with Parallel if available
// ---------------------------------------------------------------------------

export async function createMonitor(input: {
  objective: string;
  frequency: "1h" | "1d" | "1w";
}): Promise<{ ok: boolean; monitorId?: string; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  const objective = input.objective.slice(0, 2000).trim();
  if (!objective) return { ok: false, error: "objective is required" };

  const ALLOWED_FREQUENCIES = ["1h", "1d", "1w"] as const;
  if (!(ALLOWED_FREQUENCIES as readonly string[]).includes(input.frequency)) {
    return { ok: false, error: "invalid frequency" };
  }

  // Insert the local row first (we have a DB row regardless of Parallel availability).
  const inserted = await query<{ id: string }>(
    `INSERT INTO monitors (objective, frequency, processor, created_by)
     VALUES ($1, $2, 'lite', $3)
     RETURNING id`,
    [objective, input.frequency, userId],
  );

  const rowId = inserted[0]?.id;
  if (!rowId) return { ok: false, error: "insert failed" };

  // Register with Parallel if credentials are present.
  if (hasParallel()) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const webhookSecret = process.env.PARALLEL_WEBHOOK_SECRET ?? "";
    // Parallel Monitor webhooks cannot attach custom headers, so the shared
    // secret has to travel in the registered URL. The receiving endpoint
    // (/api/parallel/webhook) fails closed and compares in constant time; use a
    // long random secret (openssl rand -hex 32). Require BOTH pieces — a webhook
    // with no secret would be rejected by the endpoint anyway, so don't register one.
    const webhookUrl =
      siteUrl && webhookSecret
        ? `${siteUrl}/api/parallel/webhook?secret=${encodeURIComponent(webhookSecret)}`
        : "";

    if (webhookUrl) {
      try {
        const result = await createEventStreamMonitor({
          objective,
          frequency: input.frequency,
          processor: "lite",
          webhookUrl,
          externalId: rowId,
        });

        if ("monitorId" in result) {
          await query(
            `UPDATE monitors SET monitor_id = $2 WHERE id = $1`,
            [rowId, result.monitorId],
          );
        }
      } catch {
        // Non-fatal: the row is created, webhook registration will be retried or done manually.
      }
    }
  }

  revalidatePath("/outbound/discover");
  return { ok: true, monitorId: rowId };
}

// ---------------------------------------------------------------------------
// cancelMonitorAction — cancel a monitor row and the Parallel monitor if wired
// ---------------------------------------------------------------------------

export async function cancelMonitorAction(
  rowId: string,
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  // Load the monitor (scope to created_by for ownership).
  const rows = await query<{ monitor_id: string | null }>(
    `SELECT monitor_id FROM monitors WHERE id = $1 AND created_by = $2 AND status = 'active'`,
    [rowId, userId],
  );

  if (rows.length === 0) return { ok: false, error: "monitor not found or already cancelled" };

  const { monitor_id } = rows[0];

  // Cancel with Parallel if we have a remote monitor_id.
  if (monitor_id && hasParallel()) {
    try {
      await cancelParallelMonitor(monitor_id);
    } catch {
      // Non-fatal: mark locally cancelled regardless.
    }
  }

  await query(
    `UPDATE monitors SET status = 'cancelled' WHERE id = $1`,
    [rowId],
  );

  revalidatePath("/outbound/discover");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// triggerMonitorAction — fire an immediate off-cadence run
// ---------------------------------------------------------------------------

export async function triggerMonitorAction(
  rowId: string,
): Promise<{ ok: boolean; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "unauthorized" };
  if (!hasDb()) return { ok: false, demo: true };

  const rows = await query<{ monitor_id: string | null }>(
    `SELECT monitor_id FROM monitors WHERE id = $1 AND created_by = $2 AND status = 'active'`,
    [rowId, userId],
  );

  if (rows.length === 0) return { ok: false, error: "monitor not found" };

  const { monitor_id } = rows[0];
  if (!monitor_id) return { ok: false, error: "monitor not yet registered with Parallel" };

  if (!hasParallel()) return { ok: false, error: "Parallel not configured" };

  try {
    await triggerParallelMonitor(monitor_id);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "trigger failed" };
  }

  revalidatePath("/outbound/discover");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// addManualProspects — parity with /api/outbound/prospects POST
// ---------------------------------------------------------------------------

interface ManualProspectLine {
  companyName: string;
  companyUrl?: string | null;
  contactName?: string | null;
  contactLinkedinUrl?: string | null;
}

export async function addManualProspects(
  lines: ManualProspectLine[],
): Promise<{ ok: boolean; created: number; error?: string; demo?: boolean }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, created: 0, error: "unauthorized" };
  if (!hasDb()) return { ok: false, created: 0, demo: true };

  const created: Array<{
    id: string;
    companyName: string;
    companyUrl: string | null;
    contactName: string | null;
    contactLinkedinUrl: string | null;
  }> = [];

  // Input bounds — cap array and clamp string fields.
  const bounded = lines.slice(0, 100);

  for (const line of bounded) {
    if (!line.companyName?.trim()) continue;

    const companyName = line.companyName.trim().slice(0, 200);
    const companyUrl = line.companyUrl ? line.companyUrl.slice(0, 200) : null;
    const contactName = line.contactName ? line.contactName.slice(0, 200) : null;
    const contactLinkedinUrl = line.contactLinkedinUrl
      ? line.contactLinkedinUrl.slice(0, 200)
      : null;

    const rows = await query<{ id: string }>(
      `INSERT INTO prospects (company_name, company_url, contact_name, contact_linkedin_url, source, created_by)
       VALUES ($1, $2, $3, $4, 'manual'::prospect_source, $5)
       RETURNING id`,
      [
        companyName,
        companyUrl,
        contactName,
        contactLinkedinUrl,
        userId,
      ],
    );

    const id = rows[0]?.id;
    if (id) {
      created.push({
        id,
        companyName,
        companyUrl,
        contactName,
        contactLinkedinUrl,
      });
    }
  }

  if (hasInngest() && created.length > 0) {
    await inngest.send(
      created.map((c) => ({
        name: "outbound/prospect.created" as const,
        data: {
          prospectId: c.id,
          companyName: c.companyName,
          companyUrl: c.companyUrl,
          contactName: c.contactName,
          contactLinkedinUrl: c.contactLinkedinUrl,
          createdBy: userId,
        },
      })),
    );
  }

  revalidatePath("/outbound");
  return { ok: true, created: created.length };
}
