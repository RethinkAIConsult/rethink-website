import { cn } from "@/lib/utils";
import type { ProspectStatus } from "@/lib/types";

interface StatusConfig {
  label: string;
  className: string;
}

const STATUS_MAP: Record<ProspectStatus, StatusConfig> = {
  // Pre-flight pipeline — outlined gray (QUEUED family)
  new:         { label: "QUEUED",      className: "border border-foreground/25 text-foreground/70 bg-transparent" },
  enriching:   { label: "ENRICHING",   className: "border border-foreground/25 text-foreground/70 bg-transparent" },
  researching: { label: "RESEARCHING", className: "border border-foreground/25 text-foreground/70 bg-transparent" },
  drafting:    { label: "DRAFTING",    className: "border border-foreground/25 text-foreground/70 bg-transparent" },
  ready:       { label: "READY",       className: "border border-foreground/25 text-foreground/70 bg-transparent" },

  // Sent / in-flight — outlined emerald
  connect_sent: { label: "CONNECT SENT", className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },
  connected:    { label: "CONNECTED",    className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },
  dm1_sent:     { label: "DM1 SENT",     className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },
  dm2_sent:     { label: "DM2 SENT",     className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },
  dm3_sent:     { label: "DM3 SENT",     className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },

  // Positive outcome — outlined emerald
  replied:     { label: "REPLIED",      className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },
  call_booked: { label: "CALL BOOKED",  className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },
  won:         { label: "WON",          className: "border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent" },

  // Negative outcome — muted red
  lost:    { label: "LOST",    className: "bg-destructive/10 text-destructive/70" },
  dropped: { label: "DROPPED", className: "bg-destructive/10 text-destructive/70" },
  failed:  { label: "FAILED",  className: "bg-destructive/10 text-destructive" },
};

export interface StatusBadgeProps {
  status: ProspectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? {
    label: status.toUpperCase().replace(/_/g, " "),
    className: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "metric inline-flex items-center rounded px-2 py-0.5 text-[10px] tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
