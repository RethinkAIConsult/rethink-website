// Single source of truth for the canonical site URL and the content freshness
// date. Bump CONTENT_UPDATED in the same commit as any real copy change so the
// sitemap lastModified and the JSON-LD dateModified signal never drift apart.
export const SITE_URL = "https://rethinkaiconsult.com";

// Last meaningful content update (ISO date). Feeds sitemap lastModified and the
// dateModified signal in structured data. AI answer engines weigh freshness.
export const CONTENT_UPDATED = "2026-06-14";

// Original publish date of the marketing content. dateModified tracks
// CONTENT_UPDATED above; datePublished stays fixed.
export const CONTENT_PUBLISHED = "2026-06-11";
