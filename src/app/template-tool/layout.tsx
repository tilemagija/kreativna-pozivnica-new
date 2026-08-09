import type { Metadata } from "next";
import { cormorant, alegreya, lora, marck, configuratorFontVars } from "../fonts";
import "../globals.css";

// Isolated root layout for the internal placement tool: brand fonts (incl. the full
// template palette), no site nav / smooth-scroll (cleaner for dragging). Not indexed.
export const metadata: Metadata = {
  title: "Распоред поља — алат",
  robots: { index: false, follow: false },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sr"
      className={`${cormorant.variable} ${alegreya.variable} ${lora.variable} ${marck.variable} ${configuratorFontVars} antialiased`}
    >
      <body className="min-h-screen bg-cream font-body text-ink">{children}</body>
    </html>
  );
}
