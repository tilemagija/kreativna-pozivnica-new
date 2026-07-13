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

// --- Gallery ---
export type GalleryEntry = {
  title?: LocaleValue;
  category?: string;
  url?: string;
  dim?: { width: number; height: number };
  alt?: LocaleValue;
};
export type GalleryData = {
  galleryKicker?: LocaleValue;
  galleryHeading?: LocaleValue;
  gallerySubheading?: LocaleValue;
  items?: GalleryEntry[];
} | null;

const GALLERY_QUERY = `*[_type == "homePage"][0]{
  galleryKicker, galleryHeading, gallerySubheading,
  "items": *[_type == "galleryItem"] | order(order asc){
    title, category,
    "url": image.asset->url,
    "dim": image.asset->metadata.dimensions,
    "alt": image.alt
  }
}`;

export async function getGallery(): Promise<GalleryData> {
  return client.fetch(GALLERY_QUERY, {}, { next: { revalidate: 60 } });
}

// --- About ("O nama") ---
export type AboutData = {
  aboutKicker?: LocaleValue;
  aboutHeading?: LocaleValue;
  aboutText?: LocaleValue;
  aboutImage?: SanityImage;
} | null;

const ABOUT_QUERY = `*[_type == "homePage"][0]{
  aboutKicker, aboutHeading, aboutText,
  aboutImage{ asset, alt }
}`;

export async function getAbout(): Promise<AboutData> {
  return client.fetch(ABOUT_QUERY, {}, { next: { revalidate: 60 } });
}

// --- Contact ---
export type ContactData = {
  contactKicker?: LocaleValue;
  contactHeading?: LocaleValue;
  contactText?: LocaleValue;
  email?: string;
  instagramHandle?: string;
  instagramUrl?: string;
} | null;

const CONTACT_QUERY = `*[_type == "homePage"][0]{
  contactKicker, contactHeading, contactText,
  "email": *[_type == "siteSettings"][0].contactEmail,
  "instagramHandle": *[_type == "siteSettings"][0].instagramHandle,
  "instagramUrl": *[_type == "siteSettings"][0].instagramUrl
}`;

export async function getContact(): Promise<ContactData> {
  return client.fetch(CONTACT_QUERY, {}, { next: { revalidate: 60 } });
}

// --- World B: "Umetnost i pokloni" ---
export type ArtPageData = {
  kicker?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  seoTitle?: LocaleValue;
  seoDescription?: LocaleValue;
} | null;

const ART_PAGE_QUERY = `*[_type == "artPage"][0]{
  kicker, heading, intro, seoTitle, seoDescription
}`;

export async function getArtPage(): Promise<ArtPageData> {
  return client.fetch(ART_PAGE_QUERY, {}, { next: { revalidate: 60 } });
}

export type Artwork = {
  name?: LocaleValue;
  category?: string;
  description?: LocaleValue;
  url?: string;
  dim?: { width: number; height: number };
  alt?: LocaleValue;
};

const ARTWORKS_QUERY = `*[_type == "artwork"] | order(order asc){
  name, category, description,
  "url": image.asset->url,
  "dim": image.asset->metadata.dimensions,
  "alt": image.alt
}`;

export async function getArtworks(): Promise<Artwork[]> {
  return client.fetch(ARTWORKS_QUERY, {}, { next: { revalidate: 60 } });
}

// --- "Nastanak" (how it's made) ---
export type NastanakVideo = {
  title?: LocaleValue;
  youtube?: string;
  description?: LocaleValue;
};
export type NastanakData = {
  kicker?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  videos?: NastanakVideo[];
  seoTitle?: LocaleValue;
  seoDescription?: LocaleValue;
} | null;

const NASTANAK_QUERY = `*[_type == "nastanakPage"][0]{
  kicker, heading, intro,
  videos[]{ title, youtube, description },
  seoTitle, seoDescription
}`;

export async function getNastanak(): Promise<NastanakData> {
  return client.fetch(NASTANAK_QUERY, {}, { next: { revalidate: 60 } });
}

// Instagram URL for inquiry fallbacks.
export async function getInstagramUrl(): Promise<string> {
  const handle = await client.fetch<string | null>(
    `*[_type == "siteSettings"][0].instagramHandle`,
    {},
    { next: { revalidate: 60 } },
  );
  const clean = (handle || "kreativna_pozivnica").replace(/^@/, "");
  return `https://instagram.com/${clean}`;
}
