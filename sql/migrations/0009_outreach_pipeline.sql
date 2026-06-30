-- 0009: long-term pipeline tracking for the LinkedIn outreach funnel.
-- Status funnel: pending -> ready (work queue) -> connect_sent -> connected ->
-- replied -> call_booked -> won  (passed = dead at any point).
ALTER TABLE outreach_research ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
-- migrate any legacy 'sent' rows to the new 'connect_sent' stage name
UPDATE outreach_research SET status = 'connect_sent' WHERE status = 'sent';
