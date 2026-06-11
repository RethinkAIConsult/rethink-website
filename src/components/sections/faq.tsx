import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { ArrowLink } from "@/components/arrow-link";
import { FAQ_ITEMS } from "@/lib/data";

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
            <Accordion>
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="px-6"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-medium text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
