import Link from "next/link";
import { getFunnel, getIcpInsights } from "./angle/actions";
import { SectionHeader } from "@/components/outbound/section-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const [f, insights] = await Promise.all([getFunnel(), getIcpInsights()]);
  const ready = f["ready"] ?? 0;
  const sentToday = f["sent_today"] ?? 0;

  const stages = [
    { label: "In queue", value: ready, accent: "text-foreground" },
    { label: "Sent", value: f["connect_sent"] ?? 0, accent: "text-blue-600 dark:text-blue-400" },
    { label: "Connected", value: f["connected"] ?? 0, accent: "text-blue-600 dark:text-blue-400" },
    { label: "Replied", value: f["replied"] ?? 0, accent: "text-amber-600 dark:text-amber-400" },
    { label: "Call booked", value: f["call_booked"] ?? 0, accent: "text-emerald-600 dark:text-emerald-400" },
    { label: "Won", value: f["won"] ?? 0, accent: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="DASHBOARD"
        title="Outreach"
        subtitle="Your funnel from connection request to client. Work the queue daily; everyone you contact is tracked in the pipeline."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stages.map((s) => (
          <div key={s.label} className="rounded-xl ring-1 ring-foreground/10 bg-card p-4">
            <div className={cn("metric text-3xl font-semibold tabular-nums", s.accent)}>{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/outbound/angle" className={cn(buttonVariants())}>
          Work the queue{ready ? ` (${ready} ready)` : ""}
        </Link>
        <Link href="/outbound/pipeline" className={cn(buttonVariants({ variant: "outline" }))}>
          View pipeline
        </Link>
        <span className="text-sm text-muted-foreground">
          {sentToday} request{sentToday === 1 ? "" : "s"} sent today.
        </span>
      </div>

      {/* ICP learning — which segments actually reply and sign */}
      <div>
        <SectionHeader
          eyebrow="ICP SIGNAL"
          title="What's converting"
          subtitle="Every contacted prospect is saved with its segment. As replies and wins land, the segments that convert surface here, so the ICP comes from real outcomes."
        />
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No outcomes yet. Send connection requests from the queue, and as people reply and sign, the winning segments will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Industry</th>
                  <th className="px-4 py-2.5 font-medium text-right">Sent</th>
                  <th className="px-4 py-2.5 font-medium text-right">Replied</th>
                  <th className="px-4 py-2.5 font-medium text-right">Won</th>
                </tr>
              </thead>
              <tbody>
                {insights.map((r) => (
                  <tr key={`${r.company_type}-${r.industry}`} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {r.company_type === "tech_product" ? "Tech product" : r.company_type === "non_tech_operating" ? "Operating" : "Unknown"}
                    </td>
                    <td className="px-4 py-2.5 capitalize text-foreground">{r.industry}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{r.sent}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-amber-600 dark:text-amber-400">{r.replied}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">{r.won}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
