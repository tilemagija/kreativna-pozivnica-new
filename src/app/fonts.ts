import {
  Cormorant_Garamond,
  Alegreya,
  Lora,
  Marck_Script,
  EB_Garamond,
  Playfair_Display,
  Spectral,
  Philosopher,
  Caveat,
} from "next/font/google";

// Headings / display — elegant roman serif (matches the wordmark).
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

// Body / UI — literary humanist serif with full Cyrillic. Chosen over Lora (owner, Aug 2026):
// Lora's Cyrillic read as too mechanical, "like a typewriter". 500 is loaded because body
// copy is set in medium, not regular — see --font-body / About.
export const alegreya = Alegreya({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-alegreya",
  display: "swap",
});

// Kept even though it is no longer the body font: Lora is one of the eight fonts the owner
// can set ON an invitation (templateFonts.ts), so its variable must stay in the layouts.
export const lora = Lora({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

// Script accent — handwritten cursive, Cyrillic. Use sparingly.
export const marck = Marck_Script({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-marck",
  display: "swap",
});

// --- Extra fonts for the configurator template palette (templateFonts.ts). Loaded
// only on the configurator page (their variables are applied there), so other pages
// stay light. All have full Cyrillic support. ---
export const ebGaramond = EB_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-ebgaramond",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const spectral = Spectral({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-spectral",
  display: "swap",
});

export const philosopher = Philosopher({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-philosopher",
  display: "swap",
});

export const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

// Combined className applying all extra-palette font variables — put on the
// configurator page wrapper so the preview can use any palette font.
export const configuratorFontVars = [
  ebGaramond.variable,
  playfair.variable,
  spectral.variable,
  philosopher.variable,
  caveat.variable,
].join(" ");
