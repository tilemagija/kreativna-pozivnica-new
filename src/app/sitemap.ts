import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";
import { getArtworkSlugs } from "@/sanity/queries";

// One entry per route, with sr-Cyrl (default, no prefix) + sr-Latn + en hreflang alternates.
// Per-artwork pages (/umetnost/[slug]) are added dynamically — World B is the SEO magnet (§13).
// Only the Cyrillic URL is listed as `url`: Latin is the same content, so it is declared as an
// alternate rather than a second page, which is what keeps the two from competing in search.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => {
    const sr = `${SITE_URL}${path || "/"}`;
    const srLatn = `${SITE_URL}/lat${path}`;
    const en = `${SITE_URL}/en${path}`;
    return {
      url: sr,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
      alternates: { languages: { "sr-Cyrl": sr, "sr-Latn": srLatn, en } },
    };
  };

  const slugs = await getArtworkSlugs();
  return [
    ...ROUTES.map((r) => entry(r, r === "" ? 1 : 0.7)),
    ...slugs.map((slug) => entry(`/umetnost/${slug}`, 0.6)),
  ];
}
