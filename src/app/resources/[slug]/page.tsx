import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import { ArrowLink } from "@/components/arrow-link";
import { ARTICLES, getArticle } from "@/lib/resources";
import { BOOKING_URL } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { articleLd, breadcrumbSchema, faqPageLd } from "@/lib/schemas";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${SITE_URL}/resources/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/resources/${slug}`,
      type: "article",
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/resources/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(article, url)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Guides", url: `${SITE_URL}/resources` },
              { name: article.title, url },
            ]),
          ),
        }}
      />
      {article.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd(article.faqs)) }}
        />
      )}

      {/* Hero */}
      <section
        className="relative border-b border-border/50 py-20 lg:py-28"
        aria-label="Article introduction"
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="bg-dots-fade absolute inset-0" />
        </div>
        <div className="mx-auto max-w-[44rem] px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/resources" className="hover:text-foreground transition-colors">Guides</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground truncate max-w-[18ch]" aria-current="page">{article.title}</li>
            </ol>
          </nav>

          <p className="eyebrow mb-4 text-primary">Guide</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.dek}</p>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            By Jack Costanzi
            <span aria-hidden="true"> &middot; </span>
            <time dateTime={article.dateModified}>{formatDate(article.dateModified)}</time>
            <span aria-hidden="true"> &middot; </span>
            {article.readMinutes} min read
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-[44rem] px-4 sm:px-6 lg:px-8">
          {article.sections.map((section, i) => (
            <FadeIn key={section.heading} delay={i === 0 ? 0 : 0.04}>
              <section className={i === 0 ? "" : "mt-12"}>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {section.heading}
                </h2>
                {section.body.map((para, j) => (
                  <p key={j} className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-5 space-y-2.5" role="list">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-base text-muted-foreground">
                        <span
                          className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                          aria-hidden="true"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </FadeIn>
          ))}

          {/* FAQ */}
          {article.faqs.length > 0 && (
            <section className="mt-16 border-t border-border pt-12">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
              <div className="mt-6 space-y-6">
                {article.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          {article.related && article.related.length > 0 && (
            <section className="mt-16 border-t border-border pt-8">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Keep reading
              </p>
              <ul className="mt-4 space-y-2" role="list">
                {article.related.map((r) => (
                  <li key={r.href}>
                    <ArrowLink href={r.href} tone="primary">{r.label}</ArrowLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      {/* CTA */}
      <section className="section-accent border-t border-border/50 py-20 lg:py-28" aria-label="Get in touch">
        <div className="mx-auto max-w-[44rem] px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Want this applied to your business?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Book a free assessment call and we will give you a concrete, prioritised read on what
              to do first.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#1D4ED8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Book a call
              </Link>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                See available times
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
