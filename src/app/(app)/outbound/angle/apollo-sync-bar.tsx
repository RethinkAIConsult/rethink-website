"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getApolloLists, syncApollo } from "./actions";

type List = { id: string; name: string };

export function ApolloSyncBar() {
  const router = useRouter();
  const [lists, setLists] = useState<List[] | null>(null);
  const [selected, setSelected] = useState("");
  const [limit, setLimit] = useState(30);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, start] = useTransition();

  function loadLists() {
    start(async () => {
      setMsg("Loading your Apollo lists…");
      const r = await getApolloLists();
      if (!r.ok) { setMsg(r.error ?? "Could not load lists"); return; }
      setLists(r.lists ?? []);
      setSelected(r.lists?.[0]?.id ?? "");
      setMsg(r.lists?.length ? null : "No lists found on this key.");
    });
  }

  function sync() {
    start(async () => {
      setMsg(`Pulling ${limit} contacts from Apollo…`);
      const r = await syncApollo(selected, limit);
      setMsg(r.ok ? `Imported ${r.imported}, skipped ${r.skipped} already here. Now hit Research.` : r.error ?? "Sync failed");
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl ring-1 ring-foreground/10 bg-card p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-foreground">Sync from Apollo</span>
        {!lists ? (
          <Button onClick={loadLists} disabled={busy}>
            {busy ? "Loading…" : "Load my lists"}
          </Button>
        ) : (
          <>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              {lists.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              {[10, 30, 50, 100].map((n) => (
                <option key={n} value={n}>{n} contacts</option>
              ))}
            </select>
            <Button onClick={sync} disabled={busy || !selected}>
              {busy ? "Syncing…" : "Sync"}
            </Button>
          </>
        )}
      </div>
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}
