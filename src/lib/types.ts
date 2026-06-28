// Row types mirroring the outbound schema (sql/migrations/0001 + 0002).
// Hand-maintained — keep in sync with the migrations. lib/db.ts query<T>()
// relies on these for typed rows. Timestamps come back as ISO-ish strings
// because lib/db.ts installs pg type parsers for date/timestamp/timestamptz.

export type ProspectStatus =
  | "new"
  | "enriching"
  | "researching"
  | "drafting"
  | "ready"
  | "connect_sent"
  | "connected"
  | "dm1_sent"
  | "dm2_sent"
  | "dm3_sent"
  | "replied"
  | "call_booked"
  | "won"
  | "lost"
  | "dropped"
  | "failed";

export type N8nUsage =
  | "yes_first_party_evidence"
  | "yes_indirect_evidence"
  | "no_evidence"
  | "explicitly_uses_alternative";

export type ProspectSource =
  | "parallel_findall"
  | "parallel_entity"
  | "exa"
  | "manual"
  | "referral";

export type ContactEmailStatus =
  | "verified"
  | "unlocked"
  | "guessed"
  | "masked"
  | "unknown";

export type SendChannel = "linkedin_connect" | "linkedin_dm" | "email";
export type SendStep = "connect" | "dm1" | "dm2" | "dm3";
export type ReplySentiment = "positive" | "neutral" | "negative" | "unsure";
export type JobStatus = "queued" | "running" | "succeeded" | "failed";
export type CampaignStatus = "active" | "archived";
export type CandidateEntityType = "company" | "person";
export type ProspectTrack = "apply" | "pitch";
export type CandidateStatus = "new" | "promoted" | "dismissed";
export type DiscoveryEngine = "parallel_findall" | "parallel_entity" | "exa";
export type DiscoveryRunStatus = "queued" | "running" | "succeeded" | "failed";

export interface ProspectRow {
  id: string;
  company_name: string;
  company_url: string | null;
  apollo_company_id: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_linkedin_url: string | null;
  contact_email: string | null;
  contact_phone: string | null; // 0002
  contact_email_status: ContactEmailStatus | null; // 0002
  apollo_contact_id: string | null;
  funding_event: string | null;
  source: ProspectSource | null; // 0002
  source_keyword: string | null; // 0003 — which automation keyword triggered the match
  campaign_id: string | null; // 0002
  status: ProspectStatus;
  track: ProspectTrack | null; // 0004 — 'apply' (contract) | 'pitch' (permanent)
  fit_score: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  connect_sent_at: string | null;
  connected_at: string | null;
  dm1_sent_at: string | null;
  dm2_sent_at: string | null;
  dm3_sent_at: string | null;
  replied_at: string | null;
  call_booked_at: string | null;
  notes: string | null;
}

export interface ResearchRow {
  prospect_id: string;
  summary: string | null;
  uses_n8n: N8nUsage | null;
  pain_signal: string | null;
  pain_signal_url: string | null;
  pain_signal_source: string | null;
  buyer_observation: string | null;
  current_stack_summary: string | null;
  funding_summary: string | null; // 0003 — last round/date/amount, or "bootstrapped"
  tools_used: string | null; // 0003 — automation tools they appear to use
  raw_json: unknown;
  task_id: string | null;
  generated_at: string;
}

export interface DraftRow {
  prospect_id: string;
  connect_note: string;
  dm1: string;
  dm2: string;
  dm3: string;
  model: string;
  prompt_version: string;
  generated_at: string;
}

export interface SendRow {
  id: string;
  prospect_id: string;
  channel: SendChannel;
  step: SendStep;
  body: string;
  sent_at: string;
  sent_by: string;
}

export interface ReplyRow {
  id: string;
  prospect_id: string;
  body: string;
  sentiment: ReplySentiment | null;
  received_at: string;
  logged_by: string;
}

export interface JobRow {
  id: string;
  prospect_id: string | null;
  kind: string;
  status: JobStatus;
  inngest_run_id: string | null;
  started_at: string;
  finished_at: string | null;
  error: string | null;
}

export interface CampaignRow {
  id: string;
  name: string;
  description: string | null;
  icp_objective: string | null;
  default_source: ProspectSource | null;
  status: CampaignStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DiscoveryRunRow {
  id: string;
  campaign_id: string | null;
  engine: DiscoveryEngine;
  objective: string;
  status: DiscoveryRunStatus;
  external_id: string | null; // e.g. Parallel findall_id
  match_count: number;
  cost_estimate_cents: number | null;
  error: string | null;
  created_by: string;
  created_at: string;
  finished_at: string | null;
}

export type MonitorStatus = "active" | "cancelled";

export interface MonitorRow {
  id: string;
  monitor_id: string | null; // Parallel monitor_<hex>
  type: string; // "event_stream"
  objective: string;
  frequency: string; // "1h" | "1d" | "1w"
  processor: string; // "lite" | "base"
  status: MonitorStatus;
  campaign_id: string | null;
  last_event_at: string | null;
  created_by: string;
  created_at: string;
}

export interface CandidateRow {
  id: string;
  campaign_id: string | null;
  discovery_run_id: string | null;
  source: ProspectSource;
  entity_type: CandidateEntityType;
  name: string;
  url: string | null;
  description: string | null;
  signal: string | null; // why-now / pain one-liner
  source_keyword: string | null; // 0003 — automation keyword that triggered the match
  citations: unknown; // JSONB array of { title, url, excerpts }
  raw_json: unknown; // JSONB full payload
  fit_score: number | null;
  status: CandidateStatus;
  promoted_prospect_id: string | null;
  created_by: string;
  created_at: string;
}

// Composite shape for the dashboard list (prospects LEFT JOIN research + drafts).
export interface ProspectWithDetail extends ProspectRow {
  research_summary: string | null;
  buyer_observation: string | null;
  pain_signal: string | null;
  pain_signal_url: string | null;
  uses_n8n: N8nUsage | null;
  funding_summary: string | null;
  tools_used: string | null;
  connect_note: string | null;
  dm1: string | null;
  dm2: string | null;
  dm3: string | null;
  contacts: ProspectContact[]; // 0005 — multiple people to reach per company
}

export interface ProspectContact {
  name: string;
  title: string | null;
  linkedin_url: string | null;
}

export const PROSPECT_STATUSES: ProspectStatus[] = [
  "new",
  "enriching",
  "researching",
  "drafting",
  "ready",
  "connect_sent",
  "connected",
  "dm1_sent",
  "dm2_sent",
  "dm3_sent",
  "replied",
  "call_booked",
  "won",
  "lost",
  "dropped",
  "failed",
];

// Statuses that count as "contacted at least once".
export const CONTACTED_STATUSES: ProspectStatus[] = [
  "connect_sent",
  "connected",
  "dm1_sent",
  "dm2_sent",
  "dm3_sent",
  "replied",
  "call_booked",
  "won",
  "lost",
];

// Statuses still moving through the automated build pipeline.
export const PIPELINE_STATUSES: ProspectStatus[] = [
  "new",
  "enriching",
  "researching",
  "drafting",
];
