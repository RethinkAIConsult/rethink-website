import {
  Workflow,
  Bot,
  Code,
  Search,
} from "lucide-react";

import type { Service, CaseStudy, FaqItem } from "@/types";

export const SERVICES: Service[] = [
  {
    title: "AI Automation Pipelines",
    description:
      "We turn multi-step manual processes into event-driven pipelines that run without supervision. Your data moves, enriches, and lands where it needs to be, at scale.",
    details:
      "We architect pipelines that ingest from multiple sources, enrich records with AI, apply business rules, and push results into your CRM or data warehouse. Every pipeline is idempotent, fully observable, and recovers automatically when something upstream breaks.",
    deliverables: [
      "End-to-end pipeline architecture and production implementation",
      "Event-driven orchestration via Inngest or n8n",
      "Automated retry logic, dead-letter handling, and alerting",
      "Live monitoring dashboard with error visibility",
    ],
    icon: Workflow,
    techBadges: ["Inngest", "n8n", "PostgreSQL", "Webhooks"],
  },
  {
    title: "Custom AI Agents",
    description:
      "Not chatbots. Agents that do real multi-step work: research, classify, decide, and act. Built on Claude, GPT, and purpose-fit models.",
    details:
      "We design agents that take on the repetitive, high-judgment work your team does by hand. Lead qualification, document analysis, data research, decision support. They plug into your existing tools, stay within the guardrails you define, and ship with an evaluation framework so you know exactly how accurate they are.",
    deliverables: [
      "Agent architecture with tool use, memory, and structured output",
      "Integration with your existing data sources and APIs",
      "Safety guardrails and human-in-the-loop checkpoints",
      "Promptfoo evaluation suite to measure and track accuracy",
    ],
    icon: Bot,
    techBadges: ["Claude", "GPT", "AgentKit", "TypeScript"],
  },
  {
    title: "Full-Stack Web Applications",
    description:
      "Production platforms on Next.js, React 19, and PostgreSQL. SaaS products, internal tools, client portals. Real code shipped to real users.",
    details:
      "We build complete web applications from database schema to deployed product. The stack is opinionated for speed and maintainability: Next.js and TypeScript on the front end, PostgreSQL for data, Vercel for hosting. Every application ships with authentication, role-based access control, real error handling, and a codebase your team can own.",
    deliverables: [
      "Full-stack Next.js application with strict TypeScript",
      "PostgreSQL schema design, migrations, and query layer",
      "Authentication and role-based access control",
      "CI/CD deployment pipeline with zero-downtime releases",
    ],
    icon: Code,
    techBadges: ["Next.js", "React 19", "TypeScript", "PostgreSQL"],
  },
  {
    title: "Strategy and Audit",
    description:
      "We map your operations, score every process for automation potential, and hand back a ranked roadmap before a single line of code is written.",
    details:
      "Before we build anything, we study how your team actually works. We identify the bottlenecks, quantify the time cost of each, and score each process against realistic automation feasibility. You get a prioritised roadmap with honest timelines, build-versus-buy recommendations, and ROI estimates grounded in your actual numbers.",
    deliverables: [
      "Current-state process mapping and bottleneck analysis",
      "Automation opportunity scoring with time and cost estimates",
      "Prioritised implementation roadmap ranked by ROI",
      "Technology recommendations with trade-off analysis",
    ],
    icon: Search,
    techBadges: ["Process Design", "ROI Analysis", "Strategy"],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Analyst Intelligence Platform",
    subtitle: "120+ analyst hours automated every month",
    description:
      "A national insurance brokerage had analysts pulling figures from a dozen systems, reconciling them in spreadsheets, and producing weekly reports by hand. We replaced the entire workflow with an event-driven pipeline and an AI agent that researches, classifies, and surfaces insights automatically.",
    tags: ["AI Agent", "Inngest", "PostgreSQL", "Next.js"],
    results: [
      "More than 120 analyst hours a month automated end to end",
      "Weekly reporting pack ready every morning, untouched by hand",
      "AI classification accuracy above 95 percent on held-out test data",
      "Live monitoring dashboard with per-run cost and accuracy tracking",
    ],
  },
  {
    title: "CRM Enrichment Engine",
    subtitle: "12,000 records enriched weekly without manual input",
    description:
      "A B2B SaaS company needed contact and account data enriched continuously as records flowed in. We built a multi-stage pipeline that scores, deduplicates, and enriches records using AI signal extraction, then writes structured results back via webhook. The pipeline processes roughly 12,000 records per week with zero manual steps.",
    tags: ["Data Pipeline", "AI", "Webhooks", "TypeScript"],
    results: [
      "12,000 records enriched per week with no manual input",
      "AI signal extraction with 88 percent recall on benchmarked test set",
      "Deduplication layer eliminating duplicate records on ingest",
      "Full observability: cost, latency, and error rate per pipeline run",
    ],
  },
  {
    title: "Operations SaaS Platform",
    subtitle: "From spreadsheets to a production SaaS in six weeks",
    description:
      "A service business was managing bookings, scheduling, and invoicing across spreadsheets and WhatsApp threads. We built a complete SaaS platform with client-facing booking flows, automated scheduling logic, a self-service portal, and integrated payments. Live in six weeks.",
    tags: ["Next.js", "SaaS", "PostgreSQL", "Stripe"],
    results: [
      "Full booking and scheduling workflow automated end to end",
      "Client self-service portal with real-time status updates",
      "Invoicing and payment collection integrated with Stripe",
      "Admin dashboard with business analytics and daily reporting",
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What kind of businesses do you work with?",
    answer:
      "Mostly SMBs and scale-ups: companies that have grown past the point where manual processes can keep up, but do not yet have an in-house AI engineering team. Our clients typically turn over between £500K and £20M, with teams of 5 to 100 people. If your team spends meaningful hours each week on repeatable work, there is almost certainly a high-leverage automation to be built.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects run 2 to 8 weeks from kickoff to production. A focused automation pipeline or AI agent is typically live in 2 to 3 weeks. A full-stack product with authentication, multiple roles, and third-party integrations usually runs 6 to 8 weeks. We scope tightly and ship in increments, so you see working software in the first week.",
  },
  {
    question: "Do you offer ongoing maintenance and support?",
    answer:
      "Yes. After launch we offer a monthly retainer covering monitoring, dependency updates, bug fixes, and small feature additions. Most clients move from a build engagement onto a retainer. We also offer ad-hoc support if you prefer to reach out when something needs attention rather than commit to a recurring arrangement.",
  },
  {
    question: "What is your core technology stack?",
    answer:
      "The core is Next.js (React 19) and TypeScript on the front end, PostgreSQL for data, and Vercel for hosting. For automation we use Inngest for event-driven pipelines and n8n for workflow orchestration. For AI we build primarily with Claude (Anthropic) and GPT (OpenAI). It is TypeScript end to end. Every codebase we hand over is something your team can read, maintain, and extend.",
  },
  {
    question: "How do you price your work?",
    answer:
      "Fixed price for defined scope. You receive a detailed proposal with deliverables, timeline, and total cost before any work begins. For ongoing work we offer monthly retainers priced by the level of support you need. We do not bill by the hour because it rewards slow work.",
  },
  {
    question: "Can you integrate with the tools we already use?",
    answer:
      "Almost always, yes. We have connected Salesforce, HubSpot, Stripe, Xero, Google Workspace, Slack, Airtable, and a range of industry-specific platforms. If it has an API, we can connect it. If it does not, we have built scrapers and email parsers to bridge the gap. The goal is to amplify what you already have.",
  },
  {
    question: "What is an AI engineering studio?",
    answer:
      "An AI engineering studio is a specialist consultancy that designs, builds, and ships production AI systems rather than advising on strategy alone. We write the code, deploy the pipelines, and hand you working software. The studio model means you get senior engineers on every engagement, not a team of consultants backed by offshore delivery. We own the outcome, not just the recommendation.",
  },
  {
    question: "How much does an AI automation project cost?",
    answer:
      "Projects are fixed price, typically ranging from £5,000 for a focused automation pipeline to £50,000 for a full-stack product with multiple AI agents and integrations. The exact figure depends on scope, not time. Every engagement starts with a scoping call and a written proposal that locks in deliverables, timeline, and total cost before any work begins.",
  },
  {
    question: "How do you handle our data and security?",
    answer:
      "We take a minimal-data approach: we only access the systems and records needed to build what you have commissioned. For UK clients we operate within GDPR constraints and can sign a data processing agreement. When we use third-party AI models such as Claude or GPT, we opt out of training data usage via API agreements with Anthropic and OpenAI. Sensitive data is handled in-region where your infrastructure allows, and we document every data flow in the handover pack.",
  },
];
