import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { Badge } from "@/components/ui/badge";
import { SERVICES, BOOKING_URL } from "@/lib/data";
import { SITE_URL, GEO_SLUG, serviceHref, metaDescription } from "@/lib/site";
import { breadcrumbSchema, serviceLd, webPageLd } from "@/lib/schemas";

export function generateStaticParams() {
  // GEO lives at /geo, so it is not generated here (next.config redirects the
  // /services/geo-and-ai-visibility path to /geo).
  return SERVICES.filter((s) => s.slug !== GEO_SLUG).map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  const description = metaDescription(service.description);
  return {
    title: service.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/services/${slug}`,
    },
    openGraph: {
      title: service.title,
      description,
      url: `${SITE_URL}/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = service.icon;
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug);

  const serviceSchema = serviceLd(service, `${SITE_URL}/services/${slug}`);
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: service.title, url: `${SITE_URL}/services/${slug}` },
  ]);
  const pageSchema = webPageLd({
    name: service.title,
    description: service.description,
    url: `${SITE_URL}/services/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      {/* Hero */}
      <section
        className="relative border-b border-border/50 py-28 lg:py-36"
        aria-label={`${service.title} introduction`}
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
              <li>
                <Link
                  href="/services"
                  className="hover:text-foreground transition-colors"
                >
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground" aria-current="page">{service.title}</li>
            </ol>
          </nav>

          <p className="eyebrow mb-4 text-primary">Service</p>

          {/* Icon chip */}
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>

          <h1 className="display-lg text-foreground">{service.title}</h1>
          <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="section-accent border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              How it works
            </h2>
            <p className="mt-4 max-w-[52rem] text-base leading-relaxed text-muted-foreground">
              {service.details}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What we deliver */}
      <section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              What we deliver
            </h2>

            <ul className="mt-6 space-y-3" role="list">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-base text-muted-foreground"
                >
                  <span
                    className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-1.5">
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
          </FadeIn>
        </div>
      </section>

      {/* Other services */}
      <section className="section-accent border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Other services
            </h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              We work across the full AI engineering stack.
            </p>

            <ul className="mt-6 space-y-2" role="list">
              {otherServices.map((s) => {
                const OtherIcon = s.icon;
                return (
                  <li key={s.slug}>
                    <Link
                      href={serviceHref(s.slug)}
                      className="group flex items-center gap-3 rounded-md p-2 -ml-2 hover:bg-muted transition-colors"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <OtherIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {s.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <ArrowLink href="/work" tone="primary">
                See it in production
              </ArrowLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28" aria-label="Get in touch">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="eyebrow mb-4 text-primary">Ready to start</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Let us build this for you
            </h2>
            <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-muted-foreground">
              Fixed price, defined deliverables, senior engineers throughout.
              We scope before we build and hand you everything at the end.
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
