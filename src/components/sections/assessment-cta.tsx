import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";

const SCORE_BARS = [
  { label: "SEO Foundations", pct: 82 },
  { label: "Messaging", pct: 64 },
  { label: "Performance", pct: 91 },
  { label: "Trust Signals", pct: 73 },
];

function MockReportCard() {
  return (
    <div
      className="rounded-lg border border-border bg-card p-6 max-w-sm w-full"
      aria-hidden="true"
    >
      {/* URL row */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500 shrink-0" />
        <span className="font-mono text-sm text-muted-foreground">
          yourcompany.com
        </span>
      </div>

      {/* Score bars */}
      <div className="space-y-3">
        {SCORE_BARS.map(({ label, pct }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-muted-foreground">
                {label}
              </span>
              <span className="font-mono text-xs text-foreground">{pct}</span>
            </div>
            <div className="h-1.5 rounded bg-muted overflow-hidden">
              <span
                className="block h-full rounded bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <p className="font-mono text-xs text-primary mt-5">
        3 automation opportunities found
      </p>
    </div>
  );
}

export function AssessmentCta() {
  return (
    <section
      className="relative overflow-hidden border-t border-border py-24 lg:py-32"
      aria-label="Free website assessment"
    >
      {/* Dot grid backdrop */}
      <div
        className="bg-dots absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: copy */}
          <FadeIn className="flex-1">
            <p className="eyebrow text-primary">Free tool</p>
            <h2 className="display-lg text-foreground mt-4">
              See exactly where AI fits your business
            </h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-md">
              Paste a URL. Get a scored report with SEO findings, clarity gaps,
              and concrete automation opportunities. No account required.
            </p>
            <div className="mt-8">
              <ArrowLink href="/assessment" tone="primary">
                Run a free assessment
              </ArrowLink>
            </div>
          </FadeIn>

          {/* Right: decorative mock report card */}
          <FadeIn className="flex lg:justify-end shrink-0">
            <MockReportCard />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
