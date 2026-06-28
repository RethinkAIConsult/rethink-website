"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { query, queryOne } from "@/lib/db";
import { hasDb, hasClerk, hasApollo } from "@/lib/env";
import { researchAngle, verifyBuyers } from "@/lib/research-angle";
import {
  apolloLists,
  apolloListContacts,
  apolloSearchPeople,
  apolloRevealPeople,
  type ApolloList,
} from "@/lib/apollo-sync";

export type OutreachRow = {
  id: string;
  contact_name: string;
  contact_title: string | null;
  company_name: string;
  company_url: string | null;
  linkedin_url: string | null;
  research_summary: string | null;
  pain_hook: string | null;
  angle: string | null;
  connect_note: string | null;
  status: string;
  source: string | null;
  created_at: string;
  contacted_at: string | null;
  sent_at: string | null;
};

async function requireUser(): Promise<string | null> {
  if (!hasClerk()) return "local-dev";
  const { userId } = await auth();
  return userId ?? null;
}

// ── manual single-contact research (paste one) ──
export async function researchAndSave(input: {
  name: string;
  title?: string;
  company: string;
  companyUrl?: string;
  linkedinUrl?: string;
}): Promise<{ ok: boolean; row?: OutreachRow; error?: string }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Not signed in" };
  if (!input.name?.trim() || !input.company?.trim()) {
    return { ok: false, error: "Name and company are required" };
  }
  if (!hasDb()) return { ok: false, error: "No database configured" };

  let a;
  try {
    a = await researchAngle({
      name: input.name.trim(),
      title: input.title?.trim(),
      company: input.company.trim(),
      companyUrl: input.companyUrl?.trim(),
    });
  } catch (e) {
    return { ok: false, error: (e as Error).message.slice(0, 200) };
  }

  const row = await queryOne<OutreachRow>(
    `INSERT INTO outreach_research
       (contact_name, contact_title, company_name, company_url, linkedin_url, research_summary, pain_hook, angle, connect_note, status, source)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'ready','manual')
     RETURNING *`,
    [
      input.name.trim(),
      input.title?.trim() ?? null,
      input.company.trim(),
      input.companyUrl?.trim() ?? null,
      input.linkedinUrl?.trim() ?? null,
      a.summary,
      a.painHook,
      a.angle,
      a.connectNote,
    ],
  );

  revalidatePath("/outbound/angle");
  return { ok: true, row: row ?? undefined };
}

// ── CSV import (Apollo export): pasted text -> pending rows ──
type ParsedContact = { name: string; title?: string; company: string; linkedin?: string; website?: string };

function parseCsv(text: string): ParsedContact[] {
  const rows = splitCsvRows(text);
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (...names: string[]) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i !== -1) return i;
    }
    return -1;
  };
  const iFirst = idx("first name", "first_name");
  const iLast = idx("last name", "last_name");
  const iName = idx("name", "full name", "contact name");
  const iTitle = idx("title", "job title");
  const iCompany = idx("company", "company name", "account name", "organization", "employer");
  const iLi = idx("person linkedin url", "linkedin url", "linkedin", "person_linkedin_url");
  const iSite = idx("website", "company website", "company domain", "domain");

  const out: ParsedContact[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row.length || row.every((c) => !c.trim())) continue;
    const name =
      iName !== -1
        ? (row[iName] ?? "").trim()
        : `${iFirst !== -1 ? row[iFirst] ?? "" : ""} ${iLast !== -1 ? row[iLast] ?? "" : ""}`.trim();
    const company = iCompany !== -1 ? (row[iCompany] ?? "").trim() : "";
    if (!name || !company) continue;
    out.push({
      name,
      title: iTitle !== -1 ? (row[iTitle] ?? "").trim() || undefined : undefined,
      company,
      linkedin: iLi !== -1 ? (row[iLi] ?? "").trim() || undefined : undefined,
      website: iSite !== -1 ? (row[iSite] ?? "").trim() || undefined : undefined,
    });
  }
  return out;
}

// minimal RFC-ish CSV splitter (handles quoted fields with commas/newlines)
function splitCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export async function importCsv(
  csvText: string,
): Promise<{ ok: boolean; imported?: number; skipped?: number; error?: string }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Not signed in" };
  if (!hasDb()) return { ok: false, error: "No database configured" };
  let parsed: ParsedContact[];
  try {
    parsed = parseCsv(csvText);
  } catch (e) {
    return { ok: false, error: "Could not parse CSV: " + (e as Error).message.slice(0, 120) };
  }
  if (!parsed.length) return { ok: false, error: "No rows found. Need at least Name + Company columns." };

  let imported = 0;
  let skipped = 0;
  for (const c of parsed) {
    // skip if we already have this person (by linkedin url, else name+company)
    const dup = await queryOne(
      c.linkedin
        ? "SELECT 1 FROM outreach_research WHERE linkedin_url = $1 LIMIT 1"
        : "SELECT 1 FROM outreach_research WHERE contact_name = $1 AND company_name = $2 LIMIT 1",
      c.linkedin ? [c.linkedin] : [c.name, c.company],
    );
    if (dup) { skipped++; continue; }
    await query(
      `INSERT INTO outreach_research (contact_name, contact_title, company_name, company_url, linkedin_url, status, source)
       VALUES ($1,$2,$3,$4,$5,'pending','csv')`,
      [c.name, c.title ?? null, c.company, c.website ?? null, c.linkedin ?? null],
    );
    imported++;
  }
  revalidatePath("/outbound/angle");
  return { ok: true, imported, skipped };
}

// ── Apollo API sync: pull a saved list into the queue as pending ──
export async function getApolloLists(): Promise<{ ok: boolean; lists?: ApolloList[]; error?: string }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Not signed in" };
  if (!hasApollo()) return { ok: false, error: "APOLLO_API_KEY not set" };
  try {
    return { ok: true, lists: await apolloLists() };
  } catch (e) {
    return { ok: false, error: (e as Error).message.slice(0, 180) };
  }
}

export async function syncApollo(
  listId: string,
  limit = 50,
): Promise<{ ok: boolean; imported?: number; skipped?: number; error?: string }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Not signed in" };
  if (!hasApollo()) return { ok: false, error: "APOLLO_API_KEY not set" };
  if (!hasDb()) return { ok: false, error: "No database configured" };
  if (!listId?.trim()) return { ok: false, error: "Pick a list" };

  let contacts;
  try {
    contacts = await apolloListContacts(listId.trim(), limit);
  } catch (e) {
    return { ok: false, error: (e as Error).message.slice(0, 180) };
  }

  let imported = 0;
  let skipped = 0;
  for (const c of contacts) {
    const dup = await queryOne(
      c.linkedin
        ? "SELECT 1 FROM outreach_research WHERE linkedin_url = $1 LIMIT 1"
        : "SELECT 1 FROM outreach_research WHERE contact_name = $1 AND company_name = $2 LIMIT 1",
      c.linkedin ? [c.linkedin] : [c.name, c.company],
    );
    if (dup) { skipped++; continue; }
    await query(
      `INSERT INTO outreach_research (contact_name, contact_title, company_name, company_url, linkedin_url, status, source)
       VALUES ($1,$2,$3,$4,$5,'pending','apollo')`,
      [c.name, c.title ?? null, c.company, c.website ?? null, c.linkedin ?? null],
    );
    imported++;
  }
  revalidatePath("/outbound/angle");
  return { ok: true, imported, skipped };
}

// ── auto-refill: keep `target` contacts researched and ready. Pulls more from
// Apollo (saved contacts) as needed, then researches up to the target. Called on
// page load and after each send so there's always a queue waiting. ──
async function countBy(status: string): Promise<number> {
  const r = await queryOne<{ n: string }>("SELECT count(*) AS n FROM outreach_research WHERE status = $1", [status]);
  return Number(r?.n ?? 0);
}

export async function ensureBuffer(
  target = 20,
): Promise<{ ok: boolean; ready?: number; added?: number; researched?: number; exhausted?: boolean; error?: string }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Not signed in" };
  if (!hasDb()) return { ok: false, error: "No database configured" };

  // concurrency lock: only one fill at a time, or two could double-reveal (double
  // the credit spend). Atomically grab it; a lock older than 3 min counts as stale.
  const lock = await query<{ id: number }>(
    "UPDATE outreach_meta SET filling_at = now() WHERE id = 1 AND (filling_at IS NULL OR filling_at < now() - interval '3 minutes') RETURNING id",
  );
  if (!lock.length) {
    return { ok: true, ready: await countBy("ready"), added: 0, researched: 0 };
  }

  let added = 0;
  let researched = 0;
  let exhausted = false;

  try {
  // 1. fill PENDING up to target: api_search (free) -> verify gate (free, drops
  //    sellers) -> bulk_match reveal ONLY the keepers we still need (~1 credit each).
  for (let guard = 0; guard < 8; guard++) {
    const ready = await countBy("ready");
    const pending = await countBy("pending");
    if (ready >= target) break;
    if (ready + pending >= target) break;
    if (!hasApollo()) { exhausted = true; break; }

    const meta = await queryOne<{ apollo_page: number; apollo_exhausted: boolean }>(
      "SELECT apollo_page, apollo_exhausted FROM outreach_meta WHERE id = 1",
    );
    if (meta?.apollo_exhausted) { exhausted = true; break; }
    const page = meta?.apollo_page ?? 1;

    let found;
    try {
      found = await apolloSearchPeople(page, 25);
    } catch (e) {
      return { ok: false, error: (e as Error).message.slice(0, 180) };
    }
    await query("UPDATE outreach_meta SET apollo_page = $1 WHERE id = 1", [page + 1]);
    if (!found.people.length) {
      await query("UPDATE outreach_meta SET apollo_exhausted = true WHERE id = 1");
      exhausted = true;
      break;
    }

    // verify gate on the FREE masked data — keep only ICP buyers
    const keepFlags = await verifyBuyers(
      found.people.map((p) => ({ firstName: p.firstName, title: p.title, company: p.company })),
    );
    const keepers = found.people.filter((_, i) => keepFlags[i]);

    // reveal only as many as we still need (caps credit spend at the target)
    const stillNeed = Math.max(0, target - (ready + pending));
    const toReveal = keepers.slice(0, stillNeed);
    let revealedCount = 0;

    if (toReveal.length) {
      let revealed;
      try {
        revealed = await apolloRevealPeople(toReveal.map((k) => k.id));
      } catch (e) {
        return { ok: false, error: (e as Error).message.slice(0, 180) };
      }
      for (const k of toReveal) {
        const r = revealed[k.id];
        if (!r || !r.name) continue;
        const dup = await queryOne(
          r.linkedin
            ? "SELECT 1 FROM outreach_research WHERE linkedin_url = $1 LIMIT 1"
            : "SELECT 1 FROM outreach_research WHERE contact_name = $1 AND company_name = $2 LIMIT 1",
          r.linkedin ? [r.linkedin] : [r.name, k.company],
        );
        if (dup) continue;
        await query(
          `INSERT INTO outreach_research (contact_name, contact_title, company_name, company_url, linkedin_url, status, source)
           VALUES ($1,$2,$3,$4,$5,'pending','apollo')`,
          [r.name, k.title, k.company, k.website ?? null, r.linkedin ?? null],
        );
        added++;
        revealedCount++;
      }
    }

    // traceability: log every batch (searched / kept / revealed = credits spent)
    await query(
      "INSERT INTO apollo_activity (page, searched, kept, revealed) VALUES ($1,$2,$3,$4)",
      [page, found.people.length, keepers.length, revealedCount],
    );
  }

  // 2. research pending up to fill the target — capped per call so a slow model
  //    (V4 Pro is a reasoning model) never blows the server-action time budget;
  //    the BufferKeeper re-fires to research the next chunk.
  const ready0 = await countBy("ready");
  const need = Math.min(8, Math.max(0, target - ready0));
  if (need > 0) {
    const pend = await query<OutreachRow>(
      "SELECT * FROM outreach_research WHERE status = 'pending' ORDER BY created_at ASC LIMIT $1",
      [need],
    );
    let cursor = 0;
    const pool = 4;
    async function worker() {
      while (cursor < pend.length) {
        const p = pend[cursor++];
        try {
          const a = await researchAngle({
            name: p.contact_name,
            title: p.contact_title ?? undefined,
            company: p.company_name,
            companyUrl: p.company_url ?? undefined,
          });
          await query(
            "UPDATE outreach_research SET research_summary=$1, pain_hook=$2, angle=$3, connect_note=$4, status='ready' WHERE id=$5",
            [a.summary, a.painHook, a.angle, a.connectNote, p.id],
          );
          researched++;
        } catch {
          // leave as pending; will retry next top-up
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(pool, pend.length) }, worker));
  }

  revalidatePath("/outbound/angle");
  return { ok: true, ready: await countBy("ready"), added, researched, exhausted };
  } finally {
    // always release the lock, even on an Apollo error mid-fill
    await query("UPDATE outreach_meta SET filling_at = NULL WHERE id = 1");
  }
}

// ── pre-research all pending (so the queue is instant to work) ──
export async function researchPending(
  limit = 30,
): Promise<{ ok: boolean; researched?: number; failed?: number; error?: string }> {
  const userId = await requireUser();
  if (!userId) return { ok: false, error: "Not signed in" };
  if (!hasDb()) return { ok: false, error: "No database configured" };

  const pending = await query<OutreachRow>(
    "SELECT * FROM outreach_research WHERE status = 'pending' ORDER BY created_at ASC LIMIT $1",
    [limit],
  );
  if (!pending.length) return { ok: true, researched: 0, failed: 0 };

  let researched = 0;
  let failed = 0;
  // small concurrency pool
  const pool = 4;
  let cursor = 0;
  async function worker() {
    while (cursor < pending.length) {
      const p = pending[cursor++];
      try {
        const a = await researchAngle({
          name: p.contact_name,
          title: p.contact_title ?? undefined,
          company: p.company_name,
          companyUrl: p.company_url ?? undefined,
        });
        await query(
          `UPDATE outreach_research
             SET research_summary=$1, pain_hook=$2, angle=$3, connect_note=$4, status='ready'
           WHERE id=$5`,
          [a.summary, a.painHook, a.angle, a.connectNote, p.id],
        );
        researched++;
      } catch {
        failed++;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(pool, pending.length) }, worker));
  revalidatePath("/outbound/angle");
  return { ok: true, researched, failed };
}

// ── status / funnel ──
// pending -> ready (queue) -> connect_sent -> connected -> replied -> call_booked -> won  (passed = dead)
const ALLOWED = ["pending", "ready", "connect_sent", "connected", "replied", "call_booked", "won", "passed"];

export async function setOutreachStatus(id: string, status: string): Promise<{ ok: boolean }> {
  const userId = await requireUser();
  if (!userId || !hasDb() || !ALLOWED.includes(status)) return { ok: false };
  await query(
    `UPDATE outreach_research
       SET status = $1,
           sent_at = CASE WHEN $1 = 'connect_sent' AND sent_at IS NULL THEN now() ELSE sent_at END,
           contacted_at = CASE WHEN $1 NOT IN ('pending','ready') AND contacted_at IS NULL THEN now() ELSE contacted_at END,
           updated_at = now()
     WHERE id = $2`,
    [status, id],
  );
  revalidatePath("/outbound/angle");
  revalidatePath("/outbound/pipeline");
  revalidatePath("/outbound");
  return { ok: true };
}

// funnel counts for the dashboard + shell stats
export async function getFunnel(): Promise<Record<string, number>> {
  if (!hasDb()) return {};
  const rows = await query<{ status: string; n: string }>(
    "SELECT status, count(*) AS n FROM outreach_research GROUP BY status",
  );
  const map: Record<string, number> = {};
  for (const r of rows) map[r.status] = Number(r.n);
  const sentToday = await queryOne<{ n: string }>(
    "SELECT count(*) AS n FROM outreach_research WHERE sent_at >= CURRENT_DATE",
  );
  map["sent_today"] = Number(sentToday?.n ?? 0);
  return map;
}
