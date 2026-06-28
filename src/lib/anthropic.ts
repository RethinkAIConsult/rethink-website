import type { ResearchOutput } from "./parallel";
import { claimsForPrompt, NO_FABRICATION_RULE } from "./claims";
import { OFFER } from "./offer";
import { chatTool, MODELS, isLlmEnabled, noteIssues, sanitizeNote } from "./llm";

export { isLlmEnabled as isAnthropicEnabled };

const MODEL = MODELS.draft;

export type MessageDrafts = {
  connectNote: string;
  dm1: string;
  dm2: string;
  dm3: string;
};

// System prompt built at call time so claims and offer are always current.
function buildSystemPrompt(): string {
  return `You are drafting outbound LinkedIn messages for RethinkAI Consult, a UK-based AI consulting firm run by Jack Costanzi. RethinkAI builds AI orchestration layers (Next.js + Inngest + LLMs) that wrap a client's legacy CRM and replace manual analyst workflows with semi-automated pipelines.

APPROVED CLAIMS YOU MAY USE:
${claimsForPrompt()}

FREE OFFER (the CTA for dm1):
${OFFER.forPrompt()}

FABRICATION RULE — this is an absolute constraint:
${NO_FABRICATION_RULE}

You will write four messages for a single prospect:

1. **connect_note** (max 300 characters, hard limit; aim for 150 to 220, shorter reads less salesy). A short, human LinkedIn connection note whose ONLY job is to earn the accept. Address them by first name. Reference the one specific thing from the research (their hire or signal) in plain, natural language, like a real person who noticed it. Do NOT pitch, do NOT mention the offer or any RethinkAI capability, and do NOT use consultant words ("fixed-scope", "production pipelines", "wrap your stack", "outcome-priced", "solutions", "leverage"). Avoid tells like "no pitch, just a question". End with a light, genuine reason to connect (for example "that's the kind of work I do, would be good to connect"), not a hard sell or a forced question. Sound like a real founder typing quickly, not a marketer.

2. **dm1** (90-160 words). Sent 24-48h after the connection is accepted. Restate the observation, reference the research targeting intelligence (how_to_target and talking_points). Name RethinkAI's capability as a credibility anchor using only the approved claims above. Then introduce the free offer: the Automation Stack Review. Describe it briefly (one to two sentences from the offer scope above — do not fabricate details). Close with a single soft ask: "Worth a look?" or equivalent. Do NOT ask for a call in dm1; the offer is the ask.

3. **dm2** (60-120 words). Sent 3-5 days later if no reply. Different angle. Reference a tangible artifact (a discovery doc, a tight loom video, an architecture sketch). Offer to share it. Do not repeat the opener or re-introduce the Automation Stack Review.

4. **dm3** (40-80 words). Sent 7-10 days later if still no reply. Break-up message. Explicit out: "I'll stop reaching out after this." One concrete provocation tied to the specific pain signal. Polite, no guilt.

Voice rules:
- Neutral, direct, professional.
- NO em-dashes. NO double-hyphens used as dashes. Use commas or periods.
- NO "I hope this finds you well", NO "circling back", NO "just checking in", NO "quick question".
- NO marketing fluff, NO superlatives ("incredibly", "amazing", "game-changing").
- Concrete tool names and specific observations beat abstractions.
- First person ("I", not "we", since Jack is solo).

Return strict JSON matching the schema. No markdown, no prose outside the JSON.`;
}

const OUTPUT_SCHEMA = {
  type: "object" as const,
  properties: {
    connect_note: {
      type: "string",
      maxLength: 300,
      description: "LinkedIn connection-request note. Max 300 characters — this is the platform limit.",
    },
    dm1: { type: "string" },
    dm2: { type: "string" },
    dm3: { type: "string" },
  },
  required: ["connect_note", "dm1", "dm2", "dm3"],
};

export async function draftMessages(input: {
  prospect: {
    companyName: string;
    contactName: string | null;
    contactTitle: string | null;
  };
  research: ResearchOutput;
}): Promise<{ drafts: MessageDrafts; model: string }> {
  // Compose targeting intelligence block from the new research fields.
  const targetingBlock =
    input.research.how_to_target || input.research.talking_points || input.research.personalization_hooks
      ? `
Targeting intelligence:
- how_to_target: ${input.research.how_to_target ?? "n/a"}
- talking_points: ${JSON.stringify(input.research.talking_points ?? [])}
- personalization_hooks: ${JSON.stringify(input.research.personalization_hooks ?? [])}`
      : "";

  const userPrompt = `Prospect: ${input.prospect.contactName ?? "(unknown contact)"} at ${input.prospect.companyName}, title: ${input.prospect.contactTitle ?? "unknown"}.

Research:
- uses_n8n_in_production: ${input.research.uses_n8n_in_production}
- specific_observation_for_opener: ${input.research.specific_observation_for_opener}
- pain signals: ${JSON.stringify(input.research.n8n_pain_signals_observed, null, 2)}
- current stack summary: ${input.research.current_stack_summary}
- fit score: ${input.research.overall_fit_score} / 10
- best buyer rationale: ${input.research.best_buyer_at_company?.rationale ?? "n/a"}${targetingBlock}

Draft the four messages now. Return JSON only.`;

  type Out = { connect_note: string; dm1: string; dm2: string; dm3: string };
  const call = (extra?: string) =>
    chatTool<Out>({
      model: MODEL,
      system: buildSystemPrompt() + (extra ?? ""),
      user: userPrompt,
      toolName: "submit_drafts",
      schema: OUTPUT_SCHEMA,
      maxTokens: 2000,
    });

  let data = await call();
  const firstName = input.prospect.contactName?.split(/\s+/)[0];

  // Deterministic guard: hold the cheap model to the hard rules. One corrective
  // regenerate, then a mechanical fix so a bad note never reaches the queue.
  let issues = noteIssues(data.connect_note, firstName);
  if (issues.length) {
    data = await call(
      `\n\nYOUR PREVIOUS connect_note FAILED these hard rules: ${issues.join(", ")}. Rewrite all four messages fixing them. connect_note MUST be under 300 characters, contain no em-dashes, address ${firstName ?? "them"} by name, and use no banned phrases.`,
    );
    issues = noteIssues(data.connect_note, firstName);
  }
  if (issues.length) {
    data.connect_note = sanitizeNote(data.connect_note).slice(0, 300);
  }

  return {
    model: MODEL,
    drafts: {
      connectNote: data.connect_note,
      dm1: sanitizeNote(data.dm1),
      dm2: sanitizeNote(data.dm2),
      dm3: sanitizeNote(data.dm3),
    },
  };
}
