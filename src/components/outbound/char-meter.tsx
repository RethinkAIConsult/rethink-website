import { cn } from "@/lib/utils";

export interface CharMeterProps {
  len: number;
  max?: number;
  className?: string;
}

export function CharMeter({ len, max = 300, className }: CharMeterProps) {
  const isOver = len > max;
  const isNear = !isOver && len >= max * 0.9;

  return (
    <span
      className={cn(
        "metric text-xs tabular-nums",
        isOver  ? "text-destructive" :
        isNear  ? "text-amber-500 dark:text-amber-400" :
                  "text-muted-foreground",
        className
      )}
      aria-label={`${len} of ${max} characters`}
    >
      {len} / {max}
    </span>
  );
}
