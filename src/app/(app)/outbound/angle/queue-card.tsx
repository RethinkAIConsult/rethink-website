"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setOutreachStatus, type OutreachRow } from "./actions";
import { cn } from "@/lib/utils";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ml-1.5 rounded border border-current/25 px-1 text-[9px] font-semibold leading-tight opacity-60">
      {children}
    </kbd>
  );
}

function cleanTitle(t: string): string {
  // "Chief Operating Officer (COO) & Executive Director" -> "Chief Operating Officer"
  return t.split(/[,(&]| and /i)[0].trim();
}
function ensureHttp(u: string): string {
  return /^https?:\/\//.test(u) ? u : "https://" + u;
}
function prettyDomain(u: string): string {
  return u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
}

export function QueueCard({
  row,
  remaining,
  sentToday = 0,
  target = 10,
}: {
  row: OutreachRow;
  remaining: number;
  sentToday?: number;
  target?: number;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState(false);

  const note = row.connect_note ?? "";
  const liHref =
    row.linkedin_url ??
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      row.contact_name + " " + row.company_name,
    )}`;

  async function doCopy() {
    if (!note) return;
    try {
      await navigator.clipboard.writeText(note);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = note;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  function openLi() {
    window.open(liHref, "_blank", "noopener,noreferrer");
    setOpened(true);
  }
  function copyAndOpen() {
    doCopy();
    openLi();
  }
  function advance(status: string) {
    setError(false);
    start(() =>
      setOutreachStatus(row.id, status)
        .then((r) => {
          if (!r?.ok) { setError(true); return; }
          router.refresh();
        })
        .catch(() => setError(true)),
    );
  }

  // keyboard shortcuts: C copy · L open LinkedIn · Enter/S sent · X skip
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === "c") { e.preventDefault(); doCopy(); }
      else if (k === "l") { e.preventDefault(); openLi(); }
      else if (k === "enter" || k === "s") { e.preventDefault(); advance("connect_sent"); }
      else if (k === "x") { e.preventDefault(); advance("passed"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.id, note, liHref]);

  const pct = Math.min(100, Math.round((sentToday / Math.max(1, target)) * 100));

  return (
    <div
      key={row.id}
      className="animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
    >
      {/* daily progress strip */}
      <div className="h-1 w-full bg-muted">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <div className="p-6">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{row.contact_name}</h2>
            <p className="text-sm text-muted-foreground">
              {row.contact_title ? cleanTitle(row.contact_title) + " · " : ""}
              <span className="font-medium text-foreground">{row.company_name}</span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs font-semibold tabular-nums text-foreground">
              {sentToday}/{target} <span className="font-normal text-muted-foreground">today</span>
            </div>
            <div className="text-[11px] text-muted-foreground">{remaining} in queue</div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          {/* LEFT — note hero + actions */}
          <div className="space-y-4">
            {(row.pain_hook || row.angle) && (
              <div className="rounded-lg border-l-2 border-primary bg-primary/5 px-4 py-2.5">
                <p className="eyebrow text-primary">Why now</p>
                <p className="mt-0.5 text-sm leading-relaxed text-foreground">{row.pain_hook || row.angle}</p>
              </div>
            )}

            <div
              className="rounded-xl border bg-background p-4 transition-colors duration-200"
              style={{ borderColor: copied ? "rgb(52 211 153)" : undefined }}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="eyebrow text-muted-foreground">Connection note</p>
                <button
                  type="button"
                  onClick={doCopy}
                  className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  {copied ? "✓ Copied" : "Copy"}
                  <Kbd>C</Kbd>
                </button>
              </div>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                {note || "(no note generated — skip, or write one below)"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyAndOpen}
                className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Copy &amp; open LinkedIn ↗<Kbd>L</Kbd>
              </button>
              <button
                type="button"
                onClick={() => advance("connect_sent")}
                disabled={pending}
                className={cn(
                  "inline-flex h-10 items-center rounded-lg px-5 text-sm font-semibold text-primary-foreground transition-all disabled:opacity-60",
                  opened ? "bg-primary hover:bg-[#1D4ED8]" : "bg-primary/60 hover:bg-primary",
                )}
                title={opened ? "" : "Copy & open LinkedIn first"}
              >
                {pending ? "Loading next…" : "I sent it"}
                <Kbd>↵</Kbd>
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => advance("passed")}
                disabled={pending}
                className="rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                Skip<Kbd>X</Kbd>
              </button>
            </div>
            {error && <p className="text-xs text-red-600 dark:text-red-400">Could not save, try again.</p>}
          </div>

          {/* RIGHT — company context */}
          <div className="space-y-3.5 lg:border-l lg:border-border lg:pl-5">
            {row.research_summary && <Ctx label="What they do">{row.research_summary}</Ctx>}
            {row.angle && row.pain_hook && <Ctx label="The angle">{row.angle}</Ctx>}
            <div className="flex flex-col gap-1 pt-1">
              {row.company_url && (
                <a
                  href={ensureHttp(row.company_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {prettyDomain(row.company_url)} ↗
                </a>
              )}
              <a href={liHref} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
                LinkedIn profile ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ctx({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}
