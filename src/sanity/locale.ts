// Bilingual Sanity fields are stored as { sr, en }. Pick the active locale,
// falling back to Serbian (the default) so the site never shows an empty string
// when only one language has been filled in.
export type LocaleValue = { sr?: string; en?: string } | undefined | null;

export function pick(value: LocaleValue, locale: string): string {
  if (!value) return "";
  const key = locale === "en" ? "en" : "sr";
  return value[key] || value.sr || value.en || "";
}
