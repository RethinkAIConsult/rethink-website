-- Firmographic attributes saved per contact so funnel outcomes (replied / call
-- booked / won) can be analysed by attribute to learn the real ICP over time.
ALTER TABLE outreach_research ADD COLUMN IF NOT EXISTS company_type text;  -- 'tech_product' | 'non_tech_operating'
ALTER TABLE outreach_research ADD COLUMN IF NOT EXISTS industry text;      -- short sector label
ALTER TABLE outreach_research ADD COLUMN IF NOT EXISTS hq_location text;   -- city + country/state if known

CREATE INDEX IF NOT EXISTS idx_outreach_company_type ON outreach_research (company_type);
CREATE INDEX IF NOT EXISTS idx_outreach_industry ON outreach_research (industry);
