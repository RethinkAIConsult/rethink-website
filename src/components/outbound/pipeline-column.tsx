import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PipelineColumnProps {
  title: string;
  count: number;
  children: ReactNode;
  /** Optional accent colour class for the column header dot, e.g. "bg-primary" */
  accentClass?: string;
  className?: string;
}

export function PipelineColumn({
  title,
  count,
  children,
  accentClass = "bg-muted-foreground",
  className,
}: PipelineColumnProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Column header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <span
          className={cn("h-2 w-2 rounded-full shrink-0", accentClass)}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="metric ml-auto text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
