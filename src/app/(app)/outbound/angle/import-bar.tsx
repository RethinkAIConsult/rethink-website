"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { importCsv, researchPending } from "./actions";

export function ImportBar({ pending, ready }: { pending: number; ready: number }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, start] = useTransition();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    start(async () => {
      setMsg("Reading CSV…");
      const text = await f.text();
      const r = await importCsv(text);
      setMsg(r.ok ? `Imported ${r.imported}, skipped ${r.skipped} already in the list.` : r.error ?? "Import failed");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  }

  function research() {
    start(async () => {
      setMsg(`Researching ${Math.min(pending, 30)} contacts with Exa + DeepSeek. This takes a minute…`);
      const r = await researchPending(30);
      setMsg(
        r.ok
          ? `Researched ${r.researched}${r.failed ? `, ${r.failed} failed` : ""}. They're ready in the queue below.`
          : r.error ?? "Research failed",
      );
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl ring-1 ring-foreground/10 bg-card p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          Import Apollo CSV
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={onFile}
            disabled={busy}
          />
        </label>
        <Button onClick={research} disabled={busy || pending === 0}>
          {busy ? "Working…" : `Research ${pending} waiting`}
        </Button>
        <span className="text-sm text-muted-foreground">
          <b className="text-foreground">{ready}</b> ready · <b className="text-foreground">{pending}</b> waiting to research
        </span>
      </div>
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
      <p className="text-[11px] text-muted-foreground">
        Export a list from Apollo (Save selected → Export to CSV) and drop the file here. We pull name, title, company,
        LinkedIn URL and website, then research each one.
      </p>
    </div>
  );
}
