import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { ArrowRight } from "lucide-react";
import { ARTICLES } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";
import { breadcrumbSchema, webPageLd } from "@/lib/schemas";

const META_DESCRIPTION =
  "Practical guides on AI automation, GEO, and what it costs to ship production AI. Answer-first articles from the RethinkAI engineering team.";

export const metadata: Metadata = {
  title: "Guides",
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/resources` },
  openGraph: { title: "Guides", description: META_DESCRIPTION, url: `${SITE_URL}/resources` },
};

const pageSchema = webPageLd({
  name: "Guides",
  description: META_DESCRIPTION,
  url: `${SITE_URL}/resources`,
  type: "CollectionPage",
});

const breadcrumb = breadcrumbSchema([
  { name: "Home", url: SITE_URL },
  { name: "Guides", url: `${SITE_URL}/resources` },
]);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ResourcesPage() {
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
        aria-label="Guides introduction"
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="bg-dots-fade absolute inset-0" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground" aria-current="page">Guides</li>
            </ol>
          </nav>
          <p className="eyebrow mb-4 text-primary">Resources</p>
          <h1 className="display-lg text-foreground">Guides</h1>
          <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-muted-foreground">
            Straight answers to the questions we get asked most: how AI search visibility works,
            when to build versus buy, and what production AI actually costs. Written by the
            engineers who do the work.
          </p>
        </div>
      </section>

      {/* Article list */}
      <section className="py-20 lg:py-28" aria-label="Guides">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article, i) => (
              <FadeIn key={article.slug} delay={i * 0.06} className="min-w-0">
                <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-7 transition-colors duration-200 hover:border-primary/40">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <time dateTime={article.dateModified}>{formatDate(article.dateModified)}</time>
                    <span aria-hidden="true"> &middot; </span>
                    {article.readMinutes} min read
                  </p>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground leading-snug">
                    <Link
                      href={`/resources/${article.slug}`}
                      className="after:absolute after:inset-0 hover:text-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {article.dek}
                  </p>
                  <div className="mt-6 pt-5 border-t border-border">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-primary"
                    >
                      Read the guide
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </FadeIn>
            ))}
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
            <p className="eyebrow mb-4 text-primary">Ready to talk</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Rather skip ahead to specifics?
            </h2>
            <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-muted-foreground">
              Book a free assessment call and we will walk through the highest-leverage wins for
              your business.
            </p>
            <div className="mt-8">
              <Link
                href="/#contact"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#1D4ED8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Book a call
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
