import "server-only";

import { query, queryOne } from "@/lib/db";
import { isDemoMode } from "@/lib/env";
import {
  ProspectWithDetail,
  CandidateRow,
  CampaignRow,
  DiscoveryRunRow,
  MonitorRow,
  ProspectRow,
  ResearchRow,
  DraftRow,
  SendRow,
  ReplyRow,
} from "@/lib/types";
import {
  SAMPLE_PROSPECTS,
  SAMPLE_CANDIDATES,
  SAMPLE_MONITORS,
  SAMPLE_STATS,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Daily cockpit counters
// ---------------------------------------------------------------------------

export async function getDailySendCount(): Promise<number> {
  if (isDemoMode()) return 3;

  const row = await queryOne<{ count: string }>(
    `SELECT COUNT(*) AS count
     FROM prospects
     WHERE connect_sent_at::date = CURRENT_DATE`,
  );
  return parseInt(row?.count ?? "0", 10);
}

export async function getInFlightCount(): Promise<number> {
  if (isDemoMode()) return 5;

  const row = await queryOne<{ count: string }>(
    `SELECT COUNT(*) AS count
     FROM prospects
     WHERE status IN ('connect_sent', 'connected', 'dm1_sent', 'dm2_sent', 'dm3_sent')`,
  );
  return parseInt(row?.count ?? "0", 10);
}

export async function getMonitors(): Promise<MonitorRow[]> {
  if (isDemoMode()) return SAMPLE_MONITORS;

  return query<MonitorRow>(
    `SELECT * FROM monitors
     WHERE status = 'active'
     ORDER BY created_at DESC`,
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface OutboundStats {
  queued: number;
  sentToday: number;
  contactedTotal: number;
}

export async function getStats(): Promise<OutboundStats> {
  if (isDemoMode()) return SAMPLE_STATS;

  const [queuedRow, sentRow, contactedRow] = await Promise.all([
    queryOne<{ count: string }>(
      `SELECT COUNT(*) AS count FROM prospects WHERE status IN ('new','enriching','researching','drafting','ready')`,
    ),
    queryOne<{ count: string }>(
      `SELECT COUNT(*) AS count FROM sends WHERE sent_at >= CURRENT_DATE`,
    ),
    queryOne<{ count: string }>(
      `SELECT COUNT(*) AS count FROM prospects
       WHERE status IN ('connect_sent','connected','dm1_sent','dm2_sent','dm3_sent','replied','call_booked','won','lost')`,
    ),
  ]);

  return {
    queued: parseInt(queuedRow?.count ?? "0", 10),
    sentToday: parseInt(sentRow?.count ?? "0", 10),
    contactedTotal: parseInt(contactedRow?.count ?? "0", 10),
  };
}

// ---------------------------------------------------------------------------
// Today's action list
// ---------------------------------------------------------------------------

export async function getTodayList(): Promise<ProspectWithDetail[]> {
  if (isDemoMode()) {
    return SAMPLE_PROSPECTS.filter((p) => p.status === "ready" || p.status === "connect_sent");
  }

  return query<ProspectWithDetail>(
    `SELECT
       p.id, p.company_name, p.company_url, p.apollo_company_id,
       p.contact_name, p.contact_title, p.contact_linkedin_url,
       p.contact_email, p.contact_phone, p.contact_email_status,
       p.apollo_contact_id, p.funding_event, p.source, p.campaign_id,
       p.status, p.track, p.fit_score, p.created_by, p.created_at, p.updated_at,
       p.connect_sent_at, p.connected_at, p.dm1_sent_at, p.dm2_sent_at,
       p.dm3_sent_at, p.replied_at, p.call_booked_at, p.notes,
       r.summary  AS research_summary,
       r.buyer_observation,
       r.pain_signal,
       r.pain_signal_url,
       r.uses_n8n,
       d.connect_note,
       d.dm1, d.dm2, d.dm3,
       COALESCE((
         SELECT json_agg(json_build_object('name', c.name, 'title', c.title, 'linkedin_url', c.linkedin_url) ORDER BY c.rank)
         FROM prospect_contacts c WHERE c.prospect_id = p.id
       ), '[]'::json) AS contacts
     FROM prospects p
     LEFT JOIN research r ON r.prospect_id = p.id
     LEFT JOIN drafts   d ON d.prospect_id = p.id
     WHERE p.status IN ('ready', 'connected')
     ORDER BY (p.fit_score IS NULL), p.fit_score DESC, p.created_at ASC
     LIMIT 100`,
  );
}

// ---------------------------------------------------------------------------
// Pipeline list (filterable)
// ---------------------------------------------------------------------------

export async function getPipeline(opts?: {
  status?: string;
  search?: string;
}): Promise<ProspectWithDetail[]> {
  if (isDemoMode()) {
    let rows = [...SAMPLE_PROSPECTS];
    if (opts?.status) rows = rows.filter((p) => p.status === opts.status);
    if (opts?.search) {
      const term = opts.search.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.company_name.toLowerCase().includes(term) ||
          (p.contact_name ?? "").toLowerCase().includes(term),
      );
    }
    return rows;
  }

  const params: unknown[] = [];
  const clauses: string[] = [];

  if (opts?.status) {
    params.push(opts.status);
    clauses.push(`p.status = $${params.length}::prospect_status`);
  }

  if (opts?.search) {
    params.push(`%${opts.search}%`);
    clauses.push(
      `(p.company_name ILIKE $${params.length} OR p.contact_name ILIKE $${params.length})`,
    );
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  return query<ProspectWithDetail>(
    `SELECT
       p.id, p.company_name, p.company_url, p.apollo_company_id,
       p.contact_name, p.contact_title, p.contact_linkedin_url,
       p.contact_email, p.contact_phone, p.contact_email_status,
       p.apollo_contact_id, p.funding_event, p.source, p.campaign_id,
       p.status, p.fit_score, p.created_by, p.created_at, p.updated_at,
       p.connect_sent_at, p.connected_at, p.dm1_sent_at, p.dm2_sent_at,
       p.dm3_sent_at, p.replied_at, p.call_booked_at, p.notes,
       r.summary  AS research_summary,
       r.buyer_observation,
       r.pain_signal,
       r.pain_signal_url,
       r.uses_n8n,
       d.connect_note,
       d.dm1, d.dm2, d.dm3
     FROM prospects p
     LEFT JOIN research r ON r.prospect_id = p.id
     LEFT JOIN drafts   d ON d.prospect_id = p.id
     ${where}
     ORDER BY (p.fit_score IS NULL), p.fit_score DESC, p.created_at DESC
     LIMIT 200`,
    params,
  );
}

// ---------------------------------------------------------------------------
// Board (grouped by stage)
// ---------------------------------------------------------------------------

export interface BoardColumn {
  status: string;
  prospects: ProspectWithDetail[];
}

const BOARD_STAGES: string[] = [
  "ready",
  "connect_sent",
  "connected",
  "dm1_sent",
  "dm2_sent",
  "dm3_sent",
  "replied",
  "call_booked",
];

export async function getBoard(): Promise<BoardColumn[]> {
  if (isDemoMode()) {
    const map = new Map<string, ProspectWithDetail[]>();
    for (const stage of BOARD_STAGES) map.set(stage, []);
    for (const p of SAMPLE_PROSPECTS) {
      if (map.has(p.status)) map.get(p.status)!.push(p);
    }
    return BOARD_STAGES.map((s) => ({ status: s, prospects: map.get(s) ?? [] }));
  }

  const rows = await query<ProspectWithDetail>(
    `SELECT
       p.id, p.company_name, p.company_url, p.apollo_company_id,
       p.contact_name, p.contact_title, p.contact_linkedin_url,
       p.contact_email, p.contact_phone, p.contact_email_status,
       p.apollo_contact_id, p.funding_event, p.source, p.campaign_id,
       p.status, p.fit_score, p.created_by, p.created_at, p.updated_at,
       p.connect_sent_at, p.connected_at, p.dm1_sent_at, p.dm2_sent_at,
       p.dm3_sent_at, p.replied_at, p.call_booked_at, p.notes,
       r.summary  AS research_summary,
       r.buyer_observation,
       r.pain_signal,
       r.pain_signal_url,
       r.uses_n8n,
       d.connect_note,
       d.dm1, d.dm2, d.dm3
     FROM prospects p
     LEFT JOIN research r ON r.prospect_id = p.id
     LEFT JOIN drafts   d ON d.prospect_id = p.id
     WHERE p.status::text = ANY($1::text[])
     ORDER BY p.fit_score DESC NULLS LAST, p.created_at ASC`,
    [BOARD_STAGES],
  );

  const map = new Map<string, ProspectWithDetail[]>();
  for (const stage of BOARD_STAGES) map.set(stage, []);
  for (const row of rows) {
    map.get(row.status)?.push(row);
  }
  return BOARD_STAGES.map((s) => ({ status: s, prospects: map.get(s) ?? [] }));
}

// ---------------------------------------------------------------------------
// Due today (from the due_today view)
// ---------------------------------------------------------------------------

export interface DueTodayRow extends ProspectWithDetail {
  next_action: string;
}

export async function getDueToday(): Promise<DueTodayRow[]> {
  if (isDemoMode()) {
    return SAMPLE_PROSPECTS.filter(
      (p) => p.status === "connect_sent" || p.status === "connected",
    ).map((p) => ({
      ...p,
      next_action:
        p.status === "connected" ? "send_dm1" : "follow_up_connect_or_dm1",
    }));
  }

  return query<DueTodayRow>(
    `SELECT
       dt.*,
       r.summary  AS research_summary,
       r.buyer_observation,
       r.pain_signal,
       r.pain_signal_url,
       r.uses_n8n,
       d.connect_note,
       d.dm1, d.dm2, d.dm3
     FROM due_today dt
     LEFT JOIN research r ON r.prospect_id = dt.id
     LEFT JOIN drafts   d ON d.prospect_id = dt.id
     WHERE dt.next_action IS NOT NULL
     ORDER BY dt.fit_score DESC NULLS LAST`,
  );
}

// ---------------------------------------------------------------------------
// Single prospect detail
// ---------------------------------------------------------------------------

export interface ProspectDetail {
  prospect: ProspectRow;
  research: ResearchRow | null;
  drafts: DraftRow | null;
  sends: SendRow[];
  replies: ReplyRow[];
}

export async function getProspect(id: string): Promise<ProspectDetail | null> {
  if (isDemoMode()) {
    const p = SAMPLE_PROSPECTS.find((x) => x.id === id);
    if (!p) return null;
    const { research_summary, buyer_observation, pain_signal, pain_signal_url, uses_n8n,
            connect_note, dm1, dm2, dm3, ...prospectFields } = p;
    return {
      prospect: prospectFields as ProspectRow,
      research: {
        prospect_id: id,
        summary: research_summary,
        uses_n8n,
        pain_signal,
        pain_signal_url,
        pain_signal_source: null,
        buyer_observation,
        current_stack_summary: null,
        funding_summary: p.funding_summary ?? null,
        tools_used: p.tools_used ?? null,
        raw_json: {},
        task_id: null,
        generated_at: p.created_at,
      },
      drafts: connect_note
        ? {
            prospect_id: id,
            connect_note: connect_note ?? "",
            dm1: dm1 ?? "",
            dm2: dm2 ?? "",
            dm3: dm3 ?? "",
            model: "demo",
            prompt_version: "v1",
            generated_at: p.created_at,
          }
        : null,
      sends: [],
      replies: [],
    };
  }

  const [prospect, research, drafts, sends, replies] = await Promise.all([
    queryOne<ProspectRow>(`SELECT * FROM prospects WHERE id = $1`, [id]),
    queryOne<ResearchRow>(`SELECT * FROM research WHERE prospect_id = $1`, [id]),
    queryOne<DraftRow>(`SELECT * FROM drafts WHERE prospect_id = $1`, [id]),
    query<SendRow>(
      `SELECT * FROM sends WHERE prospect_id = $1 ORDER BY sent_at DESC`,
      [id],
    ),
    query<ReplyRow>(
      `SELECT * FROM replies WHERE prospect_id = $1 ORDER BY received_at DESC`,
      [id],
    ),
  ]);

  if (!prospect) return null;
  return { prospect, research, drafts, sends, replies };
}

// ---------------------------------------------------------------------------
// Candidates
// ---------------------------------------------------------------------------

export async function getCandidates(opts?: {
  status?: string;
}): Promise<CandidateRow[]> {
  if (isDemoMode()) {
    if (!opts?.status) return SAMPLE_CANDIDATES;
    return SAMPLE_CANDIDATES.filter((c) => c.status === opts.status);
  }

  const params: unknown[] = [];
  const clauses: string[] = [];

  if (opts?.status) {
    params.push(opts.status);
    clauses.push(`status = $${params.length}::candidate_status`);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  return query<CandidateRow>(
    `SELECT * FROM candidates ${where}
     ORDER BY fit_score DESC NULLS LAST, created_at DESC
     LIMIT 200`,
    params,
  );
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export async function listCampaigns(): Promise<CampaignRow[]> {
  if (isDemoMode()) return [];

  return query<CampaignRow>(
    `SELECT * FROM campaigns ORDER BY status ASC, created_at DESC`,
  );
}

// ---------------------------------------------------------------------------
// Discovery runs
// ---------------------------------------------------------------------------

export async function getRecentDiscoveryRuns(
  limit = 20,
): Promise<DiscoveryRunRow[]> {
  if (isDemoMode()) return [];

  return query<DiscoveryRunRow>(
    `SELECT * FROM discovery_runs ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
}
