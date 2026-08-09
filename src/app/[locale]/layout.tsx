import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { cormorant, alegreya, lora, marck, philosopher, russo } from "../fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ConditionalFooter from "@/components/site/ConditionalFooter";
import LanguageSlip from "@/components/site/LanguageSlip";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Креативна позивница — ручно рађене позивнице и уметност",
    template: "%s · Креативна позивница",
  },
  description:
    "Ручно илустроване позивнице по вашој причи, уметност и славски поклони. За најлепше успомене — ручно и са љубављу.",
  alternates: { languages: { "sr-Cyrl": "/", "sr-Latn": "/lat", en: "/en" } },
  openGraph: {
    type: "website",
    siteName: "Креативна позивница",
    locale: "sr_RS",
    alternateLocale: ["sr_Latn_RS", "en_US"],
  },
  twitter: { card: "summary_large_image" },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${alegreya.variable} ${lora.variable} ${marck.variable} ${philosopher.variable} ${russo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-body">
        <NextIntlClientProvider>
          <SmoothScroll />
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <ConditionalFooter>
            <Footer />
          </ConditionalFooter>
          {/* Global, outside <main>: the slip is taped to the viewport, not to a page. */}
          <LanguageSlip />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
