import type { Metadata } from "next";
import { cormorant, alegreya, lora, marck } from "../fonts";
import "../globals.css";

// Isolated root layout for the internal font-picking page — pages outside `[locale]` must
// bring their own <html>/<body> (same reason /template-tool has one). Not indexed.
export const metadata: Metadata = {
  title: "Проба фонтова",
  robots: { index: false, follow: false },
};

export default function FontProbaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sr"
      className={`${cormorant.variable} ${alegreya.variable} ${lora.variable} ${marck.variable} antialiased`}
    >
      <body className="min-h-screen bg-cream font-body text-ink">{children}</body>
    </html>
  );
}
