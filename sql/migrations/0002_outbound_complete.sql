-- 0002_outbound_complete.sql
-- Completes the outbound CRM on top of 0001:
--   * campaigns (group prospects into named outbound motions)
--   * lead source / provenance + contact phone + email status on prospects
--   * discovery_runs (one row per Parallel FindAll / Exa run)
--   * candidates (the discovery inbox: raw matches before promotion to prospect)
-- Idempotent: safe to re-run. Run AFTER 0001.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- enums ------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE prospect_source AS ENUM (
    'parallel_findall', 'parallel_entity', 'exa', 'manual', 'referral'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE contact_email_status AS ENUM (
    'verified', 'unlocked', 'guessed', 'masked', 'unknown'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('active', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE candidate_status AS ENUM ('new', 'promoted', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE discovery_engine AS ENUM ('parallel_findall', 'parallel_entity', 'exa');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- campaigns --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  description    TEXT,
  icp_objective  TEXT,
  default_source prospect_source,
  status         campaign_status NOT NULL DEFAULT 'active',
  created_by     TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns (status);

DROP TRIGGER IF EXISTS campaigns_touch_updated_at ON campaigns;
CREATE TRIGGER campaigns_touch_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- prospects: provenance + contact enrichment columns ---------------------
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS source prospect_source;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS contact_email_status contact_email_status;
CREATE INDEX IF NOT EXISTS prospects_campaign_idx ON prospects (campaign_id);
CREATE INDEX IF NOT EXISTS prospects_source_idx ON prospects (source);

-- discovery_runs: one row per FindAll / Exa discovery run ----------------
CREATE TABLE IF NOT EXISTS discovery_runs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id         UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  engine              discovery_engine NOT NULL,
  objective           TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'queued'
                        CHECK (status IN ('queued', 'running', 'succeeded', 'failed')),
  external_id         TEXT,
  match_count         INTEGER NOT NULL DEFAULT 0,
  cost_estimate_cents INTEGER,
  error               TEXT,
  created_by          TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at         TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS discovery_runs_campaign_idx ON discovery_runs (campaign_id, created_at DESC);

-- candidates: the discovery inbox (raw matches before promotion) ----------
CREATE TABLE IF NOT EXISTS candidates (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id          UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  discovery_run_id     UUID REFERENCES discovery_runs(id) ON DELETE SET NULL,
  source               prospect_source NOT NULL,
  entity_type          TEXT NOT NULL DEFAULT 'company'
                         CHECK (entity_type IN ('company', 'person')),
  name                 TEXT NOT NULL,
  url                  TEXT,
  description          TEXT,
  signal               TEXT,
  citations            JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_json             JSONB NOT NULL DEFAULT '{}'::jsonb,
  fit_score            INTEGER CHECK (fit_score >= 0 AND fit_score <= 10),
  status               candidate_status NOT NULL DEFAULT 'new',
  promoted_prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
  created_by           TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS candidates_status_idx ON candidates (status);
CREATE INDEX IF NOT EXISTS candidates_campaign_idx ON candidates (campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS candidates_fit_idx ON candidates (fit_score DESC);
CREATE INDEX IF NOT EXISTS candidates_run_idx ON candidates (discovery_run_id);
-- dedupe within a campaign by url (where present)
CREATE UNIQUE INDEX IF NOT EXISTS candidates_campaign_url_uniq
  ON candidates (campaign_id, url) WHERE url IS NOT NULL;
