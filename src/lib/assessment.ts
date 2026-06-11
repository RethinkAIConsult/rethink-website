import Anthropic from "@anthropic-ai/sdk";
import dns from "node:dns/promises";
import * as ipaddr from "ipaddr.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6";

export type AssessmentFinding = {
  category: "SEO" | "Clarity" | "Performance" | "Trust";
  severity: "high" | "medium" | "low";
  finding: string;
  recommendation: string;
};

export type AutomationOpportunity = {
  title: string;
  description: string;
  estimatedImpact: "high" | "medium" | "low";
};

export type AssessmentReport = {
  url: string;
  score: number;
  summary: string;
  findings: AssessmentFinding[];
  opportunities: AutomationOpportunity[];
  signals: PageSignals;
};

export type PageSignals = {
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  hasViewportMeta: boolean;
  isHttps: boolean;
  hasJsonLd: boolean;
  hasOgTags: boolean;
  roughWeightKb: number;
  excerpt: string;
};

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const FETCH_TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 500_000;
const MAX_REDIRECTS = 3;

// Only globally routable unicast addresses are allowed. Everything else is
// rejected: loopback, link-local (incl. the 169.254.169.254 cloud metadata
// endpoint), private, unique-local, reserved, multicast, and ipv4-mapped ipv6.
function isPublicIp(ip: string): boolean {
  let addr: ipaddr.IPv4 | ipaddr.IPv6;
  try {
    addr = ipaddr.parse(ip);
  } catch {
    return false;
  }
  if (addr.kind() === "ipv6") {
    const v6 = addr as ipaddr.IPv6;
    if (v6.isIPv4MappedAddress()) {
      addr = v6.toIPv4Address();
    }
  }
  return addr.range() === "unicast";
}

// A hostname is safe only if every address it resolves to is public.
async function hostnameResolvesPublic(hostname: string): Promise<boolean> {
  if (ipaddr.isValid(hostname)) {
    return isPublicIp(hostname);
  }
  try {
    const records = await dns.lookup(hostname, { all: true });
    return records.length > 0 && records.every((r) => isPublicIp(r.address));
  } catch {
    return false;
  }
}

async function validateUrl(
  raw: string,
): Promise<{ ok: true; url: URL } | { ok: false; reason: string }> {
  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return { ok: false, reason: "Invalid URL format." };
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    return { ok: false, reason: "Only http and https URLs are accepted." };
  }

  // Strip IPv6 brackets before resolving.
  const hostname = url.hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
  if (!hostname || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    return { ok: false, reason: "Private or reserved hostnames are not allowed." };
  }

  if (!(await hostnameResolvesPublic(hostname))) {
    return {
      ok: false,
      reason: "That host resolves to a private or reserved address and cannot be assessed.",
    };
  }

  return { ok: true, url };
}

// Fetch with manual redirect handling: every hop is re-validated before it is
// followed, so a public URL cannot redirect into a private or reserved one.
async function safeFetch(startUrl: URL, signal: AbortSignal): Promise<Response> {
  let current = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(current.toString(), {
      signal,
      headers: { "User-Agent": "RethinkAI-Assessor/1.0 (+https://rethinkaiconsult.com)" },
      redirect: "manual",
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return res;
      const next = new URL(location, current);
      const check = await validateUrl(next.toString());
      if (!check.ok) throw new Error(`Redirect blocked: ${check.reason}`);
      current = check.url;
      continue;
    }

    return res;
  }
  throw new Error("Too many redirects.");
}

export async function fetchPageSignals(rawUrl: string): Promise<{ signals: PageSignals; url: URL }> {
  const check = await validateUrl(rawUrl);
  if (!check.ok) throw new Error(check.reason);
  const { url } = check;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let html: string;
  let roughWeightKb = 0;

  try {
    const res = await safeFetch(url, controller.signal);

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      throw new Error("URL does not return an HTML page.");
    }

    const buf = await res.arrayBuffer();
    roughWeightKb = Math.round(buf.byteLength / 1024);

    const slicedBuf = buf.byteLength > MAX_BODY_BYTES ? buf.slice(0, MAX_BODY_BYTES) : buf;
    html = new TextDecoder("utf-8", { fatal: false }).decode(slicedBuf);
  } finally {
    clearTimeout(timer);
  }

  const signals = extractSignals(html, url.protocol === "https:", roughWeightKb);
  return { signals, url };
}

function extractSignals(html: string, isHttps: boolean, roughWeightKb: number): PageSignals {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]).trim().slice(0, 200) || null : null;

  const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,500})["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']{0,500})["'][^>]+name=["']description["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() || null : null;

  const h1Matches = html.match(/<h1[\s>]/gi);
  const h1Count = h1Matches ? h1Matches.length : 0;

  const hasViewportMeta = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasJsonLd = html.includes('"application/ld+json"') || html.includes("application/ld+json");
  const hasOgTags = /<meta[^>]+property=["']og:/i.test(html);

  // Pull a short text excerpt for Claude context
  const bodyMatch = html.match(/<body[\s\S]*?>([\s\S]{0,6000})/i);
  const rawBodyText = bodyMatch ? stripTags(bodyMatch[1]).replace(/\s+/g, " ").trim() : "";
  const excerpt = rawBodyText.slice(0, 1200);

  return {
    title,
    metaDescription,
    h1Count,
    hasViewportMeta,
    isHttps,
    hasJsonLd,
    hasOgTags,
    roughWeightKb,
    excerpt,
  };
}

function stripTags(str: string): string {
  return str.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#\d+;/g, "");
}

const ASSESSMENT_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    score: {
      type: "number",
      description: "Overall website score 0 to 100.",
    },
    summary: {
      type: "string",
      description: "Two to three sentence executive summary of the site assessment.",
    },
    findings: {
      type: "array",
      description: "Three to five specific findings covering SEO, clarity, performance, and trust.",
      items: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["SEO", "Clarity", "Performance", "Trust"] },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          finding: { type: "string", description: "What the issue is, one to two sentences." },
          recommendation: { type: "string", description: "Specific action to fix it." },
        },
        required: ["category", "severity", "finding", "recommendation"],
      },
    },
    opportunities: {
      type: "array",
      description: "Exactly two to three concrete AI automation opportunities relevant to this business.",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string", description: "Two to three sentences on what to automate and the expected impact." },
          estimatedImpact: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["title", "description", "estimatedImpact"],
      },
    },
  },
  required: ["score", "summary", "findings", "opportunities"],
};

export async function runAssessment(
  signals: PageSignals,
  url: URL,
): Promise<Omit<AssessmentReport, "url">> {
  const systemPrompt = `You are a senior AI engineering consultant at RethinkAI Consult reviewing a website on behalf of a prospective client. Your assessment is direct, specific, and actionable. You never use em-dashes or double hyphens as dashes. You use "we" and "our" when referring to RethinkAI.

Score the site 0 to 100 based on:
- SEO foundations (title, meta, h1, structured data, OG tags)
- Messaging clarity (does the excerpt communicate a clear value proposition)
- Performance signals (page weight, viewport meta)
- Trust signals (https, structured data, completeness)

For automation opportunities: look at what this business does from the page content and identify specific, realistic AI or workflow automation wins. Be concrete, not generic. Do not invent data. Do not use em-dashes. Use commas, periods, or parentheses instead.`;

  const userMessage = `Website: ${url.toString()}

Signals extracted:
- Title: ${signals.title ?? "(missing)"}
- Meta description: ${signals.metaDescription ?? "(missing)"}
- H1 count: ${signals.h1Count}
- Has viewport meta: ${signals.hasViewportMeta}
- HTTPS: ${signals.isHttps}
- Has JSON-LD structured data: ${signals.hasJsonLd}
- Has OG tags: ${signals.hasOgTags}
- Rough page weight: ${signals.roughWeightKb} KB

Page content excerpt:
${signals.excerpt || "(no text content extracted)"}

Produce the assessment now.`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    tools: [
      {
        name: "submit_assessment",
        description: "Submit the structured website assessment report",
        input_schema: ASSESSMENT_TOOL_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: "submit_assessment" },
  });

  const toolUse = res.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a structured assessment.");
  }

  const data = toolUse.input as {
    score: number;
    summary: string;
    findings: AssessmentFinding[];
    opportunities: AutomationOpportunity[];
  };

  return {
    score: Math.max(0, Math.min(100, Math.round(data.score))),
    summary: data.summary,
    findings: data.findings,
    opportunities: data.opportunities,
    signals,
  };
}
