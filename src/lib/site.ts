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

// The GEO service has its own flagship page at /geo, so every link and schema
// node for it points there rather than /services/geo-and-ai-visibility, which
// would be a second canonical URL for the same entity. next.config redirects
// the old path to /geo.
export const GEO_SLUG = "geo-and-ai-visibility";

export function serviceHref(slug: string) {
  return slug === GEO_SLUG ? "/geo" : `/services/${slug}`;
}

// Clamp a description to the SERP snippet window at a word boundary. Use for
// page meta and OpenGraph descriptions; keep the full text for on-page copy and
// JSON-LD so nothing is lost from the structured data.
export function metaDescription(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}...`;
}
