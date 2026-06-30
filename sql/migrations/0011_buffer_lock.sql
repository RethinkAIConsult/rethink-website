-- 0011: concurrency lock so the auto-fill can never run twice at once (which would
-- double-reveal and double-spend credits). filling_at is set when a fill starts and
-- cleared when it ends; a stale lock (>3 min) is treated as released.
ALTER TABLE outreach_meta ADD COLUMN IF NOT EXISTS filling_at timestamptz;
