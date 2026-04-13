import { FAQ_ITEMS } from "@/lib/data";

const SITE_URL = "https://rethinkaiconsult.com";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RethinkAI Consult",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.svg`,
  founder: {
    "@type": "Person",
    name: "Jack Costanzi",
    jobTitle: "AI Automation Engineer",
  },
  description:
    "AI automation consultancy building production pipelines, custom AI agents, and full-stack web applications for businesses that have outgrown manual processes.",
  sameAs: [
    "https://github.com/RethinkAIConsult",
    "https://linkedin.com/in/jackcostanzi",
  ],
};

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "RethinkAI Consult",
  url: SITE_URL,
  description:
    "AI automation engineering — we build production pipelines, custom AI agents, and full-stack web applications.",
  serviceType: [
    "AI Automation Engineering",
    "Custom AI Agent Development",
    "Full-Stack Web Application Development",
    "Database Architecture & Data Pipelines",
    "Business Process Automation Consulting",
  ],
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  priceRange: "£5,000 - £50,000+",
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
  ],
};

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

export const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "RethinkAI Consult — AI Automation Engineering",
  description:
    "AI automation consultancy building production pipelines, custom AI agents, and full-stack web applications for SMBs and scale-ups.",
  url: SITE_URL,
  about: {
    "@type": "Thing",
    name: "AI Automation Engineering",
  },
  provider: {
    "@type": "Organization",
    name: "RethinkAI Consult",
  },
};
