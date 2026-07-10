import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // sr = Serbian Cyrillic (default, served at "/"), en = English (served at "/en")
  locales: ["sr", "en"],
  defaultLocale: "sr",
  localePrefix: "as-needed",
});
