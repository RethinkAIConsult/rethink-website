-- 0005: multiple LinkedIn contacts per prospect. The pipeline resolves several
-- relevant people per company (COO, Head of Ops, automation leads, founder) so
-- Jack has more than one door to knock on. prospects.contact_* keeps the primary
-- (rank 0) for the drafted note; this table holds the full set.
CREATE TABLE IF NOT EXISTS prospect_contacts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id  uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  name         text NOT NULL,
  title        text,
  linkedin_url text,
  rank         int  NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_prospect_contacts_prospect ON prospect_contacts(prospect_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_prospect_contacts_url ON prospect_contacts(prospect_id, linkedin_url);
