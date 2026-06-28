// Public webhook handler for Parallel AI Monitor events.
// NOT under the Clerk auth matcher — Parallel must call this without a session.
// Payload: { type: "monitor.event.detected", data: { monitor_id, event: { event_group_id }, metadata } }
// On detection: emit Inngest "outbound/monitor.detected" for durable processing.
// Returns 200 quickly — never blocks on downstream work.

import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { inngest } from "@/inngest/client";
import { queryOne } from "@/lib/db";
import { hasDb, hasInngest } from "@/lib/env";
import type { MonitorRow } from "@/lib/types";

// Verify the shared secret. Prefers the x-webhook-secret header; falls back to
// the ?secret= query param ONLY because Parallel Monitor webhooks cannot attach
// custom headers (the secret must travel in the registered URL). Fails CLOSED
// when no secret is configured, and compares in constant time.
// Defence in depth: even a spoofed call only triggers an authenticated GET we
// control, scoped to a monitor_id that must already exist in our own DB.
function isAuthorized(req: Request): boolean {
  const secret = process.env.PARALLEL_WEBHOOK_SECRET;
  if (!secret) return false; // fail closed — no secret means no access
  const url = new URL(req.url);
  const provided =
    req.headers.get("x-webhook-secret") ?? url.searchParams.get("secret") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type ParallelWebhookPayload = {
  type: string;
  timestamp?: string;
  data: {
    monitor_id: string;
    event: {
      event_group_id: string;
    };
    metadata?: Record<string, string>;
  };
};

export async function POST(req: Request) {
  // Auth check first — fast, no DB.
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: ParallelWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  // Only act on the detection event; ignore lifecycle events (monitor.created, etc.).
  if (payload.type !== "monitor.event.detected") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const { monitor_id, event } = payload.data;
  const eventGroupId = event?.event_group_id;

  if (!monitor_id || !eventGroupId) {
    return NextResponse.json({ error: "missing monitor_id or event_group_id" }, { status: 400 });
  }

  // Resolve the internal monitors row — needed to pass the UUID to Inngest.
  let monitorRowId: string | null = null;
  if (hasDb()) {
    const row = await queryOne<Pick<MonitorRow, "id">>(
      `SELECT id FROM monitors WHERE monitor_id = $1 LIMIT 1`,
      [monitor_id],
    );
    monitorRowId = row?.id ?? null;
  }

  // Emit to Inngest for durable processing. Fire-and-forget; 200 returns immediately.
  if (hasInngest() && monitorRowId) {
    await inngest.send({
      name: "outbound/monitor.detected",
      data: {
        monitorRowId,
        monitorId: monitor_id,
        eventGroupId,
      },
    });
  }

  return NextResponse.json({ ok: true, monitorRowId });
}
