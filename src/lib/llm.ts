// Generic OpenRouter LLM client (OpenAI-compatible). One cheap model for both
// jobs after a 2026-06-27 bake-off (11 models, web research + empirical drafts):
//  - DeepSeek V4 Flash ($0.09/$0.18 per 1M) won — it obeyed every hard rule
//    (<=300 chars, no em-dash, correct name, no fabrication) across all test
//    drafts and handles buyer-vs-seller judgment easily, at ~1/30th of Claude.
//  - Drafts pass through a deterministic guard (noteIssues + one regenerate)
//    so a cheap model is held to the hard rules in code, not on trust.
import { hasOpenRouter } from "./env";

export { hasOpenRouter as isLlmEnabled };

export const MODELS = {
  // draft = connect-note + research. V4 Flash: fast + reliable, and with the
  // short no-pitch best-practice prompt the note quality matches V4 Pro (which
  // was slow and occasionally returned no tool call). Prompt does the work.
  draft: "deepseek/deepseek-v4-flash",
  // score = cheap high-volume judgment (verify gate, cull).
  score: "deepseek/deepseek-v4-flash",
} as const;

// Deterministic guard for connect notes — the hard rules a cheap model must not
// break. Returns a list of violations ([] = clean). Fabrication can't be regex'd,
// but em-dashes / length / missing name / buzzwords / markdown all can.
const BANNED_PHRASES = /\b(leverage|synergy|cutting-edge|seamless|circling back)\b|hope this (?:email |message )?finds you/i;
export function noteIssues(note: string, firstName?: string): string[] {
  const issues: string[] = [];
  if (/[—–]/.test(note)) issues.push("em-dash");
  if (note.length > 300) issues.push(`too long (${note.length})`);
  if (firstName && !new RegExp(`\\b${firstName.split(/\s+/)[0]}`, "i").test(note)) issues.push("missing name");
  if (BANNED_PHRASES.test(note)) issues.push("banned phrase");
  if (/\*\*|^#|\[.*\]\(/.test(note)) issues.push("markdown");
  return issues;
}

// Mechanical last-resort fixer if a regenerate still trips the guard.
export function sanitizeNote(note: string): string {
  return note.replace(/\s*[—–]\s*/g, ", ").replace(/\*\*/g, "").trim();
}

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://rethinkaiconsult.com",
    "X-Title": "RethinkAI Outbound",
  };
}

// Structured output via forced function-calling. Works uniformly across
// Claude / Gemini / GPT on OpenRouter, so the model is swappable per call.
export async function chatTool<T>(opts: {
  model: string;
  system?: string;
  user: string;
  toolName: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const messages: Array<{ role: string; content: string }> = [];
  if (opts.system) messages.push({ role: "system", content: opts.system });
  messages.push({ role: "user", content: opts.user });

  // Retry up to 3x: DeepSeek Flash returns an empty tool-call ~20% of the time,
  // and 5xx/429 are transient. A single blip should not drop the row.
  let lastErr = "no tool call";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        model: opts.model,
        max_tokens: opts.maxTokens ?? 2000,
        messages,
        tools: [{ type: "function", function: { name: opts.toolName, parameters: opts.schema } }],
        tool_choice: { type: "function", function: { name: opts.toolName } },
      }),
    });
    if (!res.ok) {
      lastErr = `${res.status}: ${(await res.text()).slice(0, 200)}`;
      if (res.status >= 500 || res.status === 429) continue; // transient — retry
      throw new Error(`OpenRouter ${opts.model} ${lastErr}`);
    }
    const data = await res.json();
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (args) {
      try {
        return JSON.parse(args) as T;
      } catch {
        lastErr = "invalid JSON in tool call";
        continue;
      }
    }
    lastErr = "no tool call in response";
  }
  throw new Error(`OpenRouter ${opts.model}: ${lastErr} (after 3 attempts)`);
}

// ---------------------------------------------------------------------------
// Job-posting scoring: own-ops buyer (keep) vs consultancy/staffing/vendor (drop)
// ---------------------------------------------------------------------------

export type JobScore = { keep: boolean; companyType: string; reason: string };

const SCORE_SCHEMA = {
  type: "object",
  properties: {
    keep: {
      type: "boolean",
      description:
        "true only if an OPERATING company is hiring a contract/fractional/interim AI-operations or automation role for ITS OWN operations; false for consultancies, agencies, systems integrators, staffing/recruiting/staff-aug firms, BPOs, IT-services shops, automation/RPA/AI-product vendors, or offshore client-delivery work.",
    },
    companyType: { type: "string", description: "short label, e.g. 'operating company', 'consultancy', 'staffing', 'AI product', 'IT services'" },
    reason: { type: "string", description: "one short sentence" },
  },
  required: ["keep", "companyType", "reason"],
};

const SCORE_SYSTEM =
  "You decide whether a job posting is a good outbound target for a solo AI-automation consultant. KEEP only if an OPERATING company (insurance, finance, logistics, healthcare, e-commerce, real estate, professional services, or a company using AI for its OWN product/operations) is hiring a CONTRACT, fractional, or interim AI-operations or automation role to improve ITS OWN operations. DROP if the hirer is a consultancy, agency, systems integrator, staffing/recruiting/staff-augmentation firm, BPO, IT-services shop, or an automation/RPA/AI-product vendor selling to others, or if it is offshore client-delivery work. When unsure, drop.";

export async function scoreJobPosting(posting: { title: string; summary: string }): Promise<JobScore> {
  return chatTool<JobScore>({
    model: MODELS.score,
    system: SCORE_SYSTEM,
    user: `Title: ${posting.title}\nSummary: ${posting.summary}`,
    toolName: "score",
    schema: SCORE_SCHEMA,
    maxTokens: 200,
  });
}
