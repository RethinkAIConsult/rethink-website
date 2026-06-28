import type { ProspectWithDetail } from "@/lib/types";
import { CONTACTED_STATUSES } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { CharMeter } from "./char-meter";
import { CopyButton } from "./copy-button";
import { MarkSentButton } from "./mark-sent-button";
import { cn } from "@/lib/utils";

export interface ProspectCardProps {
  prospect: ProspectWithDetail;
  /**
   * Server action to mark connect sent. Required so the mark-sent button can
   * do its work. Pass `markConnectSent` from "@/app/(app)/outbound/actions".
   */
  markConnectSentAction: (prospectId: string) => Promise<unknown>;
  className?: string;
}

function formatSentDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function ProspectCard({
  prospect: p,
  markConnectSentAction,
  className,
}: ProspectCardProps) {
  const isContacted = CONTACTED_STATUSES.includes(p.status);
  const hasDraft = Boolean(p.connect_note);
  const noteLen = p.connect_note?.length ?? 0;

  const isApply = p.track === "apply";
  const peopleSearch = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(p.company_name + " operations")}`;
  const primaryHref = isApply
    ? p.company_url ?? p.contact_linkedin_url ?? peopleSearch
    : p.contact_linkedin_url ?? peopleSearch;
  const primaryLabel = isApply
    ? "Open application ↗"
    : p.contact_linkedin_url
      ? "Open LinkedIn ↗"
      : "Find contact ↗";

  return (
    <Card className={cn("relative border-0 ring-1 ring-foreground/10", className)}>
      <CardContent className="pt-5 pb-5">
        {/* Status badge — top right */}
        <div className="absolute top-4 right-4">
          <StatusBadge status={p.status} />
        </div>

        {/* Name + title */}
        <div className="pr-28">
          <h2 className="text-base font-semibold leading-snug text-foreground">
            {p.contact_name ?? p.company_name}
          </h2>
          {p.contact_title && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {p.contact_title}
            </p>
          )}
        </div>

        {/* Company row + context chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {p.company_name}
          </span>

          {p.track && (
            <span
              className={cn(
                "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isApply
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  : "bg-primary/10 text-primary",
              )}
            >
              {isApply ? "Apply" : "Pitch"}
            </span>
          )}

          {p.source_keyword && (
            <span className="metric inline-flex items-center rounded px-2 py-0.5 text-[10px] tracking-wide bg-muted text-muted-foreground">
              {p.source_keyword}
            </span>
          )}

          {p.pain_signal && (
            <span className="metric inline-flex items-center rounded px-2 py-0.5 text-[10px] tracking-wide bg-primary/10 text-primary">
              {p.pain_signal.length > 60 ? p.pain_signal.slice(0, 58) + "…" : p.pain_signal}
            </span>
          )}

          {p.funding_summary && (
            <span className="metric inline-flex items-center rounded px-2 py-0.5 text-[10px] tracking-wide bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              {p.funding_summary.length > 50 ? p.funding_summary.slice(0, 48) + "…" : p.funding_summary}
            </span>
          )}

          {p.tools_used && (
            <span className="metric inline-flex items-center rounded px-2 py-0.5 text-[10px] tracking-wide bg-muted text-muted-foreground">
              {p.tools_used.length > 50 ? p.tools_used.slice(0, 48) + "…" : p.tools_used}
            </span>
          )}
        </div>

        {/* Primary action — Apply opens the posting; Pitch opens the buyer's LinkedIn */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <a
            href={primaryHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {primaryLabel}
          </a>

          {/* Secondary: Apply -> the named hiring contact; Pitch -> the posting */}
          {isApply
            ? p.contact_linkedin_url && (
                <a
                  href={p.contact_linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Hiring contact ↗
                </a>
              )
            : p.company_url && (
                <a
                  href={p.company_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Open posting ↗
                </a>
              )}

          {hasDraft && (
            <CopyButton text={p.connect_note!} />
          )}

          {isContacted ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {p.connect_sent_at
                ? `Sent ${formatSentDate(p.connect_sent_at)}`
                : "Sent"}
            </span>
          ) : (
            <MarkSentButton
              prospectId={p.id}
              action={markConnectSentAction}
            />
          )}
        </div>

        {/* People to contact at this company */}
        {p.contacts && p.contacts.length > 0 && (
          <div className="mt-4 rounded-lg border border-border bg-background px-4 py-3">
            <p className="eyebrow text-muted-foreground mb-2">
              {isApply ? "People to reference" : `People to contact (${p.contacts.length})`}
            </p>
            <ul className="space-y-1.5">
              {p.contacts.map((c, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 text-sm">
                    <span className="font-medium text-foreground">{c.name}</span>
                    {c.title && <span className="text-muted-foreground">, {c.title}</span>}
                  </span>
                  {c.linkedin_url && (
                    <a
                      href={c.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-xs font-medium text-primary hover:underline"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Note block — application message (Apply) or connect note (Pitch) */}
        {hasDraft && (
          <div className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-3 space-y-2">
            <p className="eyebrow text-muted-foreground">
              {isApply ? "Application note" : "Connect note"}
            </p>
            <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {p.connect_note}
            </p>

            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
              <CharMeter len={noteLen} max={300} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
