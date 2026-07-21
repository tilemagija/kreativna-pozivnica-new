// Canonical site URL for metadata, sitemap and robots. Override with
// NEXT_PUBLIC_SITE_URL in Vercel once the custom domain is live.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kreativna-pozivnica-new.vercel.app"
).replace(/\/$/, "");

// Public routes that exist today (Latin slugs, §13). "" = landing.
export const ROUTES = ["", "/umetnost", "/dodaci", "/prilagodite", "/nastanak", "/akcija"];
