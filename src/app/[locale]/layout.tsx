import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { cormorant, lora, marck } from "../fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: "Kreativna pozivnica",
  description: "Ručno rađene pozivnice i umetnost — za najlepše uspomene.",
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
      className={`${cormorant.variable} ${lora.variable} ${marck.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-body">
        <NextIntlClientProvider>
          <SmoothScroll />
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
