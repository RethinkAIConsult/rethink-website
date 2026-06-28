import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { query } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { hasInngest, hasClerk } from "@/lib/env";

type InputRow = {
  companyName: string;
  companyUrl?: string | null;
  contactName?: string | null;
  contactLinkedinUrl?: string | null;
};

export async function POST(req: Request) {
  // Auth only when Clerk keys are present (Vercel); local dev is open.
  const userId = hasClerk() ? (await auth()).userId : "local-dev";
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { prospects: InputRow[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.prospects) || body.prospects.length === 0) {
    return NextResponse.json({ error: "prospects array required" }, { status: 400 });
  }

  // Cap array to 100 rows.
  const bounded = body.prospects.slice(0, 100);

  const created: Array<{
    id: string;
    companyName: string;
    companyUrl: string | null;
    contactName: string | null;
    contactLinkedinUrl: string | null;
  }> = [];

  for (const row of bounded) {
    // Skip rows with no usable company name.
    if (!row.companyName?.trim()) continue;

    const companyName = row.companyName.trim().slice(0, 200);
    const companyUrl = row.companyUrl ? row.companyUrl.slice(0, 200) : null;
    const contactName = row.contactName ? row.contactName.slice(0, 200) : null;
    const contactLinkedinUrl = row.contactLinkedinUrl
      ? row.contactLinkedinUrl.slice(0, 200)
      : null;

    const inserted = await query<{ id: string }>(
      `INSERT INTO prospects (company_name, company_url, contact_name, contact_linkedin_url, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [companyName, companyUrl, contactName, contactLinkedinUrl, userId],
    );
    const id = inserted[0]?.id;
    if (id) {
      created.push({ id, companyName, companyUrl, contactName, contactLinkedinUrl });
    }
  }

  if (hasInngest() && created.length > 0) {
    await inngest.send(
      created.map((c) => ({
        name: "outbound/prospect.created" as const,
        data: {
          prospectId: c.id,
          companyName: c.companyName,
          companyUrl: c.companyUrl,
          contactName: c.contactName,
          contactLinkedinUrl: c.contactLinkedinUrl,
          createdBy: userId,
        },
      })),
    );
  }

  return NextResponse.json({ created: created.length, prospects: created });
}
