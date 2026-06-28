-- 0008: cursor for paginating the Apollo saved-contacts pull, so the auto-refill
-- buffer advances through the list instead of re-fetching page 1.
CREATE TABLE IF NOT EXISTS outreach_meta (
  id               int PRIMARY KEY DEFAULT 1,
  apollo_page      int NOT NULL DEFAULT 1,
  apollo_exhausted boolean NOT NULL DEFAULT false
);
INSERT INTO outreach_meta (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
