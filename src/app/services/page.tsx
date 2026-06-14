import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { Badge } from "@/components/ui/badge";
import { SERVICES, BOOKING_URL } from "@/lib/data";
import { SITE_URL, serviceHref } from "@/lib/site";
import { breadcrumbSchema, webPageLd } from "@/lib/schemas";

const META_DESCRIPTION =
  "The five ways we help teams ship production AI: automation pipelines, custom AI agents, full-stack applications, strategy and audit, and GEO and AI visibility. Senior engineers, fixed price, owned by your team.";

export const metadata: Metadata = {
  title: "AI Engineering Services",
  description: META_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: "AI Engineering Services",
    description: META_DESCRIPTION,
    url: `${SITE_URL}/services`,
  },
};

const pageSchema = webPageLd({
  name: "AI Engineering Services",
  description: META_DESCRIPTION,
  url: `${SITE_URL}/services`,
  type: "CollectionPage",
});

const breadcrumb = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Services", url: `${SITE_URL}/services` },
]);

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <section
        className="relative border-b border-border/50 py-28 lg:py-36"
        aria-label="Services introduction"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="bg-dots-fade absolute inset-0" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground" aria-current="page">Services</li>
            </ol>
          </nav>

          <p className="eyebrow mb-4 text-primary">Services</p>
          <h1 className="display-lg text-foreground">What we build</h1>
          <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-muted-foreground">
            We work across five disciplines: automation pipelines, AI agents,
            full-stack applications, strategy, and GEO. Every engagement
            delivers working software you own outright.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20 lg:py-28" aria-label="Service list">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <FadeIn key={service.slug} delay={i * 0.06} className="min-w-0">
                  <div className="group h-full rounded-lg border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/40 lg:p-7">
                    {/* Icon chip */}
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                      <Link
                        href={serviceHref(service.slug)}
                        className="hover:text-primary transition-colors"
                      >
                        {service.title}
                      </Link>
                    </h2>

                    {/* Description */}
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    {/* Tech badges */}
                    <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
                      {service.techBadges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="h-5 rounded-full px-2 text-xs font-mono text-muted-foreground"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    {/* Arrow link */}
                    <div className="mt-5">
                      <ArrowLink href={serviceHref(service.slug)} tone="primary">
                        Explore this service
                      </ArrowLink>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-accent border-t border-border/50 py-20 lg:py-28"
        aria-label="Get in touch"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="eyebrow mb-4 text-primary">Ready to start</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Tell us what you need to automate
            </h2>
            <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-muted-foreground">
              We scope every project before any work begins. Fixed price,
              defined deliverables, senior engineers throughout.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#1D4ED8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Get in touch
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors"
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
