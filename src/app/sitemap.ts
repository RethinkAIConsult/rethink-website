import type { MetadataRoute } from "next";

const BASE_URL = "https://rethinkaiconsult.com";

// Update these when copy actually changes, not on every deploy.
const HOMEPAGE_UPDATED = new Date("2026-06-11");
const ASSESSMENT_UPDATED = new Date("2026-06-11");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: HOMEPAGE_UPDATED,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/assessment`,
      lastModified: ASSESSMENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
