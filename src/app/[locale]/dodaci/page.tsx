import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getDodaciPage, getDodaciItems, getInstagramUrl } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "@/components/sections/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import EtnoFrame from "@/components/site/EtnoFrame";
import PageEndHome from "@/components/site/PageEndHome";
import MasonryInfinite from "@/components/gallery/MasonryInfinite";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [data, t] = [await getDodaciPage(), await getTranslations("DodaciPage")];
  const title = pick(data?.seoTitle, locale) || pick(data?.heading, locale) || t("heading");
  const description =
    pick(data?.seoDescription, locale) || pick(data?.intro, locale) || t("intro");
  return { title, description };
}

export default async function DodaciPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("DodaciPage");
  const [data, items, instagramUrl] = await Promise.all([
    getDodaciPage(),
    getDodaciItems(),
    getInstagramUrl(),
  ]);

  const kicker = pick(data?.kicker, locale) || t("kicker");
  const heading = pick(data?.heading, locale) || t("heading");
  const intro = pick(data?.intro, locale) || t("intro");
  const ctaLabel = pick(data?.ctaLabel, locale) || t("cta");

  const shown = items.filter((it) => it.url);

  const nodes = shown.map((it, i) => (
    <Reveal key={i} delay={0.03 * (i % 3)}>
      <figure className="rounded-sm border border-line bg-cream p-1.5 shadow-[0_8px_22px_rgba(59,50,39,0.18)] transition-transform duration-300 hover:-translate-y-1">
        <Image
          src={it.url as string}
          alt={pick(it.alt, locale) || pick(it.caption, locale) || heading}
          width={it.dim?.width || 800}
          height={it.dim?.height || 1000}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-auto w-full rounded-[2px]"
        />
        {pick(it.caption, locale) && (
          <figcaption className="px-2.5 pb-1 pt-2.5 text-center font-serif text-sm text-ink-muted">
            {pick(it.caption, locale)}
          </figcaption>
        )}
      </figure>
    </Reveal>
  ));

  return (
    <EtnoFrame>
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-12 md:pt-16">
        <SectionHeading kicker={kicker} heading={heading} as="h1" />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-center font-body leading-relaxed text-ink-muted">
            {intro}
          </p>
        </Reveal>

        {nodes.length > 0 && <MasonryInfinite items={nodes} />}

        <Reveal delay={0.1}>
          <div className="mt-16 flex justify-center md:mt-20">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-sm bg-gold px-7 py-3 font-serif text-base italic text-cream transition-colors hover:bg-gold-deep"
            >
              {ctaLabel}
            </a>
          </div>
        </Reveal>
      </div>
      <PageEndHome />
    </EtnoFrame>
  );
}
