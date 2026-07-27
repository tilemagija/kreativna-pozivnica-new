import { client } from "./lib/client";
import type { LocaleValue } from "./locale";
import type { PricingConfig } from "@/lib/configuratorPricing";

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

// --- "Наше услуге" card cover images (optional; fall back to a placeholder when empty) ---
export type UslugeCard = { url?: string; alt?: LocaleValue } | null;
export type UslugeData = {
  pozivnice?: UslugeCard;
  slike?: UslugeCard;
  detalji?: UslugeCard;
} | null;

const USLUGE_QUERY = `*[_type == "homePage"][0]{
  "pozivnice": { "url": uslugePozivniceImage.asset->url, "alt": uslugePozivniceImage.alt },
  "slike": { "url": uslugeSlikeImage.asset->url, "alt": uslugeSlikeImage.alt },
  "detalji": { "url": uslugeDetaljiImage.asset->url, "alt": uslugeDetaljiImage.alt }
}`;

export async function getUsluge(): Promise<UslugeData> {
  return client.fetch(USLUGE_QUERY, {}, { next: { revalidate: 60 } });
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
  whatsappNumber?: string;
  viberNumber?: string;
} | null;

const CONTACT_QUERY = `*[_type == "homePage"][0]{
  contactKicker, contactHeading, contactText,
  "email": *[_type == "siteSettings"][0].contactEmail,
  "instagramHandle": *[_type == "siteSettings"][0].instagramHandle,
  "instagramUrl": *[_type == "siteSettings"][0].instagramUrl,
  "whatsappNumber": *[_type == "siteSettings"][0].whatsappNumber,
  "viberNumber": *[_type == "siteSettings"][0].viberNumber
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

export type ArtworkFrame = { name?: LocaleValue; swatchUrl?: string };
export type Artwork = {
  name?: LocaleValue;
  slug?: string;
  category?: string;
  description?: LocaleValue;
  priceFrom?: number;
  url?: string;
  dim?: { width: number; height: number };
  alt?: LocaleValue;
  dimensions?: string[];
  frames?: ArtworkFrame[];
};

// Fuller shape for the per-item page (adds extra photos).
export type ArtworkDetail = Artwork & {
  gallery?: { url?: string; dim?: { width: number; height: number } }[];
};

// The gallery list includes dimensions + frames so the lightbox can show them
// without a second fetch (one showcase page, cheap).
const ARTWORKS_QUERY = `*[_type == "artwork"] | order(order asc){
  name, "slug": slug.current, category, description, priceFrom,
  "url": image.asset->url,
  "dim": image.asset->metadata.dimensions,
  "alt": image.alt,
  dimensions,
  frames[]{ name, "swatchUrl": swatch.asset->url }
}`;

export async function getArtworks(): Promise<Artwork[]> {
  return client.fetch(ARTWORKS_QUERY, {}, { next: { revalidate: 60 } });
}

const ARTWORK_BY_SLUG_QUERY = `*[_type == "artwork" && slug.current == $slug][0]{
  name, "slug": slug.current, category, description, priceFrom,
  "url": image.asset->url,
  "dim": image.asset->metadata.dimensions,
  "alt": image.alt,
  dimensions,
  frames[]{ name, "swatchUrl": swatch.asset->url },
  "gallery": gallery[]{ "url": asset->url, "dim": asset->metadata.dimensions }
}`;

export async function getArtworkBySlug(slug: string): Promise<ArtworkDetail | null> {
  return client.fetch(ARTWORK_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
}

// Slugs for generateStaticParams + sitemap (World B is the SEO magnet, §13).
export async function getArtworkSlugs(): Promise<string[]> {
  const slugs = await client.fetch<(string | null)[]>(
    `*[_type == "artwork" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 60 } },
  );
  return slugs.filter((s): s is string => !!s);
}

// --- "Dodaci" (World A supporting stationery — showcase → Instagram) ---
export type DodaciPageData = {
  kicker?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  ctaLabel?: LocaleValue;
  seoTitle?: LocaleValue;
  seoDescription?: LocaleValue;
} | null;

const DODACI_PAGE_QUERY = `*[_type == "dodaciPage"][0]{
  kicker, heading, intro, ctaLabel, seoTitle, seoDescription
}`;

export async function getDodaciPage(): Promise<DodaciPageData> {
  return client.fetch(DODACI_PAGE_QUERY, {}, { next: { revalidate: 60 } });
}

export type DodaciItem = {
  caption?: LocaleValue;
  url?: string;
  dim?: { width: number; height: number };
  alt?: LocaleValue;
};

const DODACI_ITEMS_QUERY = `*[_type == "dodaciItem"] | order(order asc){
  caption,
  "url": image.asset->url,
  "dim": image.asset->metadata.dimensions,
  "alt": image.alt
}`;

export async function getDodaciItems(): Promise<DodaciItem[]> {
  return client.fetch(DODACI_ITEMS_QUERY, {}, { next: { revalidate: 60 } });
}

// --- "Прилагодите баш вама" (custom + special invitations — showcase → Instagram) ---
export type PrilagoditePageData = {
  kicker?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  ctaLabel?: LocaleValue;
  seoTitle?: LocaleValue;
  seoDescription?: LocaleValue;
} | null;

const PRILAGODITE_PAGE_QUERY = `*[_type == "prilagoditePage"][0]{
  kicker, heading, intro, ctaLabel, seoTitle, seoDescription
}`;

export async function getPrilagoditePage(): Promise<PrilagoditePageData> {
  return client.fetch(PRILAGODITE_PAGE_QUERY, {}, { next: { revalidate: 60 } });
}

export type PrilagoditeItem = {
  caption?: LocaleValue;
  url?: string;
  dim?: { width: number; height: number };
  alt?: LocaleValue;
};

const PRILAGODITE_ITEMS_QUERY = `*[_type == "prilagoditeItem"] | order(order asc){
  caption,
  "url": image.asset->url,
  "dim": image.asset->metadata.dimensions,
  "alt": image.alt
}`;

export async function getPrilagoditeItems(): Promise<PrilagoditeItem[]> {
  return client.fetch(PRILAGODITE_ITEMS_QUERY, {}, { next: { revalidate: 60 } });
}

// --- "Akcija" (sale) ---
export type SalePageData = {
  kicker?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  seoTitle?: LocaleValue;
  seoDescription?: LocaleValue;
} | null;

const SALE_PAGE_QUERY = `*[_type == "salePage"][0]{
  kicker, heading, intro, seoTitle, seoDescription
}`;

export async function getSalePage(): Promise<SalePageData> {
  return client.fetch(SALE_PAGE_QUERY, {}, { next: { revalidate: 60 } });
}

export type SaleItem = {
  title?: LocaleValue;
  description?: LocaleValue;
  discountPercent?: number;
  validUntil?: string;
  url?: string;
  alt?: LocaleValue;
};

// Only active items; expiry (validUntil) is filtered in the page (date compare).
const SALES_QUERY = `*[_type == "sale" && active == true] | order(order asc){
  title, description, discountPercent, validUntil,
  "url": image.asset->url,
  "alt": image.alt
}`;

export async function getSales(): Promise<SaleItem[]> {
  return client.fetch(SALES_QUERY, {}, { next: { revalidate: 60 } });
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

// --- Configurator: invitation templates (Faza 3) ---
export type TemplateTextField = {
  key: string;
  label?: LocaleValue;
  defaultText?: string;
  fontKey?: string;
  fontSizePct?: number;
  color?: string;
  align?: "left" | "center" | "right";
  xPct?: number;
  yPct?: number;
  widthPct?: number;
  lineHeight?: number;
  multiline?: boolean;
  maxLength?: number;
};

export type InvitationTemplate = {
  _id: string;
  name?: LocaleValue;
  slug?: string;
  category?: string;
  active?: boolean;
  doubleSided?: boolean;
  imageUrl?: string;
  /** width / height, from image metadata; may be undefined for some assets. */
  aspect?: number;
  textFields?: TemplateTextField[];
  /** Back side (only for double-sided designs). */
  backImageUrl?: string;
  backAspect?: number;
  backTextFields?: TemplateTextField[];
};

// --- Gallery (catalog) ---
export type GalleryTemplate = {
  _id: string;
  name?: LocaleValue;
  slug?: string;
  doubleSided?: boolean;
  imageUrl?: string;
  categorySlugs?: string[];
};
export type GalleryCategory = { name?: LocaleValue; slug?: string };
export type CatalogData = { templates: GalleryTemplate[]; categories: GalleryCategory[] };

export const CATALOG_QUERY = `{
  "templates": *[_type == "invitationTemplate" && active == true] | order(order asc){
    _id, name, "slug": slug.current, doubleSided,
    "imageUrl": image.asset->url,
    "categorySlugs": categories[]->slug.current
  },
  "categories": *[_type == "category"] | order(order asc){ name, "slug": slug.current }
}`;

const TEXTFIELDS_PROJECTION = `{
  key, label, defaultText, fontKey, fontSizePct, color, align,
  xPct, yPct, widthPct, lineHeight, multiline, maxLength
}`;

export const TEMPLATE_BY_SLUG_QUERY = `*[_type == "invitationTemplate" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, doubleSided,
  "imageUrl": image.asset->url,
  "aspect": image.asset->metadata.dimensions.aspectRatio,
  textFields[]${TEXTFIELDS_PROJECTION},
  "backImageUrl": backImage.asset->url,
  "backAspect": backImage.asset->metadata.dimensions.aspectRatio,
  backTextFields[]${TEXTFIELDS_PROJECTION}
}`;

const TEMPLATES_QUERY = `*[_type == "invitationTemplate" && active == true] | order(order asc){
  _id, name, category,
  "imageUrl": image.asset->url,
  "aspect": image.asset->metadata.dimensions.aspectRatio,
  textFields[]{
    key, label, defaultText, fontKey, fontSizePct, color, align,
    xPct, yPct, widthPct, lineHeight, multiline, maxLength
  }
}`;

export async function getInvitationTemplates(): Promise<InvitationTemplate[]> {
  return client.fetch(TEMPLATES_QUERY, {}, { next: { revalidate: 60 } });
}

// --- Configurator: options + pricing (paper / envelope / seal + rules) ---
export type PricedOption = {
  _id: string;
  name?: LocaleValue;
  pricePerPiece?: number;
  description?: LocaleValue;
  swatchUrl?: string;
};
export type SealMotifOption = { _id: string; name?: LocaleValue; imageUrl?: string };
export type SealColorOption = { _id: string; name?: LocaleValue; swatchUrl?: string };

export type ConfiguratorOptions = {
  pricing: PricingConfig | null;
  papers: PricedOption[];
  envelopes: PricedOption[];
  sealMotifs: SealMotifOption[];
  sealColors: SealColorOption[];
};

export const OPTIONS_QUERY = `{
  "pricing": *[_type == "pricing"][0]{
    minQuantity, setupFee, digitalPrice, pausOmotPrice, addonDoubleSided,
    addonTornEdges, addonGoldEdges, addonRoundedEdges,
    sealBase, sealGoldLeaf, sealTatarika
  },
  "papers": *[_type == "paperOption"] | order(order asc){
    _id, name, pricePerPiece, description, "swatchUrl": swatch.asset->url
  },
  "envelopes": *[_type == "envelopeOption"] | order(order asc){
    _id, name, pricePerPiece, description, "swatchUrl": swatch.asset->url
  },
  "sealMotifs": *[_type == "sealMotif"] | order(order asc){
    _id, name, "imageUrl": image.asset->url
  },
  "sealColors": *[_type == "sealColor"] | order(order asc){
    _id, name, "swatchUrl": swatch.asset->url
  }
}`;

// NOTE: paperOption/envelopeOption/sealMotif/sealColor are NOT in this dataset's public
// read grant (only pricing/invitationTemplate/etc. are). Read them server-side instead —
// see getConfiguratorOptionsServer() in serverQueries.ts. (OPTIONS_QUERY is shared.)

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

// Fixed digital-invitation price (§15). `pricing` is in the public read grant, so this
// is safe to read with the public client. The server RE-reads it in /api/order (§7).
export async function getDigitalPrice(): Promise<number> {
  const price = await client.fetch<number | null>(
    `*[_type == "pricing"][0].digitalPrice`,
    {},
    { next: { revalidate: 60 } },
  );
  return typeof price === "number" && price > 0 ? price : 0;
}
