import { FAQ_ITEMS, SERVICES } from "@/lib/data";

const SITE_URL = "https://rethinkaiconsult.com";

// Stable @id anchors
const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#jack-costanzi`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// ---- Organization -------------------------------------------------------

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "RethinkAI Consult",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo.svg`,
    width: 200,
    height: 48,
  },
  founder: { "@id": PERSON_ID },
  description:
    "RethinkAI Consult is an AI engineering studio that builds production automation pipelines, custom AI agents, and full-stack applications for ambitious teams. We replace manual processes with systems that scale.",
  sameAs: ["https://github.com/RethinkAIConsult"],
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United States" },
    { "@type": "Continent", name: "Europe" },
  ],
  knowsAbout: [
    "Artificial Intelligence Engineering",
    "Machine Learning",
    "Process Automation",
    "Large Language Models",
    "AI Agents",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Inngest",
    "n8n",
    "Claude AI",
    "OpenAI GPT",
    "Event-driven Architecture",
    "Data Pipeline Engineering",
    "Full-Stack Web Development",
    "SaaS Platform Development",
    "Business Process Automation",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@rethinkaiconsult.com",
    url: `${SITE_URL}/#contact`,
    availableLanguage: "English",
  },
};

// ---- Person (founder) ---------------------------------------------------

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Jack Costanzi",
  jobTitle: "Founder and Lead AI Engineer",
  worksFor: { "@id": ORG_ID },
  url: "https://linkedin.com/in/jackcostanzi",
  sameAs: [
    "https://linkedin.com/in/jackcostanzi",
    "https://github.com/jackcostanzi",
  ],
  knowsAbout: [
    "AI Engineering",
    "LLM Engineering",
    "Process Automation",
    "AI Agents",
    "Fintech AI",
    "Event-driven Architecture",
    "TypeScript",
    "Next.js",
  ],
};

// ---- Per-service schemas -------------------------------------------------

const serviceSchemas = SERVICES.map((service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  description: service.description,
  provider: { "@id": ORG_ID },
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United States" },
  ],
  serviceType: "AI Engineering Consulting",
}));

// ---- ProfessionalService with hasOfferCatalog ---------------------------

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#professionalservice`,
  name: "RethinkAI Consult",
  url: SITE_URL,
  description:
    "AI engineering studio. We build production automation pipelines, custom AI agents, and full-stack web applications for SMBs and scale-ups that have outgrown manual processes.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
    addressRegion: "England",
  },
  serviceType: [
    "AI Automation Engineering",
    "Custom AI Agent Development",
    "Full-Stack Web Application Development",
    "Data Pipeline Engineering",
    "Business Process Automation Consulting",
  ],
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United States" },
    { "@type": "Continent", name: "Europe" },
  ],
  priceRange: "£5,000 - £50,000",
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Process Automation",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Claude AI",
    "n8n",
    "Inngest",
    "LLM Engineering",
    "AI Agents",
    "Event-driven Architecture",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Engineering Services",
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@id": ORG_ID },
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "GBP",
        minPrice: 5000,
      },
    })),
  },
  founder: { "@id": PERSON_ID },
  sameAs: ["https://github.com/RethinkAIConsult"],
};

// ---- WebSite ------------------------------------------------------------

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "RethinkAI Consult",
  url: SITE_URL,
  description:
    "AI engineering studio building production automation pipelines, custom AI agents, and full-stack applications.",
  publisher: { "@id": ORG_ID },
  inLanguage: "en-GB",
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: { "@id": ORG_ID },
};

// ---- FAQPage ------------------------------------------------------------

export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// ---- WebPage (homepage) -------------------------------------------------

export const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "RethinkAI Consult: AI Engineering Studio",
  description:
    "AI engineering studio building production automation pipelines, custom AI agents, and full-stack applications for SMBs and scale-ups.",
  url: SITE_URL,
  inLanguage: "en-GB",
  isPartOf: { "@id": WEBSITE_ID },
  about: {
    "@type": "Thing",
    name: "AI Automation Engineering",
  },
  provider: { "@id": ORG_ID },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ],
  },
};

// ---- Aggregate export (for pages that emit multiple schemas) ------------

export { serviceSchemas };
