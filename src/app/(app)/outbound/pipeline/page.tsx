import { query } from "@/lib/db";
import { hasDb } from "@/lib/env";
import { SectionHeader } from "@/components/outbound/section-header";
import { EmptyState } from "@/components/outbound/empty-state";
import { PipelineCard } from "./pipeline-card";
import type { OutreachRow } from "../angle/actions";

const COLUMNS = [
  { value: "connect_sent", label: "Sent" },
  { value: "connected", label: "Connected" },
  { value: "replied", label: "Replied" },
  { value: "call_booked", label: "Call booked" },
  { value: "won", label: "Won" },
];

export default async function PipelinePage() {
  let rows: OutreachRow[] = [];
  let passed: OutreachRow[] = [];
  if (hasDb()) {
    rows = await query<OutreachRow>(
      "SELECT * FROM outreach_research WHERE status IN ('connect_sent','connected','replied','call_booked','won') ORDER BY updated_at DESC",
    );
    passed = await query<OutreachRow>(
      "SELECT * FROM outreach_research WHERE status = 'passed' ORDER BY updated_at DESC LIMIT 60",
    );
  }
  const byStage = (s: string) => rows.filter((r) => r.status === s);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="PIPELINE"
        title="Outreach pipeline"
        subtitle="Everyone you've contacted, tracked from connection request to client. Move people along with the arrows as they progress."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="Nobody in the pipeline yet"
          description="Work the Queue and hit “I sent it → next”. Everyone you send a request to lands here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = byStage(col.value);
            return (
              <div key={col.value} className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="eyebrow text-muted-foreground">{col.label}</span>
                  <span className="rounded-full bg-foreground/10 px-2 text-[11px] font-semibold text-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <p className="px-1 text-xs text-muted-foreground">—</p>
                  ) : (
                    items.map((r) => <PipelineCard key={r.id} row={r} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {passed.length > 0 && (
        <details className="rounded-xl ring-1 ring-foreground/10 bg-card p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Passed ({passed.length})
          </summary>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {passed.map((r) => (
              <div key={r.id} className="rounded-lg border border-border px-3 py-2 text-xs">
                <span className="font-medium text-foreground">{r.contact_name}</span>
                <span className="text-muted-foreground"> · {r.company_name}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
