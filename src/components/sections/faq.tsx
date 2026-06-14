import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { ArrowLink } from "@/components/arrow-link";
import { FAQ_ITEMS } from "@/lib/data";

/**
 * Server-rendered FAQ using native <details>/<summary>. Every question and
 * answer ships in the initial HTML (no client accordion that unmounts closed
 * panels), so non-JS crawlers and AI answer engines can read the answers, and
 * the visible content mirrors the FAQPage JSON-LD on the homepage.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="border-t border-border py-20 lg:py-28 section-accent"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeading
          number="05"
          eyebrow="FAQ"
          headingId="faq-heading"
          title={<>Common questions</>}
          aside={<ArrowLink href="#contact">Ask us directly</ArrowLink>}
        />

        <FadeIn delay={0.1}>
          <div className="mt-12 lg:mt-14 mx-auto max-w-4xl rounded-xl border border-border bg-card">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group border-b border-border px-6 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-medium text-foreground">
                  <span>{item.question}</span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
