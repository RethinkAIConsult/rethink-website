"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setOutreachStatus, type OutreachRow } from "../angle/actions";

const STAGES = [
  { value: "connect_sent", label: "Sent" },
  { value: "connected", label: "Connected" },
  { value: "replied", label: "Replied" },
  { value: "call_booked", label: "Call booked" },
  { value: "won", label: "Won" },
];

export function PipelineCard({ row }: { row: OutreachRow }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const idx = STAGES.findIndex((s) => s.value === row.status);

  function set(status: string) {
    start(() => setOutreachStatus(row.id, status).then(() => router.refresh()));
  }

  return (
    <div className="rounded-lg ring-1 ring-foreground/10 bg-card p-3 space-y-2">
      <div>
        <p className="text-sm font-medium leading-snug text-foreground">{row.contact_name}</p>
        {row.contact_title && (
          <p className="text-[11px] text-muted-foreground leading-tight">{row.contact_title}</p>
        )}
        <p className="text-xs text-foreground">{row.company_name}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {idx > 0 && (
          <button
            type="button"
            disabled={pending}
            onClick={() => set(STAGES[idx - 1].value)}
            title={`Back to ${STAGES[idx - 1].label}`}
            className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            ←
          </button>
        )}
        {idx < STAGES.length - 1 ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => set(STAGES[idx + 1].value)}
            className="rounded bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            → {STAGES[idx + 1].label}
          </button>
        ) : (
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Client ✓</span>
        )}
        {row.linkedin_url && (
          <a
            href={row.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-medium text-primary hover:underline"
          >
            LinkedIn ↗
          </a>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => set("passed")}
          className="ml-auto text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          Pass
        </button>
      </div>
    </div>
  );
}
