import type { MetadataRoute } from "next";
import { SITE_URL, CONTENT_UPDATED } from "@/lib/site";
import { SERVICES, CASE_STUDIES } from "@/lib/data";

// lastModified is driven by the single CONTENT_UPDATED constant in lib/site.ts,
// bumped in the same commit as any real copy change, so freshness signals stay
// honest instead of being frozen to a hardcoded date.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);

  const staticRoutes = [
    { url: SITE_URL, priority: 1.0 },
    { url: `${SITE_URL}/services`, priority: 0.9 },
    { url: `${SITE_URL}/geo`, priority: 0.9 },
    { url: `${SITE_URL}/work`, priority: 0.8 },
    { url: `${SITE_URL}/assessment`, priority: 0.7 },
  ];

  const serviceRoutes = SERVICES.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    priority: 0.8,
  }));

  const workRoutes = CASE_STUDIES.map((study) => ({
    url: `${SITE_URL}/work/${study.slug}`,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...workRoutes].map((route) => ({
    ...route,
    lastModified,
    changeFrequency: "monthly" as const,
  }));
}
