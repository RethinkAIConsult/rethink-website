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
      "We connect your tools, data, and AI models into pipelines that run themselves. From 47 manual steps to a single trigger.",
    details:
      "Whether it's ingesting data from ten different sources, enriching records with AI, or pushing results to your CRM — we build event-driven pipelines that execute reliably without human babysitting. Every pipeline is idempotent, observable, and built to recover gracefully from failures.",
    deliverables: [
      "End-to-end pipeline architecture and implementation",
      "Event-driven orchestration with Inngest or n8n",
      "Automated error handling and retry logic",
      "Monitoring dashboards and alerting",
    ],
    icon: Workflow,
    techBadges: ["n8n", "Inngest", "PostgreSQL", "APIs"],
  },
  {
    title: "Custom AI Agents",
    description:
      "Not chatbots — agents that do real work. Research, decide, act, learn. Built on Claude, GPT, and open-source models.",
    details:
      "We design autonomous agents that handle complex, multi-step tasks your team currently does manually. From data research and lead qualification to document analysis and decision support — these agents integrate with your existing tools and operate within guardrails you define.",
    deliverables: [
      "Agent architecture with tool use and memory",
      "Integration with your existing data sources and APIs",
      "Safety guardrails and human-in-the-loop checkpoints",
      "Evaluation framework to measure agent accuracy",
    ],
    icon: Bot,
    techBadges: ["Claude", "GPT", "LangChain", "TypeScript"],
  },
  {
    title: "Full-Stack Web Apps",
    description:
      "Production-grade platforms on Next.js, React, and PostgreSQL. SaaS, internal tools, client portals. Code, not prototypes.",
    details:
      "We build complete web applications from database schema to deployed product. Our stack is opinionated for speed and reliability: Next.js with TypeScript for the frontend, PostgreSQL for data, and Vercel for deployment. Every app ships with authentication, proper error handling, and a clean codebase your team can maintain.",
    deliverables: [
      "Full-stack Next.js application with TypeScript",
      "PostgreSQL database design and migrations",
      "Authentication and role-based access control",
      "Deployment pipeline with CI/CD",
    ],
    icon: Code,
    techBadges: ["Next.js", "React", "TypeScript", "PostgreSQL"],
  },
  {
    title: "Consulting & Audit",
    description:
      "Not sure where to start? We audit your operations and deliver a prioritised automation roadmap. Find out where AI fits before you spend a pound building.",
    details:
      "Before writing a single line of code, we map your current workflows, identify bottlenecks, and score each process for automation potential. You get a prioritised roadmap ranked by ROI, with realistic timelines and clear build-vs-buy recommendations. No vendor lock-in, no fluff.",
    deliverables: [
      "Process mapping and bottleneck analysis",
      "Automation opportunity scoring and ROI estimates",
      "Prioritised implementation roadmap",
      "Technology recommendations with trade-off analysis",
    ],
    icon: Search,
    techBadges: ["Strategy", "Process Design", "ROI Analysis"],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "London Walking Paws",
    subtitle: "From spreadsheets to a full SaaS platform",
    description:
      "A pet care business running entirely on spreadsheets and WhatsApp needed a proper system. We built a complete SaaS platform handling booking management, automated scheduling, client portals, invoicing, and payment processing — replacing hours of daily admin work.",
    tags: ["Next.js", "SaaS", "PostgreSQL", "Clerk"],
    results: [
      "Automated booking and scheduling workflow",
      "Client self-service portal with real-time updates",
      "Invoicing system with Stripe payment links",
      "Admin dashboard with business analytics",
    ],
  },
  {
    title: "Prop-Intel",
    subtitle: "10,000+ properties processed with zero manual intervention",
    description:
      "A property intelligence pipeline that ingests raw property data, enriches it with AI-powered analysis, scores investment potential, and delivers actionable insights. The entire pipeline runs autonomously via event-driven functions — no human touches the data between input and output.",
    tags: ["AI", "Inngest", "Data Pipeline", "PostgreSQL"],
    results: [
      "Fully automated enrichment and scoring pipeline",
      "AI-powered signal extraction with 89.5% recall",
      "Event-driven architecture for reliable processing",
      "Real-time dashboard for property insights",
    ],
  },
  {
    title: "TimeFlow",
    subtitle: "Built to scratch our own itch",
    description:
      "A desktop time tracking application built with Tauri and React — native performance with web technologies. We built it because existing tools were either too complex or too limited. The lessons learned in cross-platform development and offline-first architecture inform every project we take on.",
    tags: ["Tauri", "React", "Desktop", "TypeScript"],
    results: [
      "Cross-platform desktop app (macOS, Windows, Linux)",
      "Offline-first with automatic sync",
      "Sub-100ms UI response times",
      "Lessons applied to every client project",
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What kind of businesses do you work with?",
    answer:
      "We primarily work with SMBs and scale-ups — companies that have grown past the point where spreadsheets and manual processes can keep up, but don't have the in-house engineering team to build automation. Our clients are typically doing between £500K and £20M in revenue, with teams of 5-100 people. If your team is spending more than a few hours a week on work that follows a repeatable pattern, we can probably help.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most projects land between 2 and 8 weeks from kickoff to production. A focused automation pipeline or AI agent might be live in 2-3 weeks. A full SaaS application with authentication, multiple user roles, and integrations typically takes 6-8 weeks. We scope tightly and deliver incrementally — you'll see working software within the first week, not after months of planning.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer:
      "Yes. After launch, we offer monthly retainer arrangements that cover monitoring, bug fixes, small feature additions, and keeping dependencies up to date. Most clients start with a build engagement and transition to a maintenance retainer. We also offer ad-hoc support if you'd rather call us when something needs attention.",
  },
  {
    question: "What's your tech stack?",
    answer:
      "Our core stack is Next.js (React 19) with TypeScript on the frontend, PostgreSQL for data, and Vercel for deployment. For automation, we use Inngest for event-driven pipelines and n8n for workflow orchestration. For AI, we primarily build with Claude (Anthropic) and GPT (OpenAI), with LangChain for complex agent architectures. Everything is TypeScript end-to-end — no Python scripts held together with tape.",
  },
  {
    question: "How do you price projects?",
    answer:
      "We use fixed-price engagements for defined scope. You'll get a detailed proposal with deliverables, timeline, and cost before any work begins. For ongoing work, we offer monthly retainers priced by the level of support you need. We don't do hourly billing — it incentivises the wrong things. Our goal is to deliver value, not accumulate hours.",
  },
  {
    question: "Can you work with our existing tools?",
    answer:
      "Absolutely — integration is one of our core strengths. We've connected systems including Salesforce, HubSpot, Stripe, Xero, Google Workspace, Slack, Airtable, and dozens of niche industry tools. If it has an API, we can connect it. If it doesn't, we've built scrapers and email parsers to bridge the gap. The goal is always to work with what you have, not rip and replace.",
  },
];
