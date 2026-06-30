// Exa web search client. Raw fetch — no SDK.
// Docs: https://docs.exa.ai — endpoint POST /search, header x-api-key.

import { hasExa, SKIPPED_NO_CREDENTIALS } from "./env";

const EXA_BASE = "https://api.exa.ai";

export type ExaResult = {
  name: string;
  url: string;
  description: string;
  raw: unknown;
};

type ExaSearchResponse = {
  results: Array<{
    title: string;
    url: string;
    summary?: string;
    text?: string;
    [key: string]: unknown;
  }>;
};

async function exaFetch(path: string, body: unknown): Promise<ExaSearchResponse> {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) throw new Error("EXA_API_KEY not set");
  const res = await fetch(`${EXA_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Exa ${path} ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json() as Promise<ExaSearchResponse>;
}

function normalizeResults(raw: ExaSearchResponse): ExaResult[] {
  return (raw.results ?? []).map((r) => ({
    name: r.title ?? "",
    url: r.url ?? "",
    description: r.summary ?? r.text ?? "",
    raw: r,
  }));
}

/**
 * Search for companies matching the query.
 * Returns skipped result when EXA_API_KEY is absent — never throws.
 */
export async function searchCompanies(opts: {
  query: string;
  numResults?: number;
}): Promise<{ skipped?: string; results: ExaResult[] }> {
  if (!hasExa()) return { skipped: SKIPPED_NO_CREDENTIALS, results: [] };
  const data = await exaFetch("/search", {
    query: opts.query,
    numResults: opts.numResults ?? 10,
    type: "auto",
    contents: {
      text: { maxCharacters: 500 },
      summary: {},
    },
  });
  return { results: normalizeResults(data) };
}

/**
 * Search for people matching the query.
 * Returns skipped result when EXA_API_KEY is absent — never throws.
 */
export async function searchPeople(opts: {
  query: string;
  numResults?: number;
}): Promise<{ skipped?: string; results: ExaResult[] }> {
  if (!hasExa()) return { skipped: SKIPPED_NO_CREDENTIALS, results: [] };
  const data = await exaFetch("/search", {
    query: opts.query,
    numResults: opts.numResults ?? 10,
    type: "auto",
    contents: {
      text: { maxCharacters: 500 },
      summary: {},
    },
  });
  return { results: normalizeResults(data) };
}
