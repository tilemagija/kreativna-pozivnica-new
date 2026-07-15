// FIXED font palette for invitation templates (konfigurator §4). The owner designs
// every template using ONLY these fonts; each text field stores its `fontKey` so the
// live preview reproduces the design 1:1. All fonts have full Cyrillic support and are
// loaded via next/font (see app/fonts.ts). This one list is the single source of truth:
// the Sanity dropdown (fontKey) and the preview's font-family mapping both read it.
export type TemplateFontKey =
  | "cormorant"
  | "ebgaramond"
  | "playfair"
  | "lora"
  | "spectral"
  | "philosopher"
  | "marck"
  | "caveat";

export type TemplateFont = {
  key: TemplateFontKey;
  /** Human label shown to the owner in Studio. */
  label: string;
  /** CSS font-family value (a next/font CSS variable) used by TemplatePreview. */
  cssVar: string;
};

export const TEMPLATE_FONTS: TemplateFont[] = [
  { key: "cormorant", label: "Cormorant Garamond (елегантни сериф)", cssVar: "var(--font-cormorant)" },
  { key: "ebgaramond", label: "EB Garamond (класични сериф)", cssVar: "var(--font-ebgaramond)" },
  { key: "playfair", label: "Playfair Display (свечани сериф)", cssVar: "var(--font-playfair)" },
  { key: "lora", label: "Lora (топли читак сериф)", cssVar: "var(--font-lora)" },
  { key: "spectral", label: "Spectral (меки модерни сериф)", cssVar: "var(--font-spectral)" },
  { key: "philosopher", label: "Philosopher (чиста елегантна форма)", cssVar: "var(--font-philosopher)" },
  { key: "marck", label: "Marck Script (рукопис / калиграфија)", cssVar: "var(--font-marck)" },
  { key: "caveat", label: "Caveat (опуштени рукопис)", cssVar: "var(--font-caveat)" },
];

const FONT_BY_KEY = new Map(TEMPLATE_FONTS.map((f) => [f.key, f]));

// CSS font-family for a stored fontKey; falls back to the first palette font so a
// bad/empty key never breaks the preview.
export function fontFamilyFor(key: string | undefined): string {
  return (key && FONT_BY_KEY.get(key as TemplateFontKey)?.cssVar) || TEMPLATE_FONTS[0].cssVar;
}

// { title, value } list for the Sanity `fontKey` dropdown.
export const TEMPLATE_FONT_OPTIONS = TEMPLATE_FONTS.map((f) => ({ title: f.label, value: f.key }));
