import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getArtPage, getArtworks, getInstagramUrl } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "@/components/sections/SectionHeading";
import ArtGallery from "@/components/worldb/ArtGallery";
import Reveal from "@/components/motion/Reveal";
import EtnoFrame from "@/components/site/EtnoFrame";
import PageEndHome from "@/components/site/PageEndHome";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [data, t] = [await getArtPage(), await getTranslations("ArtPage")];
  const title = pick(data?.seoTitle, locale) || pick(data?.heading, locale) || t("heading");
  const description = pick(data?.seoDescription, locale) || pick(data?.intro, locale) || t("intro");
  return { title, description };
}

export default async function ArtPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ArtPage");
  const [data, artworks, instagramUrl] = await Promise.all([
    getArtPage(),
    getArtworks(),
    getInstagramUrl(),
  ]);

  const kicker = pick(data?.kicker, locale) || t("kicker");
  const heading = pick(data?.heading, locale) || t("heading");
  const intro = pick(data?.intro, locale) || t("intro");

  const items = artworks.filter((a) => a.url);

  // `data-world="b"` scopes a distinct World B aesthetic (locked in a later design pass
  // with the owner; §11a/Phase 6). Structure + logic are final now; the skin is deferred.
  return (
    <EtnoFrame>
      <div data-world="b" className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-16">
        <SectionHeading kicker={kicker} heading={heading} as="h1" />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-center font-body leading-relaxed text-ink-muted">
            {intro}
          </p>
        </Reveal>

        {items.length ? (
          <ArtGallery artworks={items} locale={locale} instagramUrl={instagramUrl} />
        ) : (
          <p className="mt-16 text-center font-body text-ink-muted">{t("empty")}</p>
        )}
      </div>
      <PageEndHome />
    </EtnoFrame>
  );
}
