import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";
import { getArtworkSlugs } from "@/sanity/queries";

// One entry per route, with sr (default, no prefix) + en hreflang alternates.
// Per-artwork pages (/umetnost/[slug]) are added dynamically — World B is the SEO magnet (§13).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => {
    const sr = `${SITE_URL}${path || "/"}`;
    const en = `${SITE_URL}/en${path}`;
    return {
      url: sr,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
      alternates: { languages: { "sr-Cyrl": sr, en } },
    };
  };

  const slugs = await getArtworkSlugs();
  return [
    ...ROUTES.map((r) => entry(r, r === "" ? 1 : 0.7)),
    ...slugs.map((slug) => entry(`/umetnost/${slug}`, 0.6)),
  ];
}
