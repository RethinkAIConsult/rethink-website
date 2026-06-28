"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ensureBuffer } from "./actions";

const TARGET = 20;

// Keeps ~20 contacts researched and ready. Auto-tops-up on load and whenever the
// ready count drops below target (e.g. after you mark one sent).
export function BufferKeeper({ ready, creditsUsed = 0 }: { ready: number; creditsUsed?: number }) {
  const router = useRouter();
  const running = useRef(false);
  const exhausted = useRef(false);
  const [status, setStatus] = useState<string | null>(null);

  function topUp(force = false) {
    if (running.current) return;
    if (!force && (ready >= TARGET || exhausted.current)) return;
    running.current = true;
    setStatus("Pulling and researching the next contacts from Apollo…");
    ensureBuffer(TARGET)
      .then((r) => {
        running.current = false;
        setStatus(null);
        if (!r.ok) { setStatus(r.error ?? "Top-up failed"); return; }
        if (r.exhausted && (r.ready ?? 0) < TARGET) exhausted.current = true;
        if ((r.researched ?? 0) > 0 || (r.added ?? 0) > 0) router.refresh();
      })
      .catch(() => { running.current = false; setStatus(null); });
  }

  // auto top-up whenever ready drops below target
  useEffect(() => {
    topUp(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl ring-1 ring-foreground/10 bg-card p-4">
      <span className="text-sm font-medium text-foreground">
        Auto-queue · keeping {TARGET} ready
      </span>
      <span className="text-sm text-muted-foreground">
        <b className="text-foreground">{ready}</b> / {TARGET} ready
      </span>
      <span className="text-xs text-muted-foreground" title="Apollo reveals = credits spent, logged per batch">
        · <b className="text-foreground">{creditsUsed}</b> Apollo credits used
      </span>
      <div className="flex-1" />
      <Button onClick={() => topUp(true)} disabled={running.current}>
        Top up now
      </Button>
      {status && <p className="w-full text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}
