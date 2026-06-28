-- 0004: outbound motion split — APPLY (contract/fractional postings, the proven
-- "apply to the posting" play that won Alto) vs PITCH (permanent reqs, message the
-- named decision-maker on LinkedIn). Nullable; existing rows backfilled by script.
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS track text; -- 'apply' | 'pitch'
