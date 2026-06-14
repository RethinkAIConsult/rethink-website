import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  MessageSquare,
  Gauge,
  ShieldCheck,
  Workflow,
  Mail,
  Lock,
} from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { CalEmbed } from "@/components/cal-embed";
import { SITE_URL } from "@/lib/site";
import { breadcrumbSchema, webPageLd } from "@/lib/schemas";

const META_DESCRIPTION =
  "Book a free 20-minute assessment call. A senior RethinkAI engineer reviews your website and operations live and shows you the highest-leverage automation and AI wins for your business. No obligation.";

export const metadata: Metadata = {
  title: "Free Assessment Call",
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/assessment` },
  openGraph: {
    title: "Free Assessment Call",
    description: META_DESCRIPTION,
    url: `${SITE_URL}/assessment`,
  },
};

const breadcrumb = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Free Assessment Call", url: `${SITE_URL}/assessment` },
]);

const pageSchema = webPageLd({
  name: "Free Assessment Call",
  description: META_DESCRIPTION,
  url: `${SITE_URL}/assessment`,
});

const WHAT_WE_COVER = [
  {
    icon: Search,
    label: "SEO and GEO foundations",
    detail: "How well your site ranks in search and gets found and cited by AI answer engines like ChatGPT and Perplexity.",
  },
  {
    icon: MessageSquare,
    label: "Messaging clarity",
    detail: "Whether your site communicates a clear, specific value proposition to the buyers you want.",
  },
  {
    icon: Gauge,
    label: "Performance signals",
    detail: "Page weight, mobile setup, and the quick wins that move conversion and Core Web Vitals.",
  },
  {
    icon: ShieldCheck,
    label: "Trust signals",
    detail: "HTTPS, structured data, and the completeness signals that affect credibility with people and machines.",
  },
  {
    icon: Workflow,
    label: "Automation opportunities",
    detail: "Two to three specific, realistic AI and automation wins for your business, with honest effort estimates.",
  },
] as const;

const HOW_IT_WORKS = [
  "Twenty minutes, on a real call with a senior engineer, not a sales rep.",
  "We look at your live site and how your team actually works.",
  "You leave with concrete, prioritised opportunities whether or not we work together.",
  "No obligation, no slide deck, no pressure.",
] as const;

export default function AssessmentPage() {
  return (
    <>
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
        aria-label="Assessment introduction"
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
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
              <li className="text-foreground" aria-current="page">Free Assessment Call</li>
            </ol>
          </nav>

          <p className="eyebrow mb-4 text-primary">Free assessment</p>
          <h1 className="display-lg text-foreground">Book a free assessment call</h1>
          <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-muted-foreground">
            A senior engineer reviews your website and operations live and shows you the
            highest-leverage automation and AI wins for your business. Twenty minutes, no
            obligation, and you keep the findings either way.
          </p>
        </div>
      </section>

      {/* What we cover */}
      <section className="section-accent border-b border-border/50 py-16 sm:py-20" aria-label="What we cover">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-8 text-muted-foreground">What we cover</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WHAT_WE_COVER.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.label} delay={i * 0.06}>
                  <div className="min-w-0 h-full rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-colors">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="py-20 lg:py-28" aria-label="Book a call">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display-lg text-foreground">Pick a time that suits you.</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Grab a slot below. We will confirm by email and send a short list of what to have ready.
            </p>
          </div>

          <FadeIn delay={0.1}>
            <ul className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-8" aria-label="How it works">
              {HOW_IT_WORKS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground sm:max-w-[15rem]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* Inline booking calendar, full width so Cal's date and time columns fit */}
        <FadeIn delay={0.12} className="mx-auto mt-10 w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <CalEmbed />
        </FadeIn>

        {/* Direct email */}
        <FadeIn delay={0.15} className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              We use your details only to run the call. No list, no spam.
            </p>
            <p className="text-sm text-muted-foreground">
              Prefer to write first?{" "}
              <a
                href="mailto:jack@rethinkaiconsult.com"
                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors duration-200 hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                jack@rethinkaiconsult.com
              </a>
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
