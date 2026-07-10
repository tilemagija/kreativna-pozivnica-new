import { Cormorant_Garamond, Lora, Marck_Script } from "next/font/google";

// Headings / display — elegant roman serif (matches the wordmark).
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

// Body / UI — warm readable serif with full Cyrillic.
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
