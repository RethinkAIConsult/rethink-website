import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { SectionHeading } from "@/components/section-heading";
import { CountUp } from "@/components/count-up";
import { CASE_STUDIES } from "@/lib/data";

const INDEX_LABELS = ["01", "02", "03"];

export function CaseStudies() {
  return (
    <section
      id="work"
      className="border-t border-border py-20 lg:py-28"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeading
          number="03"
          eyebrow="Selected Work"
          headingId="work-heading"
          title="Shipped to production. Measured in outcomes."
          lead="Every engagement is a full build: architecture, production deployment, and support after it goes live."
          aside={<ArrowLink href="#contact">Start a project</ArrowLink>}
        />

        {/* Case study cards */}
        <div className="mt-12 lg:mt-14 grid gap-6 lg:grid-cols-3">
          {CASE_STUDIES.map((study, i) => (
            <FadeIn key={study.title} delay={i * 0.06} className="min-w-0">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-7 transition-colors duration-200 hover:border-primary/40">

                {/* Card content */}
                <div className="relative z-10 flex h-full flex-col">

                  {/* Tags row: sector badge + tech tags on the left, set index in the corner */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      {/* Sector badge */}
                      <span className="font-mono text-xs uppercase tracking-wider text-primary border border-primary/30 bg-primary/5 rounded-full px-2 py-0.5">
                        {study.sector}
                      </span>
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Set index, decorative, holds its own corner so it cannot overlap the tags */}
                    <span
                      aria-hidden="true"
                      className="shrink-0 select-none font-mono text-3xl font-bold leading-none text-muted-foreground/25 lg:text-4xl"
                    >
                      {INDEX_LABELS[i]}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold tracking-tight text-foreground leading-snug">
                    {study.title}
                  </h3>

                  {/* Headline metric */}
                  {study.metric ? (
                    <div className="mt-3 mb-1">
                      <div className="flex items-baseline gap-1">
                        <CountUp
                          value={study.metric.value}
                          separator={study.metric.separator ?? false}
                          className="metric text-4xl lg:text-5xl text-primary leading-none"
                        />
                        {study.metric.unit && (
                          <span className="text-lg text-primary/70 font-mono leading-none">
                            {study.metric.unit}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground font-sans">
                        {study.metric.label}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">{study.subtitle}</p>
                  )}

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground flex-1">
                    {study.description}
                  </p>

                  {/* Outcomes */}
                  <div className="mt-6">
                    <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Outcomes
                    </p>
                    <ul className="space-y-2" role="list">
                      {study.results.map((result) => (
                        <li
                          key={result}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <span
                            className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                            aria-hidden="true"
                          />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Testimonial (renders only when populated) */}
                  {study.testimonial && (
                    <blockquote className="mt-6 border-t border-border pt-5">
                      <p className="text-sm italic leading-relaxed text-muted-foreground">
                        &ldquo;{study.testimonial.quote}&rdquo;
                      </p>
                      <footer className="mt-2 font-mono text-xs text-muted-foreground/70">
                        {study.testimonial.attribution}
                      </footer>
                    </blockquote>
                  )}

                </div>

              </article>
            </FadeIn>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <ArrowLink href="/work">See all work</ArrowLink>
          <p className="text-center font-mono text-xs text-muted-foreground">
            Client names withheld under NDA. We will walk through the specifics on a call.
          </p>
        </div>

      </div>
    </section>
  );
}
