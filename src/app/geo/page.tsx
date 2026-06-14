import type { Metadata } from "next";
import Link from "next/link";
import { Telescope, Search, FileCode, Network, Gauge, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { SERVICES, FAQ_ITEMS, BOOKING_URL } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { serviceLd, breadcrumbSchema, webPageLd, faqPageLd } from "@/lib/schemas";

const META_DESCRIPTION =
  "GEO is SEO for AI answer engines. We engineer your site so ChatGPT, Claude, Perplexity, and Gemini can find, trust, and cite your business, then we track your AI share of voice over time.";

export const metadata: Metadata = {
  title: "Generative Engine Optimisation (GEO)",
  description: META_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/geo`,
  },
  openGraph: {
    title: "Generative Engine Optimisation (GEO)",
    description: META_DESCRIPTION,
    url: `${SITE_URL}/geo`,
  },
};

const geo = SERVICES.find((s) => s.slug === "geo-and-ai-visibility")!;

const GEO_FAQS = [
  FAQ_ITEMS.find((f) => f.question.includes("GEO"))!,
  {
    question: "How is GEO different from SEO?",
    answer:
      "SEO optimises to rank in a list of links. GEO optimises to be the source an AI engine trusts and cites inside a single generated answer. The two share foundations like crawlability and structured content, but GEO adds entity authority, answer shaped content, and machine readable knowledge files so a language model can quote you directly.",
  },
  {
    question: "Which AI engines does GEO cover?",
    answer:
      "We optimise for and track the engines your buyers actually use: ChatGPT and ChatGPT Search, Claude, Perplexity, Google AI Overviews and Gemini, and Microsoft Copilot. Each retrieves and cites differently, so we engineer for the signals they share and measure each one separately.",
  },
  {
    question: "How do you measure AI visibility?",
    answer:
      "We measure share of voice. We define your buyers' prompts and your competitor set, query the major AI engines on a schedule, and record how often you are mentioned, cited, and recommended, and in what position. Because AI answers vary between runs, we sample repeatedly and track the trend over time rather than a single snapshot.",
  },
  {
    question: "Can you improve how AI engines describe my business?",
    answer:
      "Yes. By strengthening your entity signals, structured data, and the answer shaped content on your own pages, we shape both whether you are cited and how accurately an engine describes what you do. We cannot control a model's output directly, but we can control the sources it reads.",
  },
];

const HOW_AI_DECIDES = [
  {
    icon: Search,
    label: "Retrievability",
    body: "The engine can only cite what it can fetch. That means being crawlable by the AI bots, serving your content as real HTML rather than JavaScript only, and being present in the search indexes these engines draw from.",
  },
  {
    icon: FileCode,
    label: "Answer shaped content",
    body: "Models lift and quote self-contained passages. Content that answers one specific question up front, with clear definitions, comparisons, and statistics in context, gets quoted. Walls of marketing copy do not.",
  },
  {
    icon: Network,
    label: "Atomic citable URLs",
    body: "Engines cite a URL. A page about one topic is far more citable than a homepage about ten, so each service, case study, and question deserves its own page.",
  },
  {
    icon: Telescope,
    label: "Entity authority",
    body: "An engine has to be confident you are a real, identifiable business. That confidence comes from structured data and from corroboration across independent sources: your company profiles, directories, and named people with verifiable credentials.",
  },
  {
    icon: Gauge,
    label: "Freshness",
    body: "Recently updated content is weighted more heavily. Dated, structured signals tell an engine that your information is current.",
  },
  {
    icon: ShieldCheck,
    label: "Honest signals",
    body: "We never fabricate reviews or ratings. Invented trust signals are the fastest way to get filtered out and the most likely thing to trigger a penalty.",
  },
];

export default function GeoPage() {
  const GeoIcon = geo.icon;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd(geo, `${SITE_URL}/geo`)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "GEO and AI Visibility", url: `${SITE_URL}/geo` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageLd({
              name: "Generative Engine Optimisation (GEO)",
              description: META_DESCRIPTION,
              url: `${SITE_URL}/geo`,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd(GEO_FAQS)) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center gap-2 py-3 font-mono text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">GEO and AI Visibility</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative border-b border-border/50 py-28 lg:py-36"
        aria-labelledby="geo-heading"
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="bg-dots-fade absolute inset-0" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="eyebrow mb-4 text-primary">GEO and AI Visibility</p>
            <h1 id="geo-heading" className="display-lg text-foreground">
              Generative Engine Optimisation
            </h1>
            <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-muted-foreground">
              Your buyers now ask ChatGPT, Claude, Perplexity, and Google AI Overviews who to hire.
              We make sure the answer is you.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#1D4ED8] transition-colors"
              >
                Get a GEO audit
              </Link>
              <ArrowLink
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                tone="default"
              >
                Book a call
              </ArrowLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What is GEO */}
      <section className="section-accent border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-[52rem]">
              <p className="eyebrow mb-4 text-muted-foreground">The discipline</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                What is GEO
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Generative Engine Optimisation (GEO) is the practice of engineering your web
                presence so AI answer engines can find, trust, and cite your business when buyers
                ask them for recommendations. It is the natural successor to SEO. Where SEO competes
                for a rank in a list of links, GEO competes to be the cited source inside a single
                AI generated answer.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why it matters now */}
      <section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-[52rem]">
              <p className="eyebrow mb-4 text-muted-foreground">The shift</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Why it matters now
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Search is shifting from a page of links to one synthesised answer with a handful of
                citations. When a buyer asks an AI engine for a recommendation and never sees a
                traditional results page, the rank you hold on a search engine is irrelevant to that
                moment. If your site is not structured for machines to read and quote, you are
                invisible in the answer. GEO is how you stay in it.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How AI answer engines decide who to cite */}
      <section className="section-accent border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="eyebrow mb-4 text-muted-foreground">The signals</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              How AI answer engines decide who to cite
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_AI_DECIDES.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeIn key={item.label} delay={i * 0.07}>
                  <div className="h-full rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="font-semibold text-foreground">{item.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="eyebrow mb-4 text-muted-foreground">The work</p>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  What we do
                </h2>
                <div className="mb-5 mt-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GeoIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  We engineer every one of these signals, then we measure the result.
                </p>
              </div>
              <div>
                <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Deliverables
                </p>
                <ul className="space-y-3" role="list">
                  {geo.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span
                        className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How we measure it */}
      <section className="section-accent border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-[52rem]">
              <p className="eyebrow mb-4 text-muted-foreground">Measurement</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                How we measure it
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                GEO is not deterministic. Ask the same engine the same question twice and the answer
                and its citations can differ, so we do not measure a single rank. We measure share
                of voice. We define the set of prompts your buyers actually use and the competitors
                you care about, then we query the major engines, ChatGPT, Claude, Perplexity, and
                Gemini, on a schedule and record how often you are mentioned, whether your site is
                cited, whether you are recommended, and in what position. You watch that share of
                voice move over time.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* We run our own site this way */}
      <section className="border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="rounded-lg border border-primary/30 bg-primary/[0.03] p-8 lg:p-10">
              <p className="eyebrow mb-4 text-primary">Proof</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                We run our own site this way
              </h2>
              <p className="mt-6 max-w-[52rem] text-base leading-relaxed text-muted-foreground">
                This is not theory we sell and skip ourselves. This site is engineered for GEO end
                to end: structured data, an llms.txt knowledge file, answer shaped content on
                dedicated pages, and the entity signals that make us citable. We track our own AI
                share of voice the same way we track yours.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-accent border-b border-border/50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="eyebrow mb-4 text-muted-foreground">Questions</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Common questions about GEO
            </h2>
          </FadeIn>
          <div className="mt-10 space-y-8">
            {GEO_FAQS.map((faq, i) => (
              <FadeIn key={faq.question} delay={i * 0.06}>
                <div className="rounded-lg border border-border bg-card p-6 lg:p-8">
                  <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Want to know how you show up in AI answers today?
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#1D4ED8] transition-colors"
                >
                  Get a GEO audit
                </Link>
                <ArrowLink
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  tone="default"
                >
                  Book a call
                </ArrowLink>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
