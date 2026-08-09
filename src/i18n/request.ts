import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { toLatinDeep } from "@/lib/transliterate";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // There is no messages/sr-Latn.json on purpose — it is generated from the Cyrillic one, so
  // the two can never drift apart and the owner writes every string only once.
  if (locale === "sr-Latn") {
    const sr = (await import("../../messages/sr.json")).default;
    return { locale, messages: toLatinDeep(sr) };
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
