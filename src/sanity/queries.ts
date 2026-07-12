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

// --- Social proof ("Postanite deo priče") ---
export type TestimonialItem = {
  quote?: LocaleValue;
  authorName?: string;
  authorDetail?: LocaleValue;
  photo?: SanityImage;
};
export type SocialData = {
  socialKicker?: LocaleValue;
  socialHeading?: LocaleValue;
  counterTarget?: number;
  counterSuffix?: string;
  counterLabel?: LocaleValue;
  counterTagline?: LocaleValue;
  packageImages?: SanityImage[];
  instagramImages?: SanityImage[];
  instagramHandle?: string;
  testimonialsKicker?: LocaleValue;
  testimonialsHeading?: LocaleValue;
  testimonials?: TestimonialItem[];
} | null;

const SOCIAL_QUERY = `*[_type == "homePage"][0]{
  socialKicker, socialHeading,
  counterTarget, counterSuffix, counterLabel, counterTagline,
  packageImages[]{ asset, alt },
  instagramImages[]{ asset },
  testimonialsKicker, testimonialsHeading,
  "instagramHandle": *[_type == "siteSettings"][0].instagramHandle,
  "testimonials": *[_type == "testimonial"] | order(order asc){
    quote, authorName, authorDetail, photo
  }
}`;

export async function getSocial(): Promise<SocialData> {
  return client.fetch(SOCIAL_QUERY, {}, { next: { revalidate: 60 } });
}
