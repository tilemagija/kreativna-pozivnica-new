import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";

// One entry per route, with sr (default, no prefix) + en hreflang alternates.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => {
    const sr = `${SITE_URL}${r || "/"}`;
    const en = `${SITE_URL}/en${r}`;
    return {
      url: sr,
      lastModified: now,
      changeFrequency: "weekly",
      priority: r === "" ? 1 : 0.7,
      alternates: { languages: { "sr-Cyrl": sr, en } },
    };
  });
}
