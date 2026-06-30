-- 0010: traceability for the Apollo engine. api_search itself leaves no record in
-- Apollo, so we log every refill here: how many searched, kept by the verify gate,
-- and revealed (= credits spent). Gives a per-batch audit trail + credit counter.
CREATE TABLE IF NOT EXISTS apollo_activity (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  page        int,
  searched    int NOT NULL DEFAULT 0,
  kept        int NOT NULL DEFAULT 0,
  revealed    int NOT NULL DEFAULT 0,
  note        text
);
