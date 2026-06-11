import type { Metadata } from "next";
import { AssessmentForm } from "@/components/assessment-form";
import { FadeIn } from "@/components/fade-in";

const SITE_URL = "https://rethinkaiconsult.com";
const ORG_ID = `${SITE_URL}/#organization`;

const assessmentAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RethinkAI Free Website Assessment",
  url: `${SITE_URL}/assessment`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Free AI-powered assessment of your website covering SEO foundations, messaging clarity, performance signals, trust signals, and automation opportunities.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
  },
  provider: { "@id": ORG_ID },
};

const assessmentBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Website Assessment",
      item: `${SITE_URL}/assessment`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Free Website Assessment",
  description:
    "Get a free, AI-powered assessment of your website. We review SEO foundations, messaging clarity, performance signals, and surface two to three concrete automation opportunities specific to your business.",
  openGraph: {
    title: "Free Website Assessment",
    description:
      "Instant AI analysis of your website: SEO, clarity, performance, and automation opportunities. No account needed.",
    url: "https://rethinkaiconsult.com/assessment",
    images: [
      {
        url: "https://rethinkaiconsult.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RethinkAI Consult website assessment",
      },
    ],
  },
  alternates: {
    canonical: "https://rethinkaiconsult.com/assessment",
  },
};

const WHAT_WE_CHECK = [
  {
    label: "SEO foundations",
    detail: "Title tags, meta description, heading structure, JSON-LD, and OG tags.",
  },
  {
    label: "Messaging clarity",
    detail: "Whether your page communicates a clear, specific value proposition.",
  },
  {
    label: "Performance signals",
    detail: "Page weight, mobile viewport setup, and quick-win opportunities.",
  },
  {
    label: "Trust signals",
    detail: "HTTPS, structured data, and completeness signals that affect credibility.",
  },
  {
    label: "AI automation opportunities",
    detail: "Two to three specific, realistic automation wins tailored to your business.",
  },
] as const;

export default function AssessmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(assessmentAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(assessmentBreadcrumbSchema) }}
      />
      {/* Hero */}
      <section
        className="relative border-b border-border/50 py-28 lg:py-36"
        aria-label="Assessment introduction"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="bg-dots-fade absolute inset-0" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4 text-primary">Free tool</p>
          <h1 className="display-lg text-foreground">
            Website assessment
          </h1>
          <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-muted-foreground">
            Enter your URL and work email. We fetch the live page, extract structural signals, and
            score the site against SEO, messaging, performance, and trust criteria. Results appear
            inline in about 20 seconds.
          </p>
        </div>
      </section>

      {/* What we check */}
      <section className="section-accent border-b border-border/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-8 text-muted-foreground">What we cover</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WHAT_WE_CHECK.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.07}>
                <div className="min-w-0 rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-colors">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-28 lg:py-36" aria-label="Assessment form">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_2fr]">
            {/* Sidebar */}
            <FadeIn className="min-w-0">
              <div className="sticky top-24 space-y-6">
                <p className="eyebrow text-primary">No account needed</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We use your email only to send the report. We do not sign you up for anything.
                  To follow up, reply to that email or book a call.
                </p>

                <div className="section-divider" />

                <div className="space-y-3">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    How it works
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Powered by Claude (Anthropic)
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      We fetch the live page and analyse real signals
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Results appear inline, no waiting for email
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Report also sent to your inbox for reference
                    </li>
                  </ul>
                </div>

                <div className="section-divider" />

                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Proof
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    On one recent engagement we automated more than 120 hours of
                    manual analyst work every month. The weekly reporting pack now
                    builds itself overnight.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Form area */}
            <FadeIn delay={0.1} className="min-w-0">
              <div className="rounded-lg border border-border bg-card p-7 sm:p-8">
                <p className="eyebrow mb-2 text-muted-foreground">Step 1 of 1</p>
                <h2 className="display-lg text-foreground mb-8">Run your assessment</h2>
                <AssessmentForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
