import type { MetadataRoute } from "next";

const BASE_URL = "https://rethinkaiconsult.com";

// Paths that should never be indexed (API, auth, the gated internal tool).
const DISALLOW = ["/api/", "/sign-in", "/sign-up", "/outbound"];

// AI answer-engine crawlers, explicitly allowed for Generative Engine Optimisation.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
];

// Standard search crawlers.
const SEARCH_BOTS = ["Googlebot", "Applebot", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // ByteDance's aggressive crawler: no citation traffic, block explicitly.
      { userAgent: "Bytespider", disallow: "/" },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
      ...SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
