import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getGalleryDataServer } from "@/sanity/serverQueries";
import Gallery from "@/components/gallery/Gallery";
import EtnoFrame from "@/components/site/EtnoFrame";

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

  // EtnoFrame puts the catalog on the same linen field (+ desktop vez columns) as the other
  // inner pages, and already clears the fixed navbar — hence no own pt here. The footer STAYS
  // on this page (unlike the gallery pages): this is where the purchase decision happens, so
  // the contact buttons should be within reach.
  return (
    <EtnoFrame>
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-24 pt-2 sm:px-6 md:pt-6">
        {/* Visually hidden — heading removed from the UI (owner) but kept for SEO/a11y. */}
        <h1 className="sr-only">{t("heading")}</h1>
        <Gallery templates={templates} categories={categories} types={types} locale={locale} />
      </div>
    </EtnoFrame>
  );
}
