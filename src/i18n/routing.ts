import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // sr      = Serbian Cyrillic — default, served at "/" (the authored source of all content)
  // sr-Latn = the same content transliterated automatically, served at "/lat"
  // en      = English, served at "/en"
  locales: ["sr", "sr-Latn", "en"],
  defaultLocale: "sr",
  localePrefix: {
    mode: "as-needed",
    // „/lat" instead of the default „/sr-Latn": shorter, and it is what a Serbian visitor
    // would recognise in the address bar.
    prefixes: { "sr-Latn": "/lat" },
  },
  // Off on purpose. next-intl otherwise reads the browser's Accept-Language header and
  // redirects — so a Serbian customer whose phone is set to English (very common) landed on
  // the English site instead of the Cyrillic one. „/" now always serves Serbian; English is
  // reached only by choosing it.
  localeDetection: false,
});
