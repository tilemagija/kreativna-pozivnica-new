import type { Metadata } from "next";
import { cormorant, alegreya, lora, marck } from "../fonts";
import "../globals.css";

// Isolated root layout for the internal navbar-picking page — pages outside `[locale]` bring
// their own <html>/<body> (same as /template-tool and /font-proba). Not indexed.
export const metadata: Metadata = {
  title: "Проба навигације",
  robots: { index: false, follow: false },
};

export default function NavbarProbaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sr"
      className={`${cormorant.variable} ${alegreya.variable} ${lora.variable} ${marck.variable} antialiased`}
    >
      <body className="min-h-screen bg-paper text-ink font-body">{children}</body>
    </html>
  );
}
