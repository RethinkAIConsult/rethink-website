// Inngest function: process a Parallel Monitor event detection.
// Trigger: "outbound/monitor.detected" (emitted by /api/parallel/webhook).
// Steps: fetch event detail -> map to candidates -> INSERT ON CONFLICT DO NOTHING
//        -> UPDATE monitors.last_event_at.
// NEVER auto-sends anything. Only stocks the candidates table.

import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { query, queryOne } from "@/lib/db";
import { hasParallel, hasDb } from "@/lib/env";
import { getMonitorEvents } from "@/lib/parallel-monitor";
import type { MonitorRow } from "@/lib/types";

export const monitorEvent = inngest.createFunction(
  {
    id: "outbound-monitor-event",
    name: "Outbound: Process Monitor Event",
    concurrency: { limit: 5 },
    retries: 2,
    triggers: [{ event: "outbound/monitor.detected" }],
  },
  async ({ event, step }) => {
    const { monitorRowId, monitorId, eventGroupId } = event.data as {
      monitorRowId: string;
      monitorId: string;
      eventGroupId: string;
    };

    // Guard: Parallel must be configured; without it there is nothing to fetch.
    if (!hasParallel()) {
      throw new NonRetriableError("PARALLEL_API_KEY not configured — monitor-event cannot run");
    }

    // Load the monitors row so we have campaign_id and can verify the row exists.
    const monitorRow = await step.run("load-monitor-row", async () => {
      if (!hasDb()) return null;
      return queryOne<MonitorRow>(
        `SELECT id, campaign_id, objective, status FROM monitors WHERE id = $1`,
        [monitorRowId],
      );
    });

    if (!monitorRow) {
      // Permanent — the row was deleted or the ID is wrong; retrying won't help.
      throw new NonRetriableError(`monitors row ${monitorRowId} not found`);
    }

    // Fetch the event detail from Parallel.
    const eventsResult = await step.run("fetch-monitor-events", async () => {
      return getMonitorEvents(monitorId, eventGroupId);
    });

    if ("skipped" in eventsResult) {
      // Parallel credentials disappeared mid-run — not retriable.
      throw new NonRetriableError(`getMonitorEvents skipped: ${eventsResult.skipped}`);
    }

    const { candidates } = eventsResult;

    // Insert candidates ON CONFLICT DO NOTHING — same idempotency pattern as discover-prospects.
    const insertedCount = await step.run("insert-candidates", async () => {
      if (!hasDb() || candidates.length === 0) return 0;
      let inserted = 0;
      for (const c of candidates) {
        if (c.url) {
          const rows = await query<{ id: string }>(
            `INSERT INTO candidates
               (campaign_id, discovery_run_id, source, entity_type, name, url, description,
                signal, citations, raw_json, fit_score, status, created_by)
             VALUES ($1, NULL, $2, 'company', $3, $4, $5, $6, $7::jsonb, $8::jsonb, NULL, 'new', 'monitor')
             ON CONFLICT (campaign_id, url) DO NOTHING
             RETURNING id`,
            [
              monitorRow.campaign_id,
              c.source,
              c.name,
              c.url,
              c.description,
              c.signal,
              JSON.stringify(c.citations),
              JSON.stringify(c.raw_json),
            ],
          );
          if (rows.length > 0) inserted++;
        } else {
          // No URL — insert without URL-based conflict guard (same rationale as discover-prospects).
          await query(
            `INSERT INTO candidates
               (campaign_id, discovery_run_id, source, entity_type, name, url, description,
                signal, citations, raw_json, fit_score, status, created_by)
             VALUES ($1, NULL, $2, 'company', $3, NULL, $4, $5, $6::jsonb, $7::jsonb, NULL, 'new', 'monitor')`,
            [
              monitorRow.campaign_id,
              c.source,
              c.name,
              c.description,
              c.signal,
              JSON.stringify(c.citations),
              JSON.stringify(c.raw_json),
            ],
          );
          inserted++;
        }
      }
      return inserted;
    });

    // Stamp last_event_at so the dashboard can show freshness.
    await step.run("update-last-event-at", async () => {
      if (!hasDb()) return;
      await query(
        `UPDATE monitors SET last_event_at = NOW() WHERE id = $1`,
        [monitorRowId],
      );
    });

    return {
      ok: true,
      monitorRowId,
      monitorId,
      eventGroupId,
      candidatesFound: candidates.length,
      candidatesInserted: insertedCount,
    };
  },
);
