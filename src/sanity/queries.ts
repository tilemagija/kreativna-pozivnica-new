import { client } from "./lib/client";
import type { LocaleValue } from "./locale";

// --- Types (only the fields we read on the landing) ---
export type SanityImage = {
  asset?: { _ref: string };
  alt?: LocaleValue;
  hotspot?: { x: number; y: number };
} | null;

export type HeroData = {
  heroKicker?: LocaleValue;
  heroHeading?: LocaleValue;
  heroSubheading?: LocaleValue;
  heroPrimaryCta?: LocaleValue;
  heroSecondaryCta?: LocaleValue;
  heroImages?: SanityImage[];
  heroCarouselSeconds?: number;
} | null;

const HERO_QUERY = `*[_type == "homePage"][0]{
  heroKicker, heroHeading, heroSubheading, heroPrimaryCta, heroSecondaryCta,
  heroCarouselSeconds,
  heroImages[]{ asset, hotspot, alt }
}`;

// Cache for a short window so editors see updates quickly without hammering Sanity.
export async function getHero(): Promise<HeroData> {
  return client.fetch(HERO_QUERY, {}, { next: { revalidate: 60 } });
}

// --- "Zašto baš mi" (why us) ---
export type Reason = { icon?: string; title?: LocaleValue; text?: LocaleValue };
export type WhyData = {
  whyKicker?: LocaleValue;
  whyHeading?: LocaleValue;
  whyReasons?: Reason[];
} | null;

const WHY_QUERY = `*[_type == "homePage"][0]{
  whyKicker, whyHeading,
  whyReasons[]{ icon, title, text }
}`;

export async function getWhy(): Promise<WhyData> {
  return client.fetch(WHY_QUERY, {}, { next: { revalidate: 60 } });
}
