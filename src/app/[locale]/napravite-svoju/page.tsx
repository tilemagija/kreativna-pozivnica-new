import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getGalleryDataServer } from "@/sanity/serverQueries";
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
  const { templates, categories, types } = await getGalleryDataServer();

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pb-24 pt-24 sm:px-6 md:pt-24">
      {/* Visually hidden — heading removed from the UI (owner) but kept for SEO/a11y. */}
      <h1 className="sr-only">{t("heading")}</h1>
      <Gallery templates={templates} categories={categories} types={types} locale={locale} />
    </div>
  );
}
