// Demo data — renders the dashboard alive when DATABASE_URL is absent.
// All copy is generic: capabilities only, no fabricated client metrics.
// Dates are relative to module load so the UI does not look stale.

import type {
  ProspectWithDetail,
  CandidateRow,
  MonitorRow,
} from "@/lib/types";

const NOW = new Date();
function daysAgo(n: number): string {
  const d = new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

export const SAMPLE_PROSPECTS: ProspectWithDetail[] = [
  {
    // Sarah Whitfield — status ready, full draft
    id: "demo-prospect-1",
    company_name: "Aria Logistics",
    company_url: "https://arialogistics.example",
    apollo_company_id: null,
    contact_name: "Sarah Whitfield",
    contact_title: "Head of Operations",
    contact_linkedin_url: "https://linkedin.com/in/sarah-whitfield-demo",
    contact_email: null,
    contact_phone: null,
    contact_email_status: null,
    apollo_contact_id: null,
    funding_event: null,
    source: "parallel_findall",
    source_keyword: "AI automation engineer",
    campaign_id: null,
    status: "ready",
    track: "apply",
    fit_score: 8,
    created_by: "demo",
    created_at: daysAgo(3),
    updated_at: daysAgo(1),
    connect_sent_at: null,
    connected_at: null,
    dm1_sent_at: null,
    dm2_sent_at: null,
    dm3_sent_at: null,
    replied_at: null,
    call_booked_at: null,
    notes: null,
    // Research
    research_summary:
      "Aria Logistics is scaling a regional freight operation and recently posted for an AI Automation Engineer on the ops side. Operations work is largely manual today.",
    buyer_observation:
      "Saw Aria is hiring an AI Automation Engineer for the ops side. We build exactly that as fixed-scope projects — turning manual operations workflows into reliable automated pipelines. Worth a quick comparison to a full-time hire?",
    pain_signal:
      "Hiring an AI Automation Engineer — suggests manual ops processes ready for automation.",
    pain_signal_url: null,
    uses_n8n: "yes_indirect_evidence",
    funding_summary: "Bootstrapped — no external funding disclosed.",
    tools_used: "Slack, Google Workspace, manual spreadsheets.",
    // Draft
    connect_note:
      "Hi Sarah, noticed Aria's hiring an automation engineer for the ops side. That's the kind of work I do day to day, so your roadmap caught my eye. Would be good to connect.",
    dm1:
      "Hi Sarah — thanks for connecting. Noticed Aria is hiring on the automation side. We specialise in building those pipelines as fixed-scope projects: event-driven, fully observable, handed back with documentation. Happy to share how we typically scope something like this, if it's useful for your eval.",
    dm2:
      "Following up briefly — if you're still weighing the build-vs-hire question on the automation side, I'm happy to walk through how we'd approach Aria's ops stack specifically. Takes about 20 minutes and costs nothing. Let me know if that's worth a slot.",
    dm3:
      "Last note from me, Sarah. If the timing isn't right, no worries at all. If you ever want a second opinion on scoping AI automation work, we're here. Good luck with the hiring process either way.",
    contacts: [],
  },
  {
    // Priya Nair — status ready, full draft
    id: "demo-prospect-2",
    company_name: "Northstar Insure",
    company_url: "https://northstarinsure.example",
    apollo_company_id: null,
    contact_name: "Priya Nair",
    contact_title: "Director of Transformation",
    contact_linkedin_url: "https://linkedin.com/in/priya-nair-demo",
    contact_email: null,
    contact_phone: null,
    contact_email_status: null,
    apollo_contact_id: null,
    funding_event: null,
    source: "parallel_findall",
    source_keyword: "AI solutions engineer",
    campaign_id: null,
    status: "ready",
    track: "pitch",
    fit_score: 7,
    created_by: "demo",
    created_at: daysAgo(4),
    updated_at: daysAgo(1),
    connect_sent_at: null,
    connected_at: null,
    dm1_sent_at: null,
    dm2_sent_at: null,
    dm3_sent_at: null,
    replied_at: null,
    call_booked_at: null,
    notes: null,
    // Research
    research_summary:
      "Northstar Insure is an insurance intermediary mid-transformation. Active job listings include an AI Solutions Engineer, indicating an in-house AI build is underway or planned.",
    buyer_observation:
      "Saw the AI Solutions Engineer opening at Northstar. We wrap legacy insurance stacks with production AI pipelines — underwriting, triage, and reporting workflows that run without supervision. Curious whether you're set on hiring, or open to shipping it as a fixed-scope project first.",
    pain_signal:
      "Hiring AI Solutions Engineer — transformation mandate plus legacy stack signals strong automation opportunity.",
    pain_signal_url: null,
    uses_n8n: "no_evidence",
    funding_summary: "Series A — £8M raised (2022, undisclosed lead).",
    tools_used: "Salesforce, legacy policy admin system, Microsoft 365.",
    // Draft
    connect_note:
      "Hi Priya, saw Northstar's bringing on an AI solutions engineer mid-transformation. I work on that kind of build with insurance teams and was curious about your stack. Happy to connect.",
    dm1:
      "Hi Priya — thanks for connecting. Noticed Northstar is looking for AI Solutions engineering capability. We build that work as fixed-scope projects: data pipelines, document automation, and underwriting workflows wrapped around your existing stack. Happy to share how we scope something like this if it's useful alongside your hiring eval.",
    dm2:
      "Following up briefly — if the AI Solutions Engineer search is still live and you'd find a second opinion on scoping useful, I'm happy to sketch out how we'd approach Northstar's stack specifically. No obligation.",
    dm3:
      "Last message from me. If the timing or the approach isn't right, absolutely no pressure. If you ever need a fast, scoped AI build alongside a full-time hire, we're easy to reach. Good luck with the transformation programme.",
    contacts: [],
  },
  {
    // Tom Becker — status connect_sent
    id: "demo-prospect-3",
    company_name: "Lumen Health",
    company_url: "https://lumenhealth.example",
    apollo_company_id: null,
    contact_name: "Tom Becker",
    contact_title: "COO",
    contact_linkedin_url: "https://linkedin.com/in/tom-becker-demo",
    contact_email: null,
    contact_phone: null,
    contact_email_status: null,
    apollo_contact_id: null,
    funding_event: null,
    source: "parallel_findall",
    source_keyword: "automation engineer",
    campaign_id: null,
    status: "connect_sent",
    track: "pitch",
    fit_score: 7,
    created_by: "demo",
    created_at: daysAgo(8),
    updated_at: daysAgo(5),
    connect_sent_at: daysAgo(5),
    connected_at: null,
    dm1_sent_at: null,
    dm2_sent_at: null,
    dm3_sent_at: null,
    replied_at: null,
    call_booked_at: null,
    notes: null,
    // Research
    research_summary:
      "Lumen Health is a digital health operator hiring a contract Automation Engineer. Ops functions — scheduling, reporting, clinical admin — appear to be handled manually at scale.",
    buyer_observation:
      "Noticed Lumen is bringing on a contract Automation Engineer. We ship that work as outcome-priced builds: scoped, delivered, and handed back with full documentation. Open to a quick look at how it compares?",
    pain_signal:
      "Hiring contract Automation Engineer — signals a defined ops automation project ready to scope.",
    pain_signal_url: null,
    uses_n8n: "no_evidence",
    funding_summary: "Seed — £2.5M raised (2021).",
    tools_used: "Notion, Airtable, manual scheduling via email.",
    // Draft
    connect_note:
      "Hi Tom, saw Lumen's looking for a contract automation engineer. I build that sort of thing for ops teams and your setup looked interesting. Would be good to connect.",
    dm1:
      "Hi Tom — thanks for connecting. Saw Lumen is looking for contract automation help. We deliver the same outcomes as a fixed-scope project: event-driven pipelines, AI-assisted workflows, handed back with documentation and monitoring in place. Happy to walk through how we'd approach Lumen's stack if that's useful.",
    dm2:
      "Following up, Tom — if the automation scoping is still live, I can sketch out how we'd approach it for Lumen specifically. Usually takes a 20-minute call. No sales deck, just a working session.",
    dm3:
      "Last note from me, Tom. If the contract route is already decided, no worries at all. We're here if you ever want a scoped alternative. Good luck with the build.",
    contacts: [],
  },
];

export const SAMPLE_CANDIDATES: CandidateRow[] = [
  {
    id: "demo-candidate-1",
    campaign_id: null,
    discovery_run_id: null,
    source: "parallel_findall",
    entity_type: "company",
    name: "Meridian Claims Group",
    url: "https://meridianclaims.example",
    description:
      "Insurance claims processing firm. Recent posts suggest an in-house data team is overwhelmed with manual reconciliation across three legacy systems.",
    signal: "Hiring Data Engineer + Operations Analyst simultaneously — manual reconciliation bottleneck.",
    source_keyword: null,
    citations: [],
    raw_json: {},
    fit_score: 7,
    status: "new",
    promoted_prospect_id: null,
    created_by: "demo",
    created_at: daysAgo(1),
  },
  {
    id: "demo-candidate-2",
    campaign_id: null,
    discovery_run_id: null,
    source: "parallel_findall",
    entity_type: "company",
    name: "Vectra Brokers",
    url: "https://vectrabrokers.example",
    description:
      "Commercial insurance brokerage scaling from 50 to 150 staff. CRM and policy admin still largely spreadsheet-driven.",
    signal: "Hiring Head of Operations — scaling pain with no automation layer in place.",
    source_keyword: null,
    citations: [],
    raw_json: {},
    fit_score: 6,
    status: "new",
    promoted_prospect_id: null,
    created_by: "demo",
    created_at: daysAgo(2),
  },
  {
    id: "demo-candidate-3",
    campaign_id: null,
    discovery_run_id: null,
    source: "exa",
    entity_type: "company",
    name: "Solera Logistics",
    url: "https://soleralogistics.example",
    description:
      "Third-party logistics provider. Engineering blog post on their site describes a manual weekly reporting process consuming two days of analyst time.",
    signal: "Engineering blog describes manual weekly reporting — classic pipeline automation opportunity.",
    source_keyword: null,
    citations: [],
    raw_json: {},
    fit_score: 8,
    status: "new",
    promoted_prospect_id: null,
    created_by: "demo",
    created_at: daysAgo(1),
  },
];

export const SAMPLE_STATS: { queued: number; sentToday: number; contactedTotal: number } = {
  queued: 12,
  sentToday: 3,
  contactedTotal: 47,
};

export const SAMPLE_MONITORS: MonitorRow[] = [
  {
    id: "demo-monitor-1",
    monitor_id: "monitor_abc123demo",
    type: "event_stream",
    objective:
      "UK companies with 20–200 employees hiring AI automation or workflow engineering roles, or where ops leaders posted about manual process pain. FinTech, InsurTech, HealthTech, logistics.",
    frequency: "1d",
    processor: "lite",
    status: "active",
    campaign_id: null,
    last_event_at: daysAgo(1),
    created_by: "demo",
    created_at: daysAgo(7),
  },
  {
    id: "demo-monitor-2",
    monitor_id: "monitor_def456demo",
    type: "event_stream",
    objective:
      "UK logistics or supply-chain companies posting about spreadsheet pain, manual reporting bottlenecks, or Excel-based ops workflows.",
    frequency: "1w",
    processor: "lite",
    status: "active",
    campaign_id: null,
    last_event_at: daysAgo(6),
    created_by: "demo",
    created_at: daysAgo(14),
  },
];
