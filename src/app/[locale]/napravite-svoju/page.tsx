import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getGalleryDataServer } from "@/sanity/serverQueries";
import SectionHeading from "@/components/sections/SectionHeading";
import Gallery from "@/components/gallery/Gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Catalog");
  return { title: t("heading"), description: t("intro") };
}

// Design catalog: tabs (printed / digital) + categories + grid. Click a design → its
// configurator at /napravite-svoju/[slug].
export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Catalog");
  const { templates, categories } = await getGalleryDataServer();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
      <SectionHeading kicker={t("kicker")} heading={t("heading")} />
      <Gallery templates={templates} categories={categories} locale={locale} />
    </div>
  );
}
