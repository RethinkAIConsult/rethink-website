-- 0003_outbound_monitor.sql
-- Always-on sourcing (Parallel Monitor) + funding/tools enrichment + source keyword.
-- Idempotent: safe to re-run. Run AFTER 0001 + 0002.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- enum -------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE monitor_status AS ENUM ('active', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- monitors: one row per Parallel Monitor (scheduled re-discovery) ---------
CREATE TABLE IF NOT EXISTS monitors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id    TEXT,                       -- Parallel monitor_<hex>
  type          TEXT NOT NULL DEFAULT 'event_stream',
  objective     TEXT NOT NULL,
  frequency     TEXT NOT NULL DEFAULT '1d'  CHECK (frequency IN ('1h', '1d', '1w')),
  processor     TEXT NOT NULL DEFAULT 'lite' CHECK (processor IN ('lite', 'base')),
  status        monitor_status NOT NULL DEFAULT 'active',
  campaign_id   UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  last_event_at TIMESTAMPTZ,
  created_by    TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS monitors_status_idx ON monitors (status);
CREATE UNIQUE INDEX IF NOT EXISTS monitors_monitor_id_uniq
  ON monitors (monitor_id) WHERE monitor_id IS NOT NULL;

-- source keyword (which automation keyword triggered the match) -----------
ALTER TABLE prospects  ADD COLUMN IF NOT EXISTS source_keyword TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS source_keyword TEXT;

-- funding + tools enrichment (captured at research time, NOT a filter) ----
ALTER TABLE research ADD COLUMN IF NOT EXISTS funding_summary TEXT;
ALTER TABLE research ADD COLUMN IF NOT EXISTS tools_used      TEXT;
