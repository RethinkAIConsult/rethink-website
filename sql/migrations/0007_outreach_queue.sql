-- 0007: turn the outreach log into a work QUEUE. Import a batch (CSV from Apollo,
-- or via the Apollo API), pre-research each, then work them one card at a time.
-- Status flow: pending (imported) -> ready (researched) -> sent -> replied/booked/passed.
ALTER TABLE outreach_research ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE outreach_research ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual'; -- manual | csv | apollo
ALTER TABLE outreach_research ADD COLUMN IF NOT EXISTS sent_at timestamptz;
