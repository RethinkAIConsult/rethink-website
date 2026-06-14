import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { CountUp } from "@/components/count-up";
import { CASE_STUDIES, BOOKING_URL } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { breadcrumbSchema, webPageLd } from "@/lib/schemas";

const PAGE_DESCRIPTION =
  "Selected production AI engagements: an analyst intelligence platform that automates 120+ hours a month, a CRM enrichment engine processing 12,000 records a week, and a service business taken from spreadsheets to a production SaaS in six weeks. Client names withheld under NDA.";

export const metadata: Metadata = {
  title: "Our Work",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "Our Work",
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/work`,
  },
};

const workPageLd = webPageLd({
  name: "Our Work",
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/work`,
  type: "CollectionPage",
});

const workBreadcrumbLd = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Work", url: `${SITE_URL}/work` },
]);

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workBreadcrumbLd) }}
      />

      {/* Hero */}
      <section
        className="relative border-b border-border/50 py-28 lg:py-36"
        aria-label="Work introduction"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="bg-dots-fade absolute inset-0" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground" aria-current="page">Work</li>
            </ol>
          </nav>

          <p className="eyebrow mb-4 text-primary">Selected Work</p>
          <h1 className="display-lg text-foreground">
            Shipped to production. Measured in outcomes.
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-muted-foreground">
            Every engagement is a full build: architecture, production deployment, and handover so
            your team owns it completely. These are three representative projects, each measured by
            the outcome it delivered.
          </p>
        </div>
      </section>

      {/* Case study cards */}
      <section className="py-20 lg:py-28" aria-label="Case studies">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {CASE_STUDIES.map((study, i) => (
              <FadeIn key={study.slug} delay={i * 0.06} className="min-w-0">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-7 transition-colors duration-200 hover:border-primary/40">
                  <div className="relative z-10 flex h-full flex-col">

                    {/* Tags row */}
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
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
                      <span
                        aria-hidden="true"
                        className="shrink-0 select-none font-mono text-3xl font-bold leading-none text-muted-foreground/25 lg:text-4xl"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold tracking-tight text-foreground leading-snug">
                      <Link
                        href={`/work/${study.slug}`}
                        className="after:absolute after:inset-0 hover:text-primary transition-colors"
                      >
                        {study.title}
                      </Link>
                    </h2>

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

                    {/* Read more link */}
                    <div className="mt-6 pt-5 border-t border-border">
                      <ArrowLink href={`/work/${study.slug}`} tone="primary">
                        Read the full story
                      </ArrowLink>
                    </div>

                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <p className="mt-10 text-center font-mono text-xs text-muted-foreground">
            Client names withheld under NDA. We will walk through the specifics on a call.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-accent border-t border-border py-20 lg:py-28"
        aria-label="Start a project"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="eyebrow mb-4 text-muted-foreground">Ready to build?</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Your project could be next.
            </h2>
            <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-muted-foreground">
              Tell us what you are working on and we will come back with a clear scope, timeline,
              and fixed price. No obligation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Start a conversation
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Book a call
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
