import Link from "next/link";
import { getFunnel } from "./angle/actions";
import { SectionHeader } from "@/components/outbound/section-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const f = await getFunnel();
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
    </div>
  );
}
