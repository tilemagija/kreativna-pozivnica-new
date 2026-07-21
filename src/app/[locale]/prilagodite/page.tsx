import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPrilagoditePage, getPrilagoditeItems, getInstagramUrl } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "@/components/sections/SectionHeading";
import Reveal from "@/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [data, t] = [await getPrilagoditePage(), await getTranslations("PrilagoditePage")];
  const title = pick(data?.seoTitle, locale) || pick(data?.heading, locale) || t("heading");
  const description =
    pick(data?.seoDescription, locale) || pick(data?.intro, locale) || t("intro");
  return { title, description };
}

export default async function PrilagoditePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PrilagoditePage");
  const [data, items, instagramUrl] = await Promise.all([
    getPrilagoditePage(),
    getPrilagoditeItems(),
    getInstagramUrl(),
  ]);

  const kicker = pick(data?.kicker, locale) || t("kicker");
  const heading = pick(data?.heading, locale) || t("heading");
  const intro = pick(data?.intro, locale) || t("intro");
  const ctaLabel = pick(data?.ctaLabel, locale) || t("cta");

  const shown = items.filter((it) => it.url);

  const ctaButton = (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-sm bg-gold px-7 py-3 font-serif text-base italic text-cream transition-colors hover:bg-gold-deep"
    >
      {ctaLabel}
    </a>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-36">
      <SectionHeading kicker={kicker} heading={heading} as="h1" />
      <Reveal delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body leading-relaxed text-ink-muted">
          {intro}
        </p>
      </Reveal>

      {shown.length > 0 && (
        <div className="mt-12 gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3] md:mt-16">
          {shown.map((it, i) => (
            <Reveal key={i} delay={0.03 * (i % 6)} className="mb-4 break-inside-avoid">
              <figure className="overflow-hidden rounded-md border border-line">
                <Image
                  src={it.url as string}
                  alt={pick(it.alt, locale) || pick(it.caption, locale) || heading}
                  width={it.dim?.width || 800}
                  height={it.dim?.height || 1000}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full"
                />
                {pick(it.caption, locale) && (
                  <figcaption className="bg-cream px-3 py-2 font-serif text-sm text-ink-muted">
                    {pick(it.caption, locale)}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal delay={0.1}>
        <div className="mt-16 flex justify-center md:mt-20">{ctaButton}</div>
      </Reveal>
    </div>
  );
}
