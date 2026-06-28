import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { query } from "@/lib/db";
import { hasApollo } from "@/lib/env";
import { findCompanyAndBuyer, enrichPerson } from "@/lib/apollo";

export const enrichCompany = inngest.createFunction(
  {
    id: "outbound-enrich-company",
    name: "Outbound: Enrich Company",
    concurrency: { limit: 5 },
    retries: 2,
    triggers: [{ event: "outbound/prospect.created" }],
  },
  async ({ event, step }) => {
    const { prospectId, companyName, companyUrl, contactName } = event.data as {
      prospectId: string;
      companyName: string;
      companyUrl: string | null;
      contactName: string | null;
    };

    await step.run("mark-enriching", async () => {
      await query(`UPDATE prospects SET status = 'enriching' WHERE id = $1`, [prospectId]);
      await query(
        `INSERT INTO jobs (prospect_id, kind, status) VALUES ($1, 'enrich', 'running')`,
        [prospectId],
      );
    });

    // Env-gate: no Apollo key is a permanent configuration failure — stop retrying.
    if (!hasApollo()) {
      await step.run("mark-failed-no-apollo", async () => {
        await query(
          `UPDATE prospects SET status = 'failed', notes = $2 WHERE id = $1`,
          [prospectId, "Apollo: APOLLO_API_KEY not configured"],
        );
        await query(
          `UPDATE jobs SET status = 'failed', finished_at = NOW(), error = $2
           WHERE prospect_id = $1 AND kind = 'enrich' AND status = 'running'`,
          [prospectId, "APOLLO_API_KEY not configured"],
        );
      });

      await step.sendEvent("emit-failed-no-apollo", {
        name: "outbound/prospect.failed",
        data: {
          prospectId,
          stage: "enrich" as const,
          error: "APOLLO_API_KEY not configured",
        },
      });

      throw new NonRetriableError("APOLLO_API_KEY not configured");
    }

    const lookup = await step.run("apollo-lookup", async () => {
      return findCompanyAndBuyer({
        name: companyName,
        domain: companyUrl,
        contactName,
      });
    });

    if (!lookup.company) {
      await step.run("mark-failed-not-found", async () => {
        await query(
          `UPDATE prospects SET status = 'failed', notes = $2 WHERE id = $1`,
          [prospectId, "Apollo: company not found"],
        );
        await query(
          `UPDATE jobs SET status = 'failed', finished_at = NOW(), error = $2
           WHERE prospect_id = $1 AND kind = 'enrich' AND status = 'running'`,
          [prospectId, "company not found"],
        );
      });

      await step.sendEvent("emit-failed-not-found", {
        name: "outbound/prospect.failed",
        data: {
          prospectId,
          stage: "enrich" as const,
          error: "Apollo company not found",
        },
      });

      // Company not found is a permanent outcome — retrying will not change it.
      throw new NonRetriableError(`Apollo company not found: ${companyName}`);
    }

    // Enrich the contact to reveal email + phone.
    const enriched = await step.run("apollo-enrich-person", async () => {
      if (!lookup.contact) return null;
      return enrichPerson({
        apolloPersonId: lookup.contact.id ?? null,
        firstName: lookup.contact.first_name ?? null,
        lastName: lookup.contact.last_name ?? null,
        name: lookup.contact.name ?? null,
        organizationName: companyName,
        domain: lookup.company?.primary_domain ?? lookup.company?.website_url ?? null,
        linkedinUrl: lookup.contact.linkedin_url ?? null,
      });
    });

    // Capture non-null company outside the step callback so TypeScript can narrow it.
    const company = lookup.company!;

    await step.run("persist-apollo-data", async () => {
      // Prefer enriched email (revealed) over the search-level email when available.
      const contactEmail = enriched?.email ?? lookup.contact?.email ?? null;
      const contactEmailStatus = enriched?.emailStatus ?? null;
      const contactPhone = enriched?.phone ?? null;

      await query(
        `UPDATE prospects SET
          company_url = COALESCE(company_url, $2),
          apollo_company_id = $3,
          contact_name = COALESCE(contact_name, $4),
          contact_title = $5,
          contact_linkedin_url = $6,
          contact_email = $7,
          contact_email_status = $8,
          contact_phone = $9,
          apollo_contact_id = $10
         WHERE id = $1`,
        [
          prospectId,
          company.website_url ?? company.primary_domain ?? null,
          company.id,
          lookup.contact?.name ?? null,
          lookup.contact?.title ?? null,
          lookup.contact?.linkedin_url ?? null,
          contactEmail,
          contactEmailStatus,
          contactPhone,
          lookup.contact?.id ?? null,
        ],
      );
      await query(
        `UPDATE jobs SET status = 'succeeded', finished_at = NOW()
         WHERE prospect_id = $1 AND kind = 'enrich' AND status = 'running'`,
        [prospectId],
      );
    });

    await step.sendEvent("emit-enriched", {
      name: "outbound/prospect.enriched",
      data: {
        prospectId,
        apolloCompanyId: company.id,
        apolloContactId: lookup.contact?.id ?? null,
      },
    });

    return { ok: true };
  },
);
