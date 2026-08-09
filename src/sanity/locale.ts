import { toLatin } from "@/lib/transliterate";

// Bilingual Sanity fields are stored as { sr, en }. Pick the active locale,
// falling back to Serbian (the default) so the site never shows an empty string
// when only one language has been filled in.
export type LocaleValue = { sr?: string; en?: string } | undefined | null;

export function pick(value: LocaleValue, locale: string): string {
  if (!value) return "";

  // „sr-Latn" is not stored in Sanity — it is the Cyrillic text transliterated on the way
  // out. That is the whole point: the owner fills in each field once, in Cyrillic, and the
  // Latin version of the site follows automatically and can never fall out of sync.
  if (locale === "sr-Latn") {
    const sr = value.sr || value.en || "";
    return value.sr ? toLatin(sr) : sr;
  }

  const key = locale === "en" ? "en" : "sr";
  return value[key] || value.sr || value.en || "";
}

// For CMS fields stored as ONE plain Serbian string rather than a { sr, en } pair — today
// that is the invitation template name. Same rule as `pick`: Cyrillic as authored, Latin
// generated. English has no separate value for these, so it shows the Cyrillic original.
export function pickPlain(text: string | undefined | null, locale: string): string {
  if (!text) return "";
  return locale === "sr-Latn" ? toLatin(text) : text;
}
