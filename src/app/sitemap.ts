import type { MetadataRoute } from "next";
import { SITE_URL, CONTENT_UPDATED, GEO_SLUG } from "@/lib/site";
import { SERVICES, CASE_STUDIES } from "@/lib/data";
import { ARTICLES } from "@/lib/resources";

// lastModified is driven by the single CONTENT_UPDATED constant in lib/site.ts
// (bumped with any real copy change), except articles, which carry their own
// dateModified so freshness stays honest per page.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);

  const staticRoutes = [
    { url: SITE_URL, priority: 1.0 },
    { url: `${SITE_URL}/services`, priority: 0.9 },
    { url: `${SITE_URL}/geo`, priority: 0.9 },
    { url: `${SITE_URL}/work`, priority: 0.8 },
    { url: `${SITE_URL}/resources`, priority: 0.7 },
    { url: `${SITE_URL}/assessment`, priority: 0.7 },
  ].map((r) => ({ ...r, lastModified, changeFrequency: "monthly" as const }));

  const serviceRoutes = SERVICES.filter((s) => s.slug !== GEO_SLUG).map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const workRoutes = CASE_STUDIES.map((c) => ({
    url: `${SITE_URL}/work/${c.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articleRoutes = ARTICLES.map((a) => ({
    url: `${SITE_URL}/resources/${a.slug}`,
    lastModified: new Date(a.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...workRoutes, ...articleRoutes];
}
