// Apollo API client. Requires Professional or Organization tier for API access.
// Docs: https://apolloapi.com/docs/

import { hasApollo, SKIPPED_NO_CREDENTIALS } from "./env";
import type { ContactEmailStatus } from "./types";

const APOLLO_BASE = "https://api.apollo.io/api/v1";

export type ApolloCompany = {
  id: string;
  name: string;
  website_url: string | null;
  primary_domain: string | null;
  industry: string | null;
  estimated_num_employees: number | null;
  annual_revenue: number | null;
  short_description: string | null;
  founded_year: number | null;
  city: string | null;
  country: string | null;
  latest_funding_round_date: string | null;
  latest_funding_stage: string | null;
  technology_names: string[] | null;
};

export type ApolloContact = {
  id: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  seniority: string | null;
  email: string | null;
  phone?: string | null;
  linkedin_url: string | null;
  organization?: { id: string; name: string };
};

export type EnrichedContact = {
  email: string | null;
  emailStatus: ContactEmailStatus;
  phone: string | null;
  raw: unknown;
};

const BUYER_TITLES = [
  "VP Operations",
  "Director of Operations",
  "Head of Operations",
  "VP Customer Success",
  "Head of Customer Success",
  "Head of Customer Delivery",
  "Head of Implementations",
  "VP Engineering",
  "Engineering Director",
  "Head of Engineering",
  "Director of Engineering",
  "Head of Programme",
  "Chief of Staff",
  "Head of Revenue Operations",
  "VP Revenue Operations",
];

async function apolloFetch(path: string, body: Record<string, unknown>) {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) throw new Error("APOLLO_API_KEY not set");
  // hasApollo() guards all public exports; this internal guard is belt-and-suspenders.

  const res = await fetch(`${APOLLO_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apollo ${path} ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

/**
 * Find an Apollo organization by name or domain. Returns the first match.
 */
export async function findCompany(input: { name: string; domain?: string | null }): Promise<ApolloCompany | null> {
  if (!hasApollo()) return null;
  const body: Record<string, unknown> = {
    q_organization_name: input.name,
    page: 1,
    per_page: 5,
  };
  if (input.domain) {
    body.q_organization_domains_list = [input.domain.replace(/^https?:\/\//, "").replace(/\/$/, "")];
  }
  const data = await apolloFetch("/mixed_companies/search", body);
  const orgs = (data?.organizations ?? []) as ApolloCompany[];
  return orgs[0] ?? null;
}

/**
 * Find decision-maker contacts at a given Apollo company id.
 * Filters to the buyer-title list defined in icp.md / playbook.md.
 */
export async function findBuyerContacts(opts: {
  organizationId: string;
  limit?: number;
}): Promise<ApolloContact[]> {
  if (!hasApollo()) return [];
  const body = {
    organization_ids: [opts.organizationId],
    person_titles: BUYER_TITLES,
    person_seniorities: ["c_suite", "vp", "director", "head"],
    page: 1,
    per_page: opts.limit ?? 5,
  };
  const data = await apolloFetch("/mixed_people/search", body);
  return (data?.people ?? []) as ApolloContact[];
}

/**
 * Convenience: find the single best buyer contact at a company by name.
 * Returns enriched org + contact in one call shape.
 */
export async function findCompanyAndBuyer(input: {
  name: string;
  domain?: string | null;
  contactName?: string | null;
}): Promise<{ company: ApolloCompany | null; contact: ApolloContact | null }> {
  if (!hasApollo()) return { company: null, contact: null };
  const company = await findCompany({ name: input.name, domain: input.domain });
  if (!company) return { company: null, contact: null };
  const contacts = await findBuyerContacts({ organizationId: company.id, limit: 5 });
  if (input.contactName) {
    const match = contacts.find((c) =>
      c.name?.toLowerCase().includes(input.contactName!.toLowerCase()),
    );
    if (match) return { company, contact: match };
  }
  return { company, contact: contacts[0] ?? null };
}

// Apollo email_status values -> our ContactEmailStatus enum.
function mapEmailStatus(apolloStatus: string | null | undefined): ContactEmailStatus {
  switch (apolloStatus) {
    case "verified":
      return "verified";
    case "likely to engage":
    case "unlocked":
      return "unlocked";
    case "guessed":
      return "guessed";
    case "unavailable":
    case "bounced":
    case "masked":
      return "masked";
    default:
      return "unknown";
  }
}

/**
 * Enrich a person to reveal their email and phone.
 * Uses POST /api/v1/people/match with reveal flags.
 * Phone reveal may be async/webhook-based on lower tiers — phone:null is returned
 * in that case rather than blocking.
 * Returns skipped when APOLLO_API_KEY is absent — never throws.
 */
export async function enrichPerson(opts: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  organizationName?: string | null;
  domain?: string | null;
  linkedinUrl?: string | null;
  apolloPersonId?: string | null;
}): Promise<{ skipped?: string } & EnrichedContact> {
  if (!hasApollo()) {
    return { skipped: SKIPPED_NO_CREDENTIALS, email: null, emailStatus: "unknown", phone: null, raw: null };
  }

  const body: Record<string, unknown> = {
    reveal_personal_emails: true,
    // reveal_phone_number requires a webhook_url and is async on Apollo's API.
    // Sending it without webhook_url causes 4xx on every call. Phone returns null.
  };
  if (opts.apolloPersonId) body.id = opts.apolloPersonId;
  if (opts.firstName) body.first_name = opts.firstName;
  if (opts.lastName) body.last_name = opts.lastName;
  if (opts.name && !opts.firstName && !opts.lastName) {
    // Split best-effort when first/last not provided separately.
    const parts = opts.name.trim().split(/\s+/);
    body.first_name = parts[0];
    if (parts.length > 1) body.last_name = parts.slice(1).join(" ");
  }
  if (opts.organizationName) body.organization_name = opts.organizationName;
  if (opts.domain) body.domain = opts.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (opts.linkedinUrl) body.linkedin_url = opts.linkedinUrl;

  const data = (await apolloFetch("/people/match", body)) as {
    person?: {
      email?: string | null;
      email_status?: string | null;
      phone_numbers?: Array<{ sanitized_number?: string }>;
      [key: string]: unknown;
    };
  };

  const person = data?.person ?? null;
  const phone =
    Array.isArray(person?.phone_numbers) && person!.phone_numbers.length > 0
      ? (person!.phone_numbers[0]?.sanitized_number ?? null)
      : null;

  return {
    email: person?.email ?? null,
    emailStatus: mapEmailStatus(person?.email_status),
    // Phone reveal is async/webhook on some Apollo tiers. Return null rather than blocking.
    phone: phone ?? null,
    raw: data,
  };
}
