// Outreach claim guardrails — GENERIC mode.
// Decision (2026-06-20): outreach references capability and approach only,
// never a fabricated or unverified number. The drafter is FORBIDDEN from
// inventing metrics, percentages, hours-saved, or client outcomes.
//
// The free "Automation Stack Review" offer is defined in lib/offer.ts and
// injected into the drafter prompt separately. Do not add offer details here;
// claims.ts stays focused on capability statements only.
//
// If you later have APPROVED, verified proof points you can stand behind
// publicly, add them to APPROVED_PROOF_POINTS and flip CLAIMS_MODE to
// "with_metrics". Until then the drafter writes strong copy without numbers.

export type ClaimsMode = "generic" | "with_metrics";
export const CLAIMS_MODE: ClaimsMode = "generic";

// Capability statements the drafter MAY draw on. No numbers, no un-cleared
// client names. Edit freely — these describe what RethinkAI does.
export const CAPABILITY_CLAIMS: string[] = [
  "We build fixed-scope AI automation and agent systems, not strategy decks.",
  "We ship production pipelines that wrap existing and legacy stacks rather than rip-and-replace.",
  "We turn manual, repetitive operations into reliable automated workflows.",
  "We deliver as outcome-priced projects, so it is easy to compare against a full-time hire.",
  "We move fast: scoped builds shipped in weeks, not multi-quarter engagements.",
];

// APPROVED, verified proof points ONLY. Empty by default — never fabricate.
// Each entry must be something Jack can stand behind publicly.
export const APPROVED_PROOF_POINTS: string[] = [
  // e.g. "Cut a manual underwriting workflow from hours to minutes for a UK fintech."
  // (Add ONLY if true and cleared. Leaving this empty is the safe state.)
];

// Hard rule injected into the drafting system prompt.
export const NO_FABRICATION_RULE =
  "Never invent, estimate, or imply specific metrics, percentages, hours saved, " +
  "dollar figures, client names, or outcomes. You may reference capabilities and " +
  "approach, plus ONLY the items explicitly listed under approved proof points. " +
  "If no specific proof applies, write a strong, concrete message without any numbers. " +
  "Do not use phrases like 'up to', 'as much as', or invented benchmarks.";

// The claims block the drafter is allowed to use, as a prompt-ready string.
export function claimsForPrompt(): string {
  const lines = [...CAPABILITY_CLAIMS];
  if (CLAIMS_MODE === "with_metrics" && APPROVED_PROOF_POINTS.length > 0) {
    lines.push(...APPROVED_PROOF_POINTS);
  }
  return lines.map((l) => `- ${l}`).join("\n");
}
