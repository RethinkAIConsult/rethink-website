// Parallel AI Monitor v1 client — always-on sourcing (event_stream type).
// Reference: agency-os/skills/parallel-ai-patterns/SKILL.md (Monitor API section).
// Auth: x-api-key header (NOT Authorization: Bearer).
// Base: https://api.parallel.ai/v1
//
// This module NEVER sends outreach. It only stocks candidates.
// cancel() is terminal — there is no pause/resume; use trigger() for immediate runs.

import { hasParallel, SKIPPED_NO_CREDENTIALS } from "./env";
import type { NormalizedCandidate } from "./parallel-discovery";

const PARALLEL_BASE = "https://api.parallel.ai/v1";

// ------------------------------------------------------------------
// Internal fetch helper
// ------------------------------------------------------------------

async function monitorFetch(path: string, init?: RequestInit): Promise<unknown> {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) throw new Error("PARALLEL_API_KEY not set");
  const res = await fetch(`${PARALLEL_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Parallel Monitor ${path} ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

type MonitorCreateResponse = {
  monitor_id: string;
  type: string;
  status: string;
  frequency: string;
  processor: string;
  settings: { query: string };
  webhook?: { url: string; event_types: string[] };
  metadata?: Record<string, string>;
  created_at: string;
};

type MonitorEventsResponse = {
  events: Array<{
    event_id: string;
    event_group_id: string;
    event_date: string;
    event_type: string;
    output?: {
      content?: unknown;
      basis?: Array<{
        field: string;
        citations?: Array<{ title?: string; url?: string; excerpts?: string[] }>;
        reasoning?: string;
        confidence?: number | string | null;
      }>;
    };
    name?: string;
    url?: string;
    description?: string;
  }>;
};

// ------------------------------------------------------------------
// createEventStreamMonitor
// POST /v1/monitors — type:"event_stream", settings:{ query }
// Returns { monitorId } or { skipped } when PARALLEL_API_KEY absent.
// ------------------------------------------------------------------

export async function createEventStreamMonitor(opts: {
  objective: string;
  frequency: "1h" | "1d" | "1w";
  processor: "lite" | "base";
  webhookUrl: string;
  externalId: string;
}): Promise<{ monitorId: string } | { skipped: string }> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS };

  const data = (await monitorFetch("/monitors", {
    method: "POST",
    body: JSON.stringify({
      type: "event_stream",
      frequency: opts.frequency,
      processor: opts.processor,
      settings: { query: opts.objective },
      webhook: {
        url: opts.webhookUrl,
        event_types: ["monitor.event.detected"],
      },
      metadata: { external_id: opts.externalId },
    }),
  })) as MonitorCreateResponse;

  return { monitorId: data.monitor_id };
}

// ------------------------------------------------------------------
// cancelMonitor
// POST /v1/monitors/{id}/cancel — terminal; no pause/resume.
// ------------------------------------------------------------------

export async function cancelMonitor(
  monitorId: string,
): Promise<{ ok: boolean } | { skipped: string }> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS };
  await monitorFetch(`/monitors/${monitorId}/cancel`, { method: "POST" });
  return { ok: true };
}

// ------------------------------------------------------------------
// triggerMonitor
// POST /v1/monitors/{id}/trigger — forces an immediate off-cadence run.
// ------------------------------------------------------------------

export async function triggerMonitor(
  monitorId: string,
): Promise<{ ok: boolean } | { skipped: string }> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS };
  await monitorFetch(`/monitors/${monitorId}/trigger`, { method: "POST" });
  return { ok: true };
}

// ------------------------------------------------------------------
// getMonitorEvents
// GET /v1/monitors/{id}/events?event_group_id=...
// Maps event_stream events to NormalizedCandidate[] (source "parallel_findall"
// is reused here — Monitor surfaces the same cited entity shape as FindAll).
// ------------------------------------------------------------------

export async function getMonitorEvents(
  monitorId: string,
  eventGroupId: string,
): Promise<{ candidates: NormalizedCandidate[] } | { skipped: string }> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS };

  const data = (await monitorFetch(
    `/monitors/${monitorId}/events?event_group_id=${encodeURIComponent(eventGroupId)}`,
  )) as MonitorEventsResponse;

  const candidates: NormalizedCandidate[] = (data.events ?? []).map((evt) => {
    const basis = evt.output?.basis ?? [];
    const citations = basis.flatMap((b) =>
      (b.citations ?? []).map((cit) => ({
        field: b.field ?? "",
        title: cit.title ?? "",
        url: cit.url ?? "",
        excerpts: cit.excerpts ?? [],
        reasoning: b.reasoning ?? "",
        confidence:
          typeof b.confidence === "number" ? b.confidence : null,
      })),
    );

    // Derive a signal from the event output's first basis reasoning, or description.
    const signal =
      basis[0]?.reasoning ??
      (evt.description ?? null);

    return {
      source: "parallel_findall" as const, // Monitor surfaces the same entity shape as FindAll.
      entity_type: "company" as const,
      name: evt.name ?? String(evt.event_id),
      url: evt.url ?? null,
      description: evt.description ?? null,
      signal,
      source_keyword: null,
      citations,
      raw_json: evt,
      fit_score: null,
    };
  });

  return { candidates };
}
