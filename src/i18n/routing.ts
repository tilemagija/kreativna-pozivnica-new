import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // sr = Serbian Cyrillic (default, served at "/"), en = English (served at "/en")
  locales: ["sr", "en"],
  defaultLocale: "sr",
  localePrefix: "as-needed",
  // Off on purpose. next-intl otherwise reads the browser's Accept-Language header and
  // redirects — so a Serbian customer whose phone is set to English (very common) landed on
  // the English site instead of the Cyrillic one. „/" now always serves Serbian; English is
  // reached only by choosing it.
  localeDetection: false,
});
