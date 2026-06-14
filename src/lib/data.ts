import {
  Workflow,
  Bot,
  Code,
  Search,
  Telescope,
} from "lucide-react";

import type { Service, CaseStudy, FaqItem } from "@/types";

// Booking link (Cal.com or Calendly). Empty string falls back to the contact form, no broken link is rendered.
export const BOOKING_URL = "https://cal.com/jack-costanzi/intro-call";

export const SERVICES: Service[] = [
  {
    slug: "ai-automation-pipelines",
    title: "AI Automation Pipelines",
    description:
      "Your team is copying data between systems by hand, updating the CRM from spreadsheets, and rebuilding the same report every Friday. We turn those multi step manual processes into event driven pipelines that run without supervision: CRM enrichment, weekly reporting packs, invoice and document processing, lead routing, and data sync across the tools you already use.",
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
    slug: "custom-ai-agents",
    title: "Custom AI Agents",
    description:
      "Not chatbots. Agents that do real multi step work: lead qualification, analyst research, document classification, support triage, and data extraction. Built on Claude, GPT, and purpose fit models, they decide and act within the guardrails you set.",
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
    slug: "full-stack-web-applications",
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
    slug: "strategy-and-audit",
    title: "Strategy and Audit",
    description:
      "We map your operations, score every process for automation potential, and hand back a ranked roadmap before a single line of code is written. And if you have already bought AI tools but are not seeing results, we audit the stack you have, find the gaps, and hand back a ranked plan for what to fix first.",
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
  {
    slug: "geo-and-ai-visibility",
    title: "GEO and AI Visibility",
    description:
      "Your buyers now ask ChatGPT, Claude, Perplexity, and Google AI Overviews who to hire. We make sure the answer is you.",
    details:
      "Generative Engine Optimisation (GEO) is SEO for AI answer engines. We engineer your site so large language models can read, trust, and quote it: structured data, an llms.txt knowledge file, answer shaped content, and the entity and authority signals AI systems weigh when they decide who to cite. Then we track how your brand shows up in AI answers over time, so you can watch your share of voice move.",
    deliverables: [
      "GEO audit with a 0 to 100 AI visibility score and a prioritised fix list",
      "Structured data, llms.txt, and content engineered for AI extraction",
      "Entity and authority signals that make your brand citable by AI",
      "Ongoing AI share of voice tracking across ChatGPT, Claude, Perplexity, and Gemini",
    ],
    icon: Telescope,
    techBadges: ["Schema.org", "llms.txt", "Perplexity", "Claude"],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "analyst-intelligence-platform",
    title: "Analyst Intelligence Platform",
    subtitle: "120+ analyst hours automated every month",
    sector: "Insurance",
    metric: { value: 120, unit: "+", label: "Analyst hours automated monthly" },
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
    slug: "crm-enrichment-engine",
    title: "CRM Enrichment Engine",
    subtitle: "12,000 records enriched weekly without manual input",
    sector: "B2B SaaS",
    metric: { value: 12000, separator: true, label: "Records enriched weekly" },
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
    slug: "operations-saas-platform",
    title: "Operations SaaS Platform",
    subtitle: "From spreadsheets to a production SaaS in six weeks",
    sector: "Service business",
    metric: { value: 6, unit: "weeks", label: "Spreadsheets to production SaaS" },
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
    question: "What is GEO (Generative Engine Optimisation) and why does it matter?",
    answer:
      "GEO is the practice of optimising your web presence so AI answer engines like ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews can find, trust, and cite your business when buyers ask them for recommendations. Search is shifting from a list of links to a single AI generated answer, and if your site is not structured for machines to read and quote, you are invisible in that answer. We engineer the structured data, the llms.txt knowledge file, the answer shaped content, and the authority signals that get a brand cited, then we track your AI share of voice over time. It is a service we offer, and we run our own site the same way.",
  },
  {
    question: "What if our data is a mess? Will it still work?",
    answer:
      "Almost always, yes, and messy data is the normal starting point, not the exception. Most engagements begin with data spread across spreadsheets, several systems, and inconsistent formats. We start with a short data audit, build a cleaning and normalisation layer into the pipeline, and design for the edge cases your real data actually contains rather than a tidy demo. You do not need to clean everything up before we start. That is part of the work.",
  },
  {
    question: "How do you handle our data and security?",
    answer:
      "We take a minimal-data approach: we only access the systems and records needed to build what you have commissioned. For UK clients we operate within GDPR constraints and can sign a data processing agreement. When we use third-party AI models such as Claude or GPT, we opt out of training data usage via API agreements with Anthropic and OpenAI. Sensitive data is handled in-region where your infrastructure allows, and we document every data flow in the handover pack.",
  },
  {
    question: "What exactly do we own at the end?",
    answer:
      "Everything. The source code in your repository, the infrastructure configuration, the prompts, the runbooks, and the monitoring. We write code for the team that inherits it, documented so any competent engineer can maintain it. There is no proprietary black box and no licence you keep paying us for. If you ever want to take it fully in house, you can.",
  },
  {
    question: "How does this compare to hiring in-house?",
    answer:
      "Hiring a senior AI or automation engineer in the UK typically takes 90 to 120 days, costs a six-figure salary before recruitment fees and overhead, and most teams need two or three hires before they ship anything to production. We start in 2 to 4 weeks, put working software in front of you in the first week or two, and hand you a complete system for a fixed price. Many clients use us to ship the first build while they hire alongside, so they are not blocked waiting for headcount. If hiring really is the right move for your situation, we will tell you.",
  },
  {
    question: "We already use Zapier, Make, or n8n. Why would we need you?",
    answer:
      "Those tools are excellent and we use them too. We are who you call when you hit their ceiling: conditional logic they cannot express, stateful multi step processes, AI decisioning, large or messy datasets, or integrations with systems that have no clean API. If a no code tool is genuinely the right answer, we will say so rather than over engineer it. When it is not, we build the durable version that does not break the moment your process gets complicated.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects run 2 to 8 weeks from kickoff to production. A focused automation pipeline or AI agent is typically live in 2 to 3 weeks. A full-stack product with authentication, multiple roles, and third-party integrations usually runs 6 to 8 weeks. We scope tightly and ship in increments, so you see working software in the first week.",
  },
  {
    question: "How much does an AI automation project cost?",
    answer:
      "Projects are fixed price, typically ranging from £5,000 for a focused automation pipeline to £50,000 for a full-stack product with multiple AI agents and integrations. The exact figure depends on scope, not time. Every engagement starts with a scoping call and a written proposal that locks in deliverables, timeline, and total cost before any work begins. The price in your proposal is the price you pay. There are no hourly overruns and no scope creep invoices.",
  },
  {
    question: "How do you price your work?",
    answer:
      "Fixed price for defined scope. You receive a detailed proposal with deliverables, timeline, and total cost before any work begins. For ongoing work we offer monthly retainers priced by the level of support you need. We do not bill by the hour because it rewards slow work.",
  },
  {
    question: "Can you integrate with the tools we already use?",
    answer:
      "Almost always, yes. We have connected Salesforce, HubSpot, Stripe, Xero, Google Workspace, Slack, and Airtable, among others. Beyond those, if a tool has an API we can connect it, and that includes Microsoft 365 and Teams, Outlook, Pipedrive, Sage, QuickBooks, NetSuite, Zendesk, Intercom, GoCardless, and DocuSign. If a system has no clean API, we have built scrapers, email parsers, and lightweight adapters to bridge the gap, including for sector specific platforms in insurance, recruitment, and legal. The goal is to amplify the stack you already run, not replace it.",
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
    question: "What is an AI engineering studio?",
    answer:
      "An AI engineering studio is a specialist consultancy that designs, builds, and ships production AI systems rather than advising on strategy alone. We write the code, deploy the pipelines, and hand you working software. The studio model means you get senior engineers on every engagement, not a team of consultants backed by offshore delivery. We own the outcome, not just the recommendation.",
  },
];
