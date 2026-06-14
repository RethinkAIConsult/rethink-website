import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";

const ROWS = [
  {
    label: "Time to production",
    studio: "Shipped to production in 2 to 8 weeks",
    inhouse: "90 to 120 days to hire a senior AI engineer",
  },
  {
    label: "Commercial model",
    studio: "One fixed project price, no overruns",
    inhouse: "A six-figure salary plus recruitment fees and overhead, before a line of code",
  },
  {
    label: "What you own",
    studio: "A documented system your team owns",
    inhouse: "A permanent role on payroll you still have to manage",
  },
] as const;

export function Comparison() {
  return (
    <section
      className="border-t border-border py-20 lg:py-28"
      aria-label="Studio versus hiring"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Build vs hire</p>
            <h2 className="display-lg text-foreground">
              The fastest way to staff this is not to staff it.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Most teams post the job ad and wait. We ship while the interviews are still running.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 lg:mt-14">

          {/* Column headers */}
          <FadeIn delay={0.05}>
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[160px_1fr_1fr]">
              <div className="hidden lg:block" aria-hidden="true" />
              <div className="hidden sm:flex items-center gap-2 px-5">
                <span className="metric text-xs font-bold text-primary">RethinkAI</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  In-house hire
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Rows */}
          <div className="space-y-3">
            {ROWS.map((row, i) => (
              <FadeIn key={row.label} delay={0.1 + i * 0.06}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr] lg:grid-cols-[160px_1fr_1fr]">

                  {/* Row label */}
                  <div className="hidden lg:flex items-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {row.label}
                    </span>
                  </div>

                  {/* Studio cell */}
                  <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-5 transition-colors duration-200 hover:border-primary/40">
                    <p className="metric text-xs font-bold text-primary mb-2 sm:hidden">
                      RethinkAI
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-foreground">
                      {row.studio}
                    </p>
                  </div>

                  {/* In-house cell */}
                  <div className="rounded-lg border border-border bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 sm:hidden">
                      In-house hire
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {row.inhouse}
                    </p>
                  </div>

                </div>
              </FadeIn>
            ))}
          </div>

        </div>

        <FadeIn delay={0.35}>
          <div className="mt-10">
            <ArrowLink href="#contact" tone="primary">
              Talk to us before you post the job ad
            </ArrowLink>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
