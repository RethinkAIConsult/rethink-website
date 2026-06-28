// Parallel AI FindAll + Entity Search client. Raw fetch — no SDK.
// FindAll: async, cited, $2 fixed + $0.15/match (core generator).
// Entity Search: sync, cheap (~$0.01/100), unverified first-pass.
// Reference: agency-os/skills/parallel-ai-patterns/SKILL.md

import { hasParallel, SKIPPED_NO_CREDENTIALS } from "./env";

const PARALLEL_BASE = "https://api.parallel.ai";

// ICP objective grounded in client-finder/findall-prompt.md.
// Affordable sweet spot is ~50-500 employees; 10-1000 is the wide default (configurable via matchConditions override).
export const DEFAULT_ICP = {
  objective:
    "Operating companies in the US, UK, or EU that have recently posted a role focused on automating their own internal business/operational workflows — the population most likely to need an outside automation/AI consultancy. Exclude staffing firms, automation-tool vendors, and companies whose core product is AI or automation.",
  entity_type: "companies",
  match_conditions: [
    {
      name: "geo_check",
      description:
        "HQ or hiring office in the US, UK, or an EU member state.",
    },
    {
      name: "internal_ops_automation_hiring",
      description:
        "Has a job posting active in the last 60-90 days focused on automating INTERNAL business or operational workflows — e.g. references n8n, Zapier, Make, RPA, process automation, or internal AI agents for ops. CRITICAL EXCLUSION: do NOT match software QA / test-automation roles such as 'Test Automation Engineer', 'SDET', or 'Automation Tester' — those roles test software, they do not automate business operations.",
    },
    {
      name: "size_band",
      description:
        "Between 10 and 1000 employees. (Optimal sweet spot is 50-500 but include the full 10-1000 band by default.)",
    },
    {
      name: "operating_company",
      description:
        "An operating company whose core product is NOT AI agents, automation tooling, developer tooling, or hiring/recruiting software. NOT a staffing firm, RPO, outsourcer, or automation-tool vendor/reseller. The company buys and uses automation; it does not sell it.",
    },
  ],
} as const;

// Normalized candidate shape — feeds CandidateRow inserts directly.
export type NormalizedCandidate = {
  source: "parallel_entity" | "parallel_findall";
  entity_type: "company";
  name: string;
  url: string | null;
  description: string | null;
  signal: string | null;
  // Which automation keyword (n8n, Zapier, Make, RPA, etc.) triggered the match, if determinable.
  source_keyword: string | null;
  citations: Array<{
    field: string;
    title: string;
    url: string;
    excerpts: string[];
    reasoning: string;
    confidence: number | null;
  }>;
  raw_json: unknown;
  fit_score: null;
};

// ------------------------------------------------------------------
// Internal fetch helper
// ------------------------------------------------------------------

async function parallelDiscoveryFetch(path: string, init?: RequestInit): Promise<unknown> {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) throw new Error("PARALLEL_API_KEY not set");
  const res = await fetch(`${PARALLEL_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Parallel ${path} ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

// ------------------------------------------------------------------
// Entity Search (sync, cheap, unverified first pass)
// POST /v1beta/findall/entity-search -> { entity_set_id, entities:[{name,url,description}] }
// ------------------------------------------------------------------

type EntitySearchResponse = {
  entity_set_id: string;
  entities: Array<{ name: string; url: string; description: string }>;
};

/**
 * Cheap synchronous search — unverified but fast and inexpensive.
 * Returns skipped when PARALLEL_API_KEY absent.
 */
export async function entitySearch(opts: {
  objective: string;
  matchLimit?: number;
}): Promise<{ skipped?: string; candidates: NormalizedCandidate[] }> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS, candidates: [] };
  const data = (await parallelDiscoveryFetch("/v1beta/findall/entity-search", {
    method: "POST",
    body: JSON.stringify({
      entity_type: "companies",
      objective: opts.objective,
      match_limit: opts.matchLimit ?? 100,
    }),
  })) as EntitySearchResponse;

  const candidates: NormalizedCandidate[] = (data.entities ?? []).map((e) => ({
    source: "parallel_entity",
    entity_type: "company",
    name: e.name,
    url: e.url ?? null,
    description: e.description ?? null,
    signal: null,
    source_keyword: null,
    citations: [],
    raw_json: e,
    fit_score: null,
  }));

  return { candidates };
}

// ------------------------------------------------------------------
// FindAll — async, cited run (SUBMIT ONLY — Inngest polls durably)
// POST /v1beta/findall/runs -> { findall_id }
// ------------------------------------------------------------------

type CreateFindAllResponse = { findall_id: string };

/**
 * Submit a FindAll run. Does NOT poll. The Inngest function polls durably
 * using getFindAllStatus / getFindAllResult on a step.sleep cadence.
 */
export async function createFindAllRun(opts: {
  objective: string;
  matchConditions?: Array<{ name: string; description: string }>;
  generator?: "core" | "preview";
  matchLimit?: number;
}): Promise<{ skipped?: string; findallId: string | null }> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS, findallId: null };
  const data = (await parallelDiscoveryFetch("/v1beta/findall/runs", {
    method: "POST",
    body: JSON.stringify({
      objective: opts.objective,
      entity_type: "companies",
      generator: opts.generator ?? "core",
      match_limit: opts.matchLimit ?? 200,
      match_conditions: opts.matchConditions ?? DEFAULT_ICP.match_conditions,
    }),
  })) as CreateFindAllResponse;

  return { findallId: data.findall_id };
}

// ------------------------------------------------------------------
// FindAll status poll
// GET /v1beta/findall/runs/{id}
// ------------------------------------------------------------------

type FindAllStatusResponse = {
  status: {
    status: "running" | "completed" | "failed";
    message?: string;
  };
};

export type FindAllStatus = "running" | "completed" | "failed";

export async function getFindAllStatus(findallId: string): Promise<{
  skipped?: string;
  status: FindAllStatus | null;
  message?: string;
}> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS, status: null };
  const data = (await parallelDiscoveryFetch(`/v1beta/findall/runs/${findallId}`)) as FindAllStatusResponse;
  return { status: data.status.status, message: data.status.message };
}

// ------------------------------------------------------------------
// FindAll result fetch
// GET /v1beta/findall/runs/{id}/result
// ------------------------------------------------------------------

type FindAllResultCandidate = {
  candidate_id: string;
  name: string;
  url?: string;
  description?: string;
  match_status?: string;
  output?: Record<string, unknown>;
  basis?: Array<{
    field: string;
    citations?: Array<{ title?: string; url?: string; excerpts?: string[] }>;
    reasoning?: string;
    confidence?: number;
  }>;
};

type FindAllResultResponse = {
  candidates: FindAllResultCandidate[];
};

export async function getFindAllResult(findallId: string): Promise<{
  skipped?: string;
  candidates: NormalizedCandidate[];
}> {
  if (!hasParallel()) return { skipped: SKIPPED_NO_CREDENTIALS, candidates: [] };
  const data = (await parallelDiscoveryFetch(`/v1beta/findall/runs/${findallId}/result`)) as FindAllResultResponse;

  const candidates: NormalizedCandidate[] = (data.candidates ?? []).map((c) => {
    const citations = (c.basis ?? []).flatMap((b) =>
      (b.citations ?? []).map((cit) => ({
        field: b.field ?? "",
        title: cit.title ?? "",
        url: cit.url ?? "",
        excerpts: cit.excerpts ?? [],
        reasoning: b.reasoning ?? "",
        confidence: b.confidence ?? null,
      }))
    );

    // Derive a why-now signal from the output or description.
    const signal =
      (c.output && typeof c.output["why_now"] === "string"
        ? (c.output["why_now"] as string)
        : null) ??
      c.description ??
      null;

    return {
      source: "parallel_findall",
      entity_type: "company",
      name: c.name,
      url: c.url ?? null,
      description: c.description ?? null,
      signal,
      // Parallel FindAll does not return the matched keyword; set null here.
      // Callers that know which keyword triggered the run can override this before inserting.
      source_keyword: null,
      citations,
      raw_json: c,
      fit_score: null,
    };
  });

  return { candidates };
}
