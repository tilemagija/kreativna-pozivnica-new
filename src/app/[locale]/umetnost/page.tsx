import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getArtPage, getArtworks, getInstagramUrl } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "@/components/sections/SectionHeading";
import InquiryDialog from "@/components/InquiryDialog";
import Reveal from "@/components/motion/Reveal";

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

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-36">
      <SectionHeading kicker={kicker} heading={heading} />
      <Reveal delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body leading-relaxed text-ink-muted">
          {intro}
        </p>
      </Reveal>

      {items.length ? (
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {items.map((a, i) => {
            const name = pick(a.name, locale);
            return (
              <Reveal key={i} delay={0.04 * (i % 3)}>
                <article className="flex flex-col overflow-hidden rounded-md border border-line bg-cream">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={a.url as string}
                      alt={pick(a.alt, locale) || name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h2 className="font-serif text-xl text-ink">{name}</h2>
                    {pick(a.description, locale) && (
                      <p className="font-body text-sm leading-relaxed text-ink-muted">
                        {pick(a.description, locale)}
                      </p>
                    )}
                    <div className="mt-auto pt-3">
                      <InquiryDialog
                        context={`Уметност и поклони — ${name}`}
                        title={name}
                        instagramUrl={instagramUrl}
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <p className="mt-16 text-center font-body text-ink-muted">{t("empty")}</p>
      )}
    </div>
  );
}
