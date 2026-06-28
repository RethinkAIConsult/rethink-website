-- 0001_outbound_init.sql
-- Outbound funnel schema: prospects, research, drafts, sends, replies, jobs.
-- Run against Neon Postgres. Idempotent: safe to re-run.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE prospect_status AS ENUM (
    'new',
    'enriching',
    'researching',
    'drafting',
    'ready',
    'connect_sent',
    'connected',
    'dm1_sent',
    'dm2_sent',
    'dm3_sent',
    'replied',
    'call_booked',
    'won',
    'lost',
    'dropped',
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE n8n_usage AS ENUM (
    'yes_first_party_evidence',
    'yes_indirect_evidence',
    'no_evidence',
    'explicitly_uses_alternative'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS prospects (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name         TEXT NOT NULL,
  company_url          TEXT,
  apollo_company_id    TEXT,
  contact_name         TEXT,
  contact_title        TEXT,
  contact_linkedin_url TEXT,
  contact_email        TEXT,
  apollo_contact_id    TEXT,
  funding_event        TEXT,
  status               prospect_status NOT NULL DEFAULT 'new',
  fit_score            INTEGER CHECK (fit_score >= 0 AND fit_score <= 10),
  created_by           TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  connect_sent_at      TIMESTAMPTZ,
  connected_at         TIMESTAMPTZ,
  dm1_sent_at          TIMESTAMPTZ,
  dm2_sent_at          TIMESTAMPTZ,
  dm3_sent_at          TIMESTAMPTZ,
  replied_at           TIMESTAMPTZ,
  call_booked_at       TIMESTAMPTZ,
  notes                TEXT
);

CREATE INDEX IF NOT EXISTS prospects_status_idx ON prospects (status);
CREATE INDEX IF NOT EXISTS prospects_fit_score_idx ON prospects (fit_score DESC);
CREATE INDEX IF NOT EXISTS prospects_created_by_idx ON prospects (created_by);
CREATE UNIQUE INDEX IF NOT EXISTS prospects_apollo_contact_uniq
  ON prospects (apollo_contact_id) WHERE apollo_contact_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS research (
  prospect_id           UUID PRIMARY KEY REFERENCES prospects(id) ON DELETE CASCADE,
  summary               TEXT,
  uses_n8n              n8n_usage,
  pain_signal           TEXT,
  pain_signal_url       TEXT,
  pain_signal_source    TEXT,
  buyer_observation     TEXT,
  current_stack_summary TEXT,
  raw_json              JSONB NOT NULL,
  task_id               TEXT,
  generated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS research_uses_n8n_idx ON research (uses_n8n);

CREATE TABLE IF NOT EXISTS drafts (
  prospect_id    UUID PRIMARY KEY REFERENCES prospects(id) ON DELETE CASCADE,
  connect_note   TEXT NOT NULL,
  dm1            TEXT NOT NULL,
  dm2            TEXT NOT NULL,
  dm3            TEXT NOT NULL,
  model          TEXT NOT NULL,
  prompt_version TEXT NOT NULL DEFAULT 'v1',
  generated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sends (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id   UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  channel       TEXT NOT NULL CHECK (channel IN ('linkedin_connect', 'linkedin_dm', 'email')),
  step          TEXT NOT NULL CHECK (step IN ('connect', 'dm1', 'dm2', 'dm3')),
  body          TEXT NOT NULL,
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_by       TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS sends_prospect_idx ON sends (prospect_id, sent_at DESC);

CREATE TABLE IF NOT EXISTS replies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id   UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  body          TEXT NOT NULL,
  sentiment     TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative', 'unsure')),
  received_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  logged_by     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS replies_prospect_idx ON replies (prospect_id, received_at DESC);

CREATE TABLE IF NOT EXISTS jobs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id    UUID REFERENCES prospects(id) ON DELETE CASCADE,
  kind           TEXT NOT NULL,
  status         TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed')),
  inngest_run_id TEXT,
  started_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at    TIMESTAMPTZ,
  error          TEXT
);

CREATE INDEX IF NOT EXISTS jobs_prospect_kind_idx ON jobs (prospect_id, kind, started_at DESC);

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prospects_touch_updated_at ON prospects;
CREATE TRIGGER prospects_touch_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE OR REPLACE VIEW due_today AS
SELECT
  p.*,
  CASE
    WHEN p.status = 'connect_sent' AND p.connect_sent_at < NOW() - INTERVAL '48 hours' THEN 'follow_up_connect_or_dm1'
    WHEN p.status = 'connected' THEN 'send_dm1'
    WHEN p.status = 'dm1_sent' AND p.dm1_sent_at < NOW() - INTERVAL '5 days' THEN 'send_dm2'
    WHEN p.status = 'dm2_sent' AND p.dm2_sent_at < NOW() - INTERVAL '10 days' THEN 'send_dm3'
    ELSE NULL
  END AS next_action
FROM prospects p
WHERE p.status NOT IN ('replied', 'call_booked', 'won', 'lost', 'dropped', 'failed', 'new', 'enriching', 'researching', 'drafting');
