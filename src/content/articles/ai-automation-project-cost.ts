import type { Article } from "@/types";

const article: Article = {
  slug: "ai-automation-project-cost",
  title: "What does an AI automation project actually cost?",
  description:
    "AI automation projects with RethinkAI are fixed price, typically £5,000 to £50,000. Here is what sits at each end of the range and what actually drives the number.",
  dek: "Fixed price, set by scope rather than hours. Here is what to expect at each end of the range and the factors that move the number.",
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  readMinutes: 5,
  sections: [
    {
      heading: "The short answer",
      body: [
        "AI automation projects with us are fixed price, typically £5,000 to £50,000. The figure is set by scope, not by the number of hours we spend. You receive a written proposal before any work begins, and the price in that proposal is the price you pay.",
        "If you want a rough orientation before speaking to us: a focused automation pipeline or a single AI agent sits toward the lower end of that range and is usually live within 2 to 3 weeks. A full-stack product with multiple AI agents, authentication, and several third-party integrations sits toward the upper end and typically takes 6 to 8 weeks.",
      ],
    },
    {
      heading: "What sits at each end of the range",
      body: [
        "The range is wide because the problems we solve vary considerably. Here is how to orient yourself.",
      ],
      bullets: [
        "Lower end, from £5,000: a focused automation pipeline (for example, CRM enrichment, weekly report generation, or a document processing workflow) or a single AI agent. Live in 2 to 3 weeks.",
        "Middle of the range: a multi-stage pipeline with several integrations, or an AI agent with a supporting data layer, a light admin interface, and an evaluation framework.",
        "Upper end, up to £50,000: a full-stack product with authentication, multiple user roles, several AI agents, and integrations with three or more external systems. Typically 6 to 8 weeks end to end.",
        "Ongoing work after launch: a monthly retainer covering monitoring, iteration, and support.",
      ],
    },
    {
      heading: "What actually drives the price",
      body: [
        "Within any band, scope is the variable. Time is not. Two projects at the same price point can take different amounts of our time depending on the complexity involved. That is our estimating risk to carry, not yours.",
        "The factors that push a project toward the upper end of the range are:",
      ],
      bullets: [
        "Number and complexity of integrations: a system with a clean API is faster to connect than one with no public API, inconsistent data formats, or rate limits that require careful throttling.",
        "Data quality: messy, duplicated, or inconsistently formatted data requires a cleaning and normalisation layer before anything useful can be built on top of it.",
        "Number of AI agents and decision points: a single agent with a narrow job is simpler than a network of agents that hand off to each other across multiple stages.",
        "Product surface area: a pipeline with no user interface is simpler than a product with a client portal, admin dashboard, and role-based access control.",
        "Depth of guardrails and evaluation: a production AI system needs an accuracy benchmark, human-in-the-loop checkpoints, and ongoing monitoring. Projects where accuracy matters carry more evaluation work.",
      ],
    },
    {
      heading: "Why fixed price, not hourly",
      body: [
        "Hourly billing rewards slow work and shifts the estimating risk onto you. If a project takes longer than expected, you pay more. If the scope grows, you pay more. You end up managing our time rather than trusting the outcome.",
        "Fixed price inverts that. We carry the estimating risk. If something takes longer than we scoped, that is our problem to absorb, not yours to fund. You get a number you can put in a budget, plan around, and hold us to.",
        "The constraint that makes this work is tight scoping. We spend time at the start defining exactly what will be built, what is out of scope, and what done looks like. That conversation happens before we write a line of code, and the output is a written proposal rather than a verbal agreement.",
      ],
    },
    {
      heading: "What the proposal locks in",
      body: [
        "Every engagement starts with a scoping call. We use that call to understand what you need, where the complexity actually sits, and whether there is a simpler approach that gets you the same result faster.",
        "After the call we produce a written proposal covering deliverables, timeline, and total cost. Nothing starts until you have reviewed and approved that document. There are no surprises in the invoice because everything is defined before work begins.",
        "If your needs change significantly mid-project, we discuss scope adjustments explicitly rather than letting them silently inflate the bill. Most projects stay within the original scope because we scope carefully upfront.",
      ],
    },
    {
      heading: "Ongoing costs",
      body: [
        "Once a project is live, there are two categories of ongoing cost to be aware of.",
        "The first is a monthly retainer if you want us to continue supporting and iterating on what we built. This covers monitoring, dependency updates, bug fixes, and small additions. Most clients move onto a retainer after their initial build engagement. The retainer is optional: if you prefer to bring things fully in-house or reach out on an ad-hoc basis, that is fine.",
        "The second is third-party model API costs for the AI components. These are billed directly to you by the provider (Anthropic, OpenAI, or similar) based on actual usage. We have no mark-up on these. In practice, model API costs are modest relative to the value of the work they replace, and we build in cost tracking so you can see exactly what the AI layer is spending per run.",
      ],
    },
  ],
  faqs: [
    {
      question: "How much does an AI automation project cost?",
      answer:
        "Projects are fixed price, typically £5,000 for a focused automation pipeline to £50,000 for a full-stack product with multiple AI agents and integrations. The exact figure depends on scope, not time. Every engagement starts with a scoping call and a written proposal that locks in deliverables, timeline, and total cost before any work begins.",
    },
    {
      question: "How do you price your work?",
      answer:
        "Fixed price for defined scope. We produce a detailed proposal with deliverables, timeline, and total cost before any work begins. The price in the proposal is the price you pay: no hourly overruns, no scope-creep invoices. We price this way because hourly billing rewards slow work and shifts the estimating risk onto you. Fixed price inverts that.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "Most projects run 2 to 8 weeks from kickoff to production. A focused automation pipeline or single AI agent is typically live in 2 to 3 weeks. A full-stack product with authentication, multiple roles, and third-party integrations usually runs 6 to 8 weeks. We scope tightly and ship in increments, so you see working software in the first week.",
    },
    {
      question: "Are there costs beyond the project price?",
      answer:
        "Two to be aware of. First, a monthly retainer if you want ongoing support and iteration after launch (optional). Second, third-party model API costs (Anthropic, OpenAI) billed directly to you by the provider based on actual usage. We have no mark-up on these, and we build cost tracking into every AI system so you can see exactly what the AI layer is spending.",
    },
  ],
  related: [
    { label: "Book a call", href: "/#contact" },
    { label: "What we build", href: "/services" },
  ],
};

export default article;
