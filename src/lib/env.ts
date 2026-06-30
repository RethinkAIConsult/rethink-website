// Env-gating helpers. The whole outbound system is "ready-to-run": every
// integration degrades gracefully when its key is absent (returns a
// skipped_no_credentials result instead of crashing). Pages and Inngest
// functions check has*() before touching an external service.

export const SKIPPED_NO_CREDENTIALS = "skipped_no_credentials" as const;
export type Skipped = typeof SKIPPED_NO_CREDENTIALS;

function present(name: string): boolean {
  const v = process.env[name];
  return typeof v === "string" && v.trim().length > 0;
}

export function hasDb(): boolean {
  return present("DATABASE_URL");
}
export function hasClerk(): boolean {
  return present("CLERK_SECRET_KEY") && present("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
}
export function hasParallel(): boolean {
  return present("PARALLEL_API_KEY");
}
export function hasApollo(): boolean {
  return present("APOLLO_API_KEY");
}
export function hasExa(): boolean {
  return present("EXA_API_KEY");
}
export function hasAnthropic(): boolean {
  return present("ANTHROPIC_API_KEY");
}
export function hasOpenRouter(): boolean {
  return present("OPENROUTER_API_KEY");
}
export function hasInngest(): boolean {
  return present("INNGEST_EVENT_KEY");
}
export function hasResend(): boolean {
  return present("RESEND_API_KEY");
}

// Demo mode: when there is no database, the dashboard renders sample data so
// the UI is fully viewable and looks alive on first run. Never true in prod
// once DATABASE_URL is set.
export function isDemoMode(): boolean {
  return !hasDb();
}

export interface IntegrationStatus {
  key: string;
  label: string;
  configured: boolean;
  required: boolean;
}

export function integrationStatuses(): IntegrationStatus[] {
  return [
    // Only the database drives demo mode. Clerk is deploy-time (auth activates
    // on Vercel), so it is never a local blocker. Everything else is a pipeline
    // capability that degrades gracefully when absent.
    { key: "DATABASE_URL", label: "Postgres (Neon)", configured: hasDb(), required: true },
    { key: "CLERK", label: "Clerk auth (Vercel)", configured: hasClerk(), required: false },
    { key: "OPENROUTER_API_KEY", label: "LLM via OpenRouter (scoring + drafting)", configured: hasOpenRouter(), required: false },
    { key: "PARALLEL_API_KEY", label: "Parallel (discovery + research)", configured: hasParallel(), required: false },
    { key: "EXA_API_KEY", label: "Exa (people search)", configured: hasExa(), required: false },
    { key: "APOLLO_API_KEY", label: "Apollo (email + phone)", configured: hasApollo(), required: false },
    { key: "INNGEST_EVENT_KEY", label: "Inngest (pipeline)", configured: hasInngest(), required: false },
  ];
}
