// Parallel AI Task client. NOT FindAll.
// Reference: agency-os/skills/parallel-ai-patterns/SKILL.md
// Pattern: submit -> poll -> fetch.
// Note: awaitResearchTask is kept for local/dev use. In production the Inngest
// caller should durably poll via step.sleep instead of holding open a long poll.

import { hasParallel } from "./env";

export { hasParallel as isParallelEnabled };

const PARALLEL_BASE = "https://api.parallel.ai/v1";

export type ResearchOutput = {
  company_name: string;
  uses_n8n_in_production:
    | "yes_first_party_evidence"
    | "yes_indirect_evidence"
    | "no_evidence"
    | "explicitly_uses_alternative";
  n8n_pain_signals_observed: Array<{
    signal_type: "blog_post" | "job_posting" | "engineer_public_post" | "migration_announcement" | "github_activity" | "conference_talk";
    summary: string;
    source_url: string;
    source_date: string;
  }>;
  specific_observation_for_opener: string;
  best_buyer_at_company: {
    name: string;
    title: string;
    linkedin_url: string;
    rationale: string;
  } | null;
  current_stack_summary: string;
  overall_fit_score: number;
  // Targeting intelligence — "what to talk about" layer.
  how_to_target: string | null;
  talking_points: string[] | null;
  personalization_hooks: string[] | null;
  // Enrichment (never a filter — presence/absence does not affect fit score).
  // Last funding round + date + amount, or "bootstrapped/profitable, no known VC".
  funding_summary: string | null;
  // Automation tools the company appears to use based on public evidence.
  tools_used: string | null;
};

const TASK_INSTRUCTIONS = `Research {COMPANY_NAME} (website: {COMPANY_URL}). Determine whether they use n8n in production and whether there are public signals of n8n scaling pain at this specific company. Only count first-party evidence from the company itself: their engineering blog, their job postings, their own GitHub organisation, or public statements by their named employees who identify {COMPANY_NAME} as their employer. Third-party articles comparing tools do NOT count. Third-party listicles do NOT count. If a candidate signal cannot be tied directly to this company, exclude it. Also produce targeting intelligence: how_to_target (1-2 sentences on the best positioning angle for RethinkAI to use), talking_points (3-5 concrete talking points tied to this company's specific stack and signals), and personalization_hooks (specific public details that could open a conversation naturally). Additionally capture two enrichment fields (these are informational only and do NOT affect fit scoring): funding_summary (describe the last known funding round with date and amount, or state "bootstrapped/profitable, no known VC" if no VC funding is evident; use "unknown" only if no signal exists at all) and tools_used (list the automation, workflow, or AI tools the company appears to use based on public evidence such as job postings, blog posts, or GitHub activity; comma-separated). Return the structured output exactly per the schema.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    company_name: { type: "string" },
    uses_n8n_in_production: {
      type: "string",
      enum: [
        "yes_first_party_evidence",
        "yes_indirect_evidence",
        "no_evidence",
        "explicitly_uses_alternative",
      ],
    },
    n8n_pain_signals_observed: {
      type: "array",
      items: {
        type: "object",
        properties: {
          signal_type: {
            type: "string",
            enum: ["blog_post", "job_posting", "engineer_public_post", "migration_announcement", "github_activity", "conference_talk"],
          },
          summary: { type: "string" },
          source_url: { type: "string" },
          source_date: { type: "string" },
        },
        required: ["signal_type", "summary", "source_url"],
      },
    },
    specific_observation_for_opener: { type: "string" },
    best_buyer_at_company: {
      type: ["object", "null"],
      properties: {
        name: { type: "string" },
        title: { type: "string" },
        linkedin_url: { type: "string" },
        rationale: { type: "string" },
      },
    },
    current_stack_summary: { type: "string" },
    overall_fit_score: { type: "integer", minimum: 0, maximum: 10 },
    how_to_target: {
      type: ["string", "null"],
      description: "1-2 sentence recommendation on how to approach and position RethinkAI to this specific company.",
    },
    talking_points: {
      type: ["array", "null"],
      items: { type: "string" },
      description: "3-5 concrete talking points tailored to the company's stack, pain signals, and role signal.",
    },
    personalization_hooks: {
      type: ["array", "null"],
      items: { type: "string" },
      description: "Short, specific details from public sources that can open a conversation naturally.",
    },
    funding_summary: {
      type: ["string", "null"],
      description: "Last known funding round with date and amount, or 'bootstrapped/profitable, no known VC'. 'unknown' only if no signal exists.",
    },
    tools_used: {
      type: ["string", "null"],
      description: "Comma-separated list of automation, workflow, or AI tools the company appears to use based on public evidence.",
    },
  },
  required: [
    "company_name",
    "uses_n8n_in_production",
    "n8n_pain_signals_observed",
    "specific_observation_for_opener",
    "overall_fit_score",
  ],
};

type TaskCreateResponse = { run_id: string };

// Shape returned by GET /v1/tasks/runs/{id} (the status endpoint).
type TaskRunStatus = {
  status: "queued" | "running" | "completed" | "failed";
  error?: string;
};

// Shape returned by GET /v1/tasks/runs/{id}/result (the result endpoint).
type TaskRunResult = {
  run?: { status: string };
  output: { content: ResearchOutput };
};

async function parallelFetch(path: string, init?: RequestInit): Promise<unknown> {
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

/**
 * Submit a research task. Returns the run id.
 */
export async function submitResearchTask(input: {
  companyName: string;
  companyUrl: string | null;
}): Promise<{ taskId: string }> {
  if (!hasParallel()) throw new Error("PARALLEL_API_KEY not set -- research skipped");

  const prompt = TASK_INSTRUCTIONS
    .replaceAll("{COMPANY_NAME}", input.companyName)
    .replaceAll("{COMPANY_URL}", input.companyUrl ?? "unknown");

  const body = {
    task_spec: {
      output_schema: { type: "json", json_schema: OUTPUT_SCHEMA },
    },
    input: prompt,
    processor: "core",
  };

  const data = (await parallelFetch("/tasks/runs", {
    method: "POST",
    body: JSON.stringify(body),
  })) as TaskCreateResponse;

  return { taskId: data.run_id };
}

/**
 * Fetch the status of a task run without blocking. Used by callers that manage
 * their own poll loop (e.g. Inngest step.sleep + step.run).
 */
export async function getTaskRunStatus(taskId: string): Promise<TaskRunStatus> {
  if (!hasParallel()) throw new Error("PARALLEL_API_KEY not set -- research skipped");
  return (await parallelFetch(`/tasks/runs/${taskId}`)) as TaskRunStatus;
}

/**
 * Fetch the final result of a completed task exactly once. Call this only after
 * the status endpoint has confirmed status === "completed".
 */
export async function getTaskResult(taskId: string): Promise<ResearchOutput> {
  if (!hasParallel()) throw new Error("PARALLEL_API_KEY not set -- research skipped");
  const data = (await parallelFetch(`/tasks/runs/${taskId}/result`)) as TaskRunResult;
  return cleanOutput(data.output.content);
}

/**
 * Poll the STATUS endpoint until completion, then fetch the result exactly once.
 * Kept for local/dev convenience. Inngest functions should use the durable
 * step.sleep + getTaskRunStatus + getTaskResult pattern instead to avoid
 * holding an HTTP connection open across the full poll duration.
 */
export async function awaitResearchTask(opts: { taskId: string; timeoutMs?: number }): Promise<ResearchOutput> {
  if (!hasParallel()) throw new Error("PARALLEL_API_KEY not set -- research skipped");
  const start = Date.now();
  const timeout = opts.timeoutMs ?? 120_000;

  while (true) {
    // Poll the status endpoint (not /result) so we get a clean top-level status.
    const status = (await parallelFetch(`/tasks/runs/${opts.taskId}`)) as TaskRunStatus;
    if (status.status === "failed") throw new Error(`Parallel task failed: ${status.error ?? "unknown"}`);
    if (Date.now() - start > timeout) throw new Error("Parallel task timeout");
    if (status.status !== "completed") {
      await new Promise((r) => setTimeout(r, 5_000 + Math.random() * 5_000));
      continue;
    }
    // Fetch the result exactly once after confirmed completion.
    const result = (await parallelFetch(`/tasks/runs/${opts.taskId}/result`)) as TaskRunResult;
    return cleanOutput(result.output.content);
  }
}

/**
 * Coerce Parallel AI null/sentinel values to proper SQL nulls.
 * Parallel sometimes returns 0, "", or "null" (string) where the field should be null.
 * This helper normalises those before the caller upserts to Postgres.
 */
export function coerceNulls<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === 0 || v === "" || v === "null") {
      out[k] = null;
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

/**
 * Clean known Parallel AI null/sentinel quirks per parallel-ai-patterns skill.
 */
function cleanOutput(raw: ResearchOutput): ResearchOutput {
  return {
    ...raw,
    // Preserve an explicit 0 fit score — coerceNulls would zero it; handle separately.
    overall_fit_score: raw.overall_fit_score ?? 0,
    n8n_pain_signals_observed: raw.n8n_pain_signals_observed ?? [],
    best_buyer_at_company: raw.best_buyer_at_company ?? null,
    how_to_target: raw.how_to_target ?? null,
    talking_points: raw.talking_points ?? null,
    personalization_hooks: raw.personalization_hooks ?? null,
    funding_summary: raw.funding_summary ?? null,
    tools_used: raw.tools_used ?? null,
  };
}
