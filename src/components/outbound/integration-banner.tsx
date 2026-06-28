import { integrationStatuses, isDemoMode } from "@/lib/env";

/**
 * Status strip for the outbound tool.
 *  - No database  -> amber "Demo data" notice (the dashboard is rendering samples).
 *  - Live database -> neutral note listing any pipeline keys still to wire.
 *  - Fully wired   -> nothing.
 * Clerk is never treated as a missing local dependency: auth activates on Vercel.
 * This is a Server Component — safe to call the env helpers at render time.
 */
export function IntegrationBanner() {
  if (isDemoMode()) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400"
      >
        <span className="font-medium">Demo data</span>
        {" — "}connect a database to go live.
      </div>
    );
  }

  const missing = integrationStatuses().filter(
    (s) => !s.configured && s.key !== "CLERK",
  );

  if (missing.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
    >
      <span className="font-medium text-foreground">Live on your database.</span>{" "}
      To run the full pipeline, add keys:{" "}
      <span className="text-foreground">{missing.map((s) => s.label).join(", ")}</span>.{" "}
      Auth activates automatically on Vercel.
    </div>
  );
}
