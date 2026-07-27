import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Gallery from "@/components/sections/Gallery";

// Invitations gallery — the „Позивнице" card in „Наше услуге" routes here. The gallery
// showcase used to live inline on the landing page; it now has its own page (symmetric
// with /umetnost and /dodaci).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Gallery");
  return { title: t("heading"), description: t("subheading") };
}

export default async function PozivnicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pt-20 md:pt-24">
      <Gallery locale={locale} />
    </div>
  );
}
