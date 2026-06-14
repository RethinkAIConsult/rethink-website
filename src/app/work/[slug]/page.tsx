import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { CountUp } from "@/components/count-up";
import { CASE_STUDIES, BOOKING_URL } from "@/lib/data";
import { SITE_URL, metaDescription } from "@/lib/site";
import { breadcrumbSchema, webPageLd } from "@/lib/schemas";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return {};
  const description = metaDescription(study.description);
  return {
    title: study.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/work/${slug}`,
    },
    openGraph: {
      title: study.title,
      description,
      url: `${SITE_URL}/work/${slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  const studyBreadcrumbLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Work", url: `${SITE_URL}/work` },
    { name: study.title, url: `${SITE_URL}/work/${slug}` },
  ]);

  const studyPageLd = webPageLd({
    name: study.title,
    description: study.description,
    url: `${SITE_URL}/work/${slug}`,
  });

  const otherStudies = CASE_STUDIES.filter((c) => c.slug !== study.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studyBreadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studyPageLd) }}
      />

      {/* Hero */}
      <section
        className="relative border-b border-border/50 py-28 lg:py-36"
        aria-label="Case study introduction"
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
              <li>
                <Link href="/work" className="hover:text-foreground transition-colors">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground truncate max-w-[20ch]" aria-current="page">{study.title}</li>
            </ol>
          </nav>

          <p className="eyebrow mb-4 text-primary">{study.sector}</p>
          <h1 className="display-lg text-foreground">{study.title}</h1>

          {/* Headline metric */}
          {study.metric ? (
            <div className="mt-8">
              <div className="flex items-baseline gap-1">
                <CountUp
                  value={study.metric.value}
                  separator={study.metric.separator ?? false}
                  className="metric text-5xl lg:text-6xl text-primary leading-none"
                />
                {study.metric.unit && (
                  <span className="text-2xl text-primary/70 font-mono leading-none">
                    {study.metric.unit}
                  </span>
                )}
              </div>
              <p className="mt-2 text-base text-muted-foreground font-sans">
                {study.metric.label}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-lg text-muted-foreground">{study.subtitle}</p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="border-b border-border/50 py-16 sm:py-20" aria-label="Engagement overview">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="max-w-[56rem] text-lg leading-relaxed text-muted-foreground">
              {study.description}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Outcomes */}
      <section className="section-accent border-b border-border/50 py-16 sm:py-20" aria-labelledby="outcomes-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 id="outcomes-heading" className="text-2xl font-semibold tracking-tight text-foreground mb-8">
              Outcomes
            </h2>
            <ul className="space-y-4 max-w-[44rem]" role="list">
              {study.results.map((result) => (
                <li key={result} className="flex items-start gap-3 text-base text-muted-foreground">
                  <span
                    className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                    aria-hidden="true"
                  />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Meta block: sector + tags + NDA note */}
      <section className="border-b border-border/50 py-12 sm:py-16" aria-label="Engagement details">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-start gap-8">
              <div>
                <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Sector
                </p>
                <span className="font-mono text-xs uppercase tracking-wider text-primary border border-primary/30 bg-primary/5 rounded-full px-2 py-0.5">
                  {study.sector}
                </span>
              </div>
              <div>
                <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <p className="font-mono text-xs text-muted-foreground">
                  Client name withheld under NDA.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* More work */}
      <section className="py-16 sm:py-20 border-b border-border/50" aria-label="More case studies">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-8">
              More work
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherStudies.map((other) => (
                <Link
                  key={other.slug}
                  href={`/work/${other.slug}`}
                  className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-primary border border-primary/30 bg-primary/5 rounded-full px-2 py-0.5 self-start">
                    {other.sector}
                  </span>
                  <span className="text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {other.title}
                  </span>
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {other.description}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <ArrowLink href="/services" tone="default">
                See what we build
              </ArrowLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-accent py-20 lg:py-28"
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
