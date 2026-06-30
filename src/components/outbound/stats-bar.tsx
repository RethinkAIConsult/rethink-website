export interface StatsBarProps {
  queued: number;
  sentToday: number;
  contactedTotal: number;
}

export function StatsBar({ queued, sentToday, contactedTotal }: StatsBarProps) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground"
      aria-label="Outbound stats"
    >
      <span>
        <span className="metric text-foreground font-medium">{queued}</span>
        {" "}queued
      </span>
      <span aria-hidden="true" className="text-muted-foreground">·</span>
      <span>
        <span className="metric text-foreground font-medium">{sentToday}</span>
        {" "}sent today
      </span>
      <span aria-hidden="true" className="text-muted-foreground">·</span>
      <span>
        <span className="metric text-foreground font-medium">{contactedTotal}</span>
        {" "}contacted total
      </span>
    </div>
  );
}
