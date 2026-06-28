"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { setOutreachStatus } from "./actions";

const STEPS = [
  { value: "sent", label: "Sent" },
  { value: "replied", label: "Replied" },
  { value: "booked", label: "Booked" },
  { value: "passed", label: "Pass" },
] as const;

export function OutreachStatus({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-1">
      {STEPS.map((s) => {
        const active = status === s.value;
        return (
          <button
            key={s.value}
            type="button"
            disabled={pending}
            onClick={() => start(() => setOutreachStatus(id, s.value).then(() => {}))}
            className={cn(
              "rounded px-2 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-50",
              active
                ? s.value === "passed"
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
