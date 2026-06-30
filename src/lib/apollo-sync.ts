// Pull contacts from an Apollo saved list into the outreach queue.
// Two-step: GET /labels to find list ids, POST /contacts/search to pull members.
// Auth: X-Api-Key header. contacts/search consumes no credits (stored data).
// Docs: https://docs.apollo.io/reference/search-for-contacts
//
// Apollo API responses are untyped external JSON, so `any` is used deliberately
// at the parse boundary (shapes vary by endpoint and plan).
/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE = "https://api.apollo.io/api/v1";

function headers(): Record<string, string> {
  return { "X-Api-Key": process.env.APOLLO_API_KEY ?? "", "Content-Type": "application/json" };
}

export type ApolloList = { id: string; name: string };
export type ApolloContact = {
  name: string;
  title?: string;
  company: string;
  website?: string;
  linkedin?: string;
};

export async function apolloLists(): Promise<ApolloList[]> {
  const res = await fetch(`${BASE}/labels`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`Apollo /labels ${res.status} (a master API key is required to list labels)`);
  }
  const data: unknown = await res.json();
  const arr: any[] = Array.isArray(data)
    ? data
    : ((data as any)?.labels ?? (data as any)?.contact_labels ?? []);
  return arr
    .filter((l) => l && l.id)
    .map((l) => ({ id: String(l.id), name: l.name ?? l.label ?? "Untitled list" }));
}

// ── People search (mixed_people/api_search) + reveal (people/bulk_match) ──
// Free plan can't read saved contacts; paid plan can search the prospecting DB.
// Search returns MASKED data (first name, title, company, id); bulk_match reveals
// full name + LinkedIn (costs ~1 credit per person). The ICP filters live here.
const ICP_SEARCH = {
  person_titles: [
    // ops + exec buyers (mostly non-tech operating companies)
    "Chief Operating Officer", "COO", "Head of Operations", "VP of Operations",
    "Director of Operations", "Operations Director", "Head of Business Operations",
    "Founder", "Co-Founder", "CEO",
    // tech buyers (AI engineering help at product companies like Oscilar / Zoopla)
    "Chief Technology Officer", "CTO", "VP of Engineering", "Head of Engineering",
    "Head of AI", "Head of Machine Learning", "Head of Data",
  ],
  person_locations: ["United States", "United Kingdom"],
  // 50-200 is the retainer sweet spot: enough back-office operational complexity
  // and budget to need automation, small enough to lack an in-house eng team.
  // Floor raised from 11 because Apollo over-tags tiny shops (5-person pizza
  // places) as "11-50", which polluted the queue.
  organization_num_employees_ranges: ["51,100", "101,200"],
};

export type MaskedPerson = { id: string; firstName: string; title: string; company: string; website?: string };

export async function apolloSearchPeople(
  page: number,
  perPage = 25,
): Promise<{ people: MaskedPerson[]; total: number }> {
  const res = await fetch(`${BASE}/mixed_people/api_search`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ ...ICP_SEARCH, page, per_page: perPage }),
  });
  if (!res.ok) throw new Error(`Apollo api_search ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const d: any = await res.json();
  const people: MaskedPerson[] = (d.people ?? [])
    .map((p: any) => ({
      id: String(p.id),
      firstName: p.first_name ?? "",
      title: p.title ?? "",
      company: p.organization?.name ?? "",
      website: p.organization?.website_url ?? p.organization?.primary_domain ?? undefined,
    }))
    .filter((p: MaskedPerson) => p.id && p.company);
  return { people, total: d.total_entries ?? people.length };
}

export type RevealedPerson = { id: string; name: string; linkedin?: string };

export async function apolloRevealPeople(ids: string[]): Promise<Record<string, RevealedPerson>> {
  const out: Record<string, RevealedPerson> = {};
  // bulk_match allows at most 10 records per request
  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    const res = await fetch(`${BASE}/people/bulk_match`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ details: chunk.map((id) => ({ id })) }),
    });
    if (!res.ok) throw new Error(`Apollo bulk_match ${res.status}: ${(await res.text()).slice(0, 160)}`);
    const d: any = await res.json();
    for (const m of d.matches ?? []) {
      if (m && m.id) {
        out[String(m.id)] = {
          id: String(m.id),
          name: m.name ?? `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim(),
          linkedin: m.linkedin_url ?? undefined,
        };
      }
    }
  }
  return out;
}

function mapContact(c: any): ApolloContact {
  return {
    name: c.name ?? `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(),
    title: c.title ?? undefined,
    company: c.organization_name ?? c.organization?.name ?? c.account?.name ?? "",
    website: c.organization?.website_url ?? c.account?.domain ?? undefined,
    linkedin: c.linkedin_url ?? undefined,
  };
}

// Pull saved contacts (no list filter needed) one page at a time. Works with a
// non-master key. Returns the page plus the total count for cursor logic.
export async function apolloPullSavedContacts(
  page: number,
  perPage = 100,
): Promise<{ contacts: ApolloContact[]; total: number }> {
  const res = await fetch(`${BASE}/contacts/search`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ page, per_page: Math.min(100, perPage) }),
  });
  if (!res.ok) {
    throw new Error(`Apollo /contacts/search ${res.status}: ${(await res.text()).slice(0, 160)}`);
  }
  const data: any = await res.json();
  const raw: any[] = data.contacts ?? data.people ?? [];
  return {
    contacts: raw.map(mapContact).filter((c) => c.name && c.company),
    total: data.pagination?.total_entries ?? raw.length,
  };
}

export async function apolloListContacts(listId: string, limit = 50): Promise<ApolloContact[]> {
  const out: ApolloContact[] = [];
  let page = 1;
  while (out.length < limit && page <= 20) {
    const res = await fetch(`${BASE}/contacts/search`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        contact_label_ids: [listId],
        page,
        per_page: Math.min(100, limit),
      }),
    });
    if (!res.ok) {
      throw new Error(`Apollo /contacts/search ${res.status}: ${(await res.text()).slice(0, 160)}`);
    }
    const data: any = await res.json();
    const contacts: any[] = data.contacts ?? data.people ?? [];
    if (!contacts.length) break;
    for (const c of contacts) {
      out.push({
        name: c.name ?? `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(),
        title: c.title ?? undefined,
        company: c.organization_name ?? c.organization?.name ?? c.account?.name ?? "",
        website: c.organization?.website_url ?? c.account?.domain ?? undefined,
        linkedin: c.linkedin_url ?? undefined,
      });
      if (out.length >= limit) break;
    }
    page++;
  }
  return out.filter((c) => c.name && c.company);
}
