import type { Article } from "@/types";

const article: Article = {
  slug: "what-is-geo",
  title: "What is Generative Engine Optimisation (GEO)?",
  description:
    "A plain-language explainer on GEO: what it is, how AI answer engines decide who to cite, and the levers that make a site citable.",
  dek: "AI answer engines are replacing the search results page for millions of queries. GEO is the discipline of engineering your web presence so those engines find, trust, and cite your business inside the answers they generate.",
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  readMinutes: 6,
  sections: [
    {
      heading: "What GEO actually is",
      body: [
        "Generative Engine Optimisation (GEO) is the practice of engineering your web presence so that AI answer engines can find, trust, and cite your business when buyers ask them for recommendations. The engines this covers include ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews, and Microsoft Copilot.",
        "GEO is the successor to SEO, but the competitive dynamic is different. SEO competes for a position in a ranked list of links. GEO competes to be the cited source inside a single generated answer, a much narrower slot where only a handful of businesses appear at all. A buyer who reads an AI answer and acts on it may never see a traditional search results page, so the rank you hold on Google is irrelevant to that moment.",
        "The two disciplines share foundations: both care about crawlability, structured content, and a site that is technically sound. GEO adds a layer on top focused on machine readability, entity authority, and the specific signals that give a language model confidence in your business as a trustworthy source worth quoting.",
      ],
    },
    {
      heading: "How AI answer engines choose who to cite",
      body: [
        "There are two paths by which a business ends up cited in an AI-generated answer. The first is live retrieval: when a user submits a query, the engine searches a real index and synthesises an answer with citations drawn from the freshest results it finds. ChatGPT and Microsoft Copilot draw primarily from Bing, Google AI Overviews and Gemini from Google Search, and Perplexity from its own crawler. Live retrieval is the primary mechanism for most cited answers today, and it is the faster lever to pull.",
        "The second path is trained-in knowledge: information baked into the model during its training run. This knowledge is slow to change, updates only at the next training cut, and reflects broad presence across a wide range of sources on the web rather than any specific optimisation. A business that is well-covered by independent third-party sources will benefit from trained-in knowledge over time, but it is not something you can engineer quickly.",
        "Because live retrieval dominates, the most effective GEO work focuses on making your site retrievable and citable in real time rather than waiting for model retraining cycles.",
      ],
    },
    {
      heading: "The levers that make a site citable",
      body: [
        "Six factors determine whether an AI engine can retrieve and cite a given page. They apply regardless of which engine you are targeting, because the underlying mechanics of retrieval and trust are broadly shared.",
      ],
      bullets: [
        "Retrievability: the page must be crawlable by AI bots, served as real HTML rather than JavaScript-only content, and present in the search indexes the engines draw from.",
        "Answer-shaped content: self-contained passages that answer one question up front, with definitions and comparisons, are what models lift and quote. Marketing copy that never directly answers a question is invisible to them.",
        "Atomic citable URLs: a page dedicated to a single topic is far more citable than a homepage covering ten. Each question, service, or concept deserves its own URL.",
        "Entity authority: structured data combined with corroboration across independent sources (company directories, professional profiles, named individuals) gives a model the confidence that your business is real and identifiable.",
        "Freshness: recently updated, clearly dated content is weighted more heavily than stale pages with no visible date signal.",
        "Honest signals: fabricated reviews, ratings, or testimonials are among the fastest routes to being filtered out. Genuine trust signals from real sources are the only kind that hold.",
      ],
    },
    {
      heading: "How you know it is working",
      body: [
        "Being indexed is not the same as being cited. The measurement question in GEO is share of voice: across the prompts your buyers are actually typing into these engines, how often does your business appear, and in what form?",
        "For brand queries and highly specific questions, citations can appear within a few weeks of getting indexed, assuming the site is well-structured and the content is answer-shaped. For competitive, non-brand queries, the timeline is longer. Authority is cumulative, and a site with limited off-site presence will take months to compete with established sources in a given topic area.",
        "The practical way to start measuring is to query the engines yourself. Ask ChatGPT, Perplexity, and Gemini about your own business, then about the category you operate in. That gives you a baseline for where you appear, how accurately you are described, and what sources the engines are trusting instead of you.",
        "Because AI answers vary between runs on the same query, a single snapshot is not reliable. Meaningful measurement means sampling across multiple engines, multiple runs of the same prompt, and tracking the trend over time rather than treating any one result as definitive.",
      ],
    },
    {
      heading: "Can you do it yourself, or should you hire",
      body: [
        "The on-page foundations of GEO are achievable in-house by a team that has already handled technical SEO. Serving real HTML, adding structured data, restructuring content to answer specific questions directly, and publishing an llms.txt knowledge file are all well within reach for a competent developer and a content lead working together.",
        "The harder work falls into two areas. The first is entity corroboration: building the off-site presence across independent sources that gives AI engines the confidence to cite you. This requires a coordinated effort across directories, professional profiles, and earned coverage that most in-house teams deprioritise because the payoff is not immediate. The second is measurement: tracking share of voice across multiple engines at scale, sampling enough to see a trend rather than noise. Both areas are where most teams find the effort-to-signal ratio too high to sustain without dedicated support.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is GEO (Generative Engine Optimisation) and why does it matter?",
      answer:
        "GEO is the practice of optimising your web presence so AI answer engines like ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews can find, trust, and cite your business when buyers ask them for recommendations. Search is shifting from a list of links to a single AI-generated answer, and if your site is not structured for machines to read and quote, you are invisible in that answer. GEO is the discipline of engineering the structured data, the answer-shaped content, and the authority signals that get a brand cited, then tracking your AI share of voice over time.",
    },
    {
      question: "How does GEO relate to traditional SEO?",
      answer:
        "SEO optimises for a rank in a list of links. GEO optimises to be the source an AI engine trusts and cites inside a single generated answer. The two share foundations like crawlability and structured content, but GEO adds entity authority, answer-shaped content, and machine-readable knowledge files so a language model can quote you directly. The competitive slot is also narrower: where a search results page lists many links, an AI answer cites only a handful of sources.",
    },
    {
      question: "Which AI engines should a GEO strategy target?",
      answer:
        "The engines that matter for most businesses are ChatGPT and ChatGPT Search, Claude, Perplexity, Google AI Overviews, Gemini, and Microsoft Copilot. Each retrieves and cites differently: ChatGPT and Copilot lean on Bing, Google AI Overviews and Gemini draw from Google Search, and Perplexity runs its own crawler. The core GEO signals are shared across all of them, though measurement needs to track each engine separately because citation patterns differ.",
    },
    {
      question: "How do you measure whether GEO is working?",
      answer:
        "The right metric is share of voice. You define the prompts your buyers are actually using and a competitor set, then query the major engines on a schedule and record how often you are mentioned, cited, and recommended, and in what position. Because AI answers vary between runs on the same query, a single snapshot is not reliable. Meaningful measurement means sampling across multiple engines and multiple runs, then tracking the trend over time rather than treating any one result as definitive.",
    },
  ],
  related: [
    { label: "Our GEO and AI visibility service", href: "/geo" },
    { label: "What we build", href: "/services" },
  ],
};

export default article;
