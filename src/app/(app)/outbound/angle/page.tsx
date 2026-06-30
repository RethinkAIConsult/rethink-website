import { query, queryOne } from "@/lib/db";
import { hasDb, hasOpenRouter, hasApollo } from "@/lib/env";
import { SectionHeader } from "@/components/outbound/section-header";
import { EmptyState } from "@/components/outbound/empty-state";
import { ImportBar } from "./import-bar";
import { BufferKeeper } from "./buffer-keeper";
import { QueueCard } from "./queue-card";
import { AngleForm } from "./angle-form";
import { OutreachStatus } from "./outreach-status";
import type { OutreachRow } from "./actions";

function fmtDate(d: string | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const STATUS_STYLE: Record<string, string> = {
  sent: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  replied: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  booked: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  passed: "bg-muted text-muted-foreground line-through",
};

export default async function AnglePage() {
  let counts: Record<string, number> = {};
  let next: OutreachRow | null = null;
  let worked: OutreachRow[] = [];
  let creditsUsed = 0;
  let sentToday = 0;

  if (hasDb()) {
    const cr = await queryOne<{ n: string }>("SELECT COALESCE(sum(revealed),0) AS n FROM apollo_activity");
    creditsUsed = Number(cr?.n ?? 0);
    const rows = await query<{ status: string; n: string }>(
      "SELECT status, count(*) AS n FROM outreach_research GROUP BY status",
    );
    counts = Object.fromEntries(rows.map((r) => [r.status, Number(r.n)]));
    next = await queryOne<OutreachRow>(
      // warm leads (e.g. Stratasys) jump to the front, then oldest cold leads
      "SELECT * FROM outreach_research WHERE status = 'ready' ORDER BY (source = 'warm') DESC, created_at ASC LIMIT 1",
    );
    worked = await query<OutreachRow>(
      "SELECT * FROM outreach_research WHERE status IN ('connect_sent','connected','replied','booked','won') ORDER BY COALESCE(sent_at, created_at) DESC LIMIT 30",
    );
    const st = await queryOne<{ n: string }>(
      "SELECT count(*) AS n FROM outreach_research WHERE sent_at >= CURRENT_DATE",
    );
    sentToday = Number(st?.n ?? 0);
  }

  const pending = counts["pending"] ?? 0;
  const ready = counts["ready"] ?? 0;
  const sentTotal =
    (counts["connect_sent"] ?? 0) +
    (counts["connected"] ?? 0) +
    (counts["replied"] ?? 0) +
    (counts["booked"] ?? 0) +
    (counts["won"] ?? 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="QUEUE"
        title="Work your list"
        subtitle="Import a batch from Apollo, research them, then work one card at a time. Open LinkedIn, copy the note, send it, hit next."
      />

      {!hasOpenRouter() && (
        <p className="rounded-lg bg-amber-500/10 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
          Add OPENROUTER_API_KEY to enable research.
        </p>
      )}

      {hasApollo() && <BufferKeeper ready={ready} creditsUsed={creditsUsed} />}

      {/* The focus card — the hero, one at a time */}
      {next ? (
        <QueueCard row={next} remaining={ready} sentToday={sentToday} />
      ) : pending > 0 ? (
        <EmptyState
          title={`${pending} contacts waiting`}
          description="Open Tools below and hit “Research waiting”, then work the queue here."
        />
      ) : (
        <EmptyState
          title="Queue is empty"
          description="Open Tools below to import or research contacts."
        />
      )}

      {/* Tools & import — collapsed out of the working view */}
      <details className="rounded-xl ring-1 ring-foreground/10 bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium text-foreground">Tools &amp; import</summary>
        <div className="space-y-4 pt-4">
          <ImportBar pending={pending} ready={ready} />
          <div>
            <p className="eyebrow text-muted-foreground mb-2">Research one contact manually</p>
            <AngleForm />
          </div>
        </div>
      </details>

      {/* Progress log */}
      <SectionHeader eyebrow="LOG" title={`Contacted (${sentTotal})`} />
      {worked.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nobody contacted yet. Work the queue above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Contact</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Sent</th>
              </tr>
            </thead>
            <tbody>
              {worked.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{r.contact_name}</span>
                    <span className="text-muted-foreground"> · {r.company_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mb-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[r.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {r.status}
                    </span>
                    <OutreachStatus id={r.id} status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {fmtDate(r.sent_at ?? r.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
