import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { SectionHeading } from "@/components/section-heading";
import { CASE_STUDIES } from "@/lib/data";

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
              <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-7 transition-colors duration-200 hover:border-primary/40">

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold tracking-tight text-foreground leading-snug">
                  {study.title}
                </h3>

                {/* Headline metric */}
                <p className="mt-2 metric text-2xl lg:text-3xl text-primary leading-tight">
                  {study.subtitle}
                </p>

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

              </article>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
