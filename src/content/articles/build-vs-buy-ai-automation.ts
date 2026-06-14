import type { Article } from "@/types";

const article: Article = {
  slug: "build-vs-buy-ai-automation",
  title: "Build vs buy: should you build AI automation in-house or hire a studio?",
  description:
    "Weighing up build vs buy for AI automation? Here is what the real costs look like, when hiring in-house makes sense, and when a studio gets you there faster.",
  dek: "Most teams that have outgrown manual work but have no in-house AI team are better served buying the first build. Here is how to think through the decision honestly.",
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  readMinutes: 5,
  sections: [
    {
      heading: "The short answer",
      body: [
        "Hire a studio when you need a specific outcome shipped soon and do not have senior AI engineers on staff. Build in-house when AI is becoming a core, ongoing capability and you can attract and retain that talent over time.",
        "The nuance is that most teams asking this question are somewhere in the middle. They have outgrown manual processes, they know automation is the answer, but they have no AI engineers on the payroll yet. For those teams, buying the first build almost always gets results faster and at lower total cost than waiting to hire.",
        "That said, this is not a binary choice. The option that tends to work best is doing both: shipping with a studio while you hire alongside, so you are not blocked on headcount.",
      ],
    },
    {
      heading: "The real cost of hiring in-house",
      body: [
        "Hiring a senior AI or automation engineer in the UK typically takes 90 to 120 days from opening a role to start date. That window is longer than most teams expect, and the clock starts from the moment you decide to hire, not the moment you get budget approval.",
        "The salary is six figures before recruitment fees and overhead. Add a recruiter's percentage, employer National Insurance, pension contributions, equipment, and the time your existing team spends on interviews, and the first-year cost of a single hire is meaningfully higher than the headline salary suggests.",
        "Most teams also need two or three hires before they ship anything to production. The first hire is often more generalist than the role demands. The second brings the depth the first lacked. By the third, you have a functioning unit. That timeline can stretch to a year or more before the automation you needed is actually running.",
        "There is also the management overhead of standing up a new function: onboarding, tooling decisions, process design, and the ramp time before the team is self-sufficient. None of that is free.",
      ],
    },
    {
      heading: "The case for a studio",
      body: [
        "A studio compresses the timeline dramatically. Rather than waiting on a hiring process, you are working with senior engineers from week one.",
      ],
      bullets: [
        "Live in weeks, not months. You work with senior engineers from week one, with working software in front of you within the first week or two.",
        "Fixed price for defined scope. Projects run from GBP 5,000 to GBP 50,000 depending on complexity, with the price locked before work begins.",
        "Senior engineers on every engagement. No delivery team hidden behind a principal consultant.",
        "You own everything on day one. The source code, the infrastructure configuration, the prompts, and the runbooks transfer to you at handover. There is no proprietary black box and no licence you keep paying for.",
        "Projects run 2 to 8 weeks. A focused pipeline or agent is typically live in 2 to 3 weeks. A full-stack product with multiple integrations runs 6 to 8 weeks.",
      ],
    },
    {
      heading: "When building in-house is the right call",
      body: [
        "We want to be honest here: there are situations where building in-house is genuinely the right decision.",
        "If AI automation is becoming a core, ongoing capability rather than a defined project, you need permanent engineers who understand your domain deeply and can evolve the system continuously. A studio is well suited to shipping a bounded scope. It is less suited to being a permanent engineering department.",
        "If the work is core IP that you must own end to end, with competitive advantage baked into the model or the data, then the team building it probably needs to sit inside your company.",
        "And if you can attract and retain senior AI talent at a reasonable cost for your business, the long-term economics of in-house are strong. The question is always whether the hiring timeline aligns with when you actually need the outcome.",
      ],
    },
    {
      heading: "The hybrid that usually wins",
      body: [
        "The pattern we see work most consistently is shipping the first build with a studio while hiring alongside. You are not blocked waiting on headcount. You have working software in production generating real value while the hiring process runs in parallel.",
        "When your first in-house hire joins, they inherit a production system with documentation, runbooks, and clean code rather than a backlog of requirements and no system to learn from. The handover is a genuine accelerant rather than a handover of risk.",
        "This is an outcome we actively design for. The studio engagement ends, your in-house team takes over a running system, and the handover is built into how we work from the start rather than bolted on at the end.",
      ],
    },
    {
      heading: "Where no-code fits, and when you outgrow it",
      body: [
        "Zapier, Make, and n8n are excellent tools and we use them too. For simple, linear workflows with well-behaved APIs and predictable data, they are often the fastest and most cost-effective answer. We will say so rather than over-engineer it.",
        "We are who you call when you hit their ceiling. That ceiling tends to appear at a few specific points: conditional logic that the tool cannot express cleanly, stateful multi-step processes that need to remember what happened earlier in the run, AI decisioning where the next step depends on what a language model decides, large or messy datasets that overwhelm the tool's capacity, and systems with no clean API that require a proper adapter layer.",
        "When the no-code tool is genuinely the right answer, it stays the answer. When it is not, we build the durable version that does not break the moment your process gets complicated.",
      ],
    },
  ],
  faqs: [
    {
      question: "How does this compare to hiring in-house?",
      answer:
        "Hiring a senior AI or automation engineer in the UK typically takes 90 to 120 days, costs a six-figure salary before recruitment fees and overhead, and most teams need two or three hires before they ship anything to production. We start in 2 to 4 weeks, put working software in front of you in the first week or two, and hand you a complete system for a fixed price. Many clients use us to ship the first build while they hire alongside, so they are not blocked waiting on headcount. If hiring really is the right move for your situation, we will tell you.",
    },
    {
      question: "We already use Zapier, Make, or n8n. Why would we need you?",
      answer:
        "Those tools are excellent and we use them too. We are who you call when you hit their ceiling: conditional logic they cannot express, stateful multi-step processes, AI decisioning, large or messy datasets, or integrations with systems that have no clean API. If a no-code tool is genuinely the right answer, we will say so rather than over-engineer it. When it is not, we build the durable version that does not break the moment your process gets complicated.",
    },
    {
      question: "What exactly do we own at the end?",
      answer:
        "Everything. The source code in your repository, the infrastructure configuration, the prompts, the runbooks, and the monitoring. We write code for the team that inherits it, documented so any competent engineer can maintain it. There is no proprietary black box and no licence you keep paying us for. If you ever want to take it fully in-house, you can.",
    },
    {
      question: "Do you offer ongoing maintenance and support?",
      answer:
        "Yes. After launch we offer a monthly retainer covering monitoring, dependency updates, bug fixes, and small feature additions. Most clients move from a build engagement onto a retainer. We also offer ad-hoc support if you prefer to reach out when something needs attention rather than commit to a recurring arrangement.",
    },
  ],
  related: [
    { label: "What we build", href: "/services" },
    { label: "Selected work", href: "/work" },
    { label: "Book a call", href: "/#contact" },
  ],
};

export default article;
