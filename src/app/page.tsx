import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { TechStack } from "@/components/sections/tech-stack";
import { CaseStudies } from "@/components/sections/case-studies";
import { AssessmentCta } from "@/components/sections/assessment-cta";
import { About } from "@/components/sections/about";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { faqPageSchema, webPageSchema, serviceSchemas } from "@/lib/schemas";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://rethinkaiconsult.com",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      {serviceSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main id="main-content">
        <Hero />
        <Services />
        <TechStack />
        <CaseStudies />
        <AssessmentCta />
        <About />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
