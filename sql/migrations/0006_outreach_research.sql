-- 0006: manual outreach research log. Paste a contact + company, Exa researches
-- the company, DeepSeek returns a tailored LinkedIn angle + connect note, and we
-- track who has been contacted.
CREATE TABLE IF NOT EXISTS outreach_research (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name     text NOT NULL,
  contact_title    text,
  company_name     text NOT NULL,
  company_url      text,
  research_summary text,
  pain_hook        text,
  angle            text,
  connect_note     text,
  status           text NOT NULL DEFAULT 'researched', -- researched | contacted | replied | booked | passed
  created_at       timestamptz NOT NULL DEFAULT now(),
  contacted_at     timestamptz
);
CREATE INDEX IF NOT EXISTS idx_outreach_research_created ON outreach_research(created_at DESC);
