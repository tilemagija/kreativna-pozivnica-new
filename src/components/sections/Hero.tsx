import { getTranslations } from "next-intl/server";
import { getHero } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/motion/Reveal";
import HeroCarousel from "@/components/site/HeroCarousel";
import Lotus from "@/components/brand/Lotus";

// Landing hero. Content comes from Sanity (homePage); falls back to translated
// defaults so the page never looks broken before the CMS is filled in.
export default async function Hero({ locale }: { locale: string }) {
  const hero = await getHero();
  const t = await getTranslations("Home");

  const kicker = pick(hero?.heroKicker, locale);
  const heading = pick(hero?.heroHeading, locale) || t("title");
  const subheading = pick(hero?.heroSubheading, locale) || t("tagline");
  const primaryCta = pick(hero?.heroPrimaryCta, locale) || t("ctaPrimary");
  const secondaryCta = pick(hero?.heroSecondaryCta, locale) || t("ctaSecondary");

  const slides = (hero?.heroImages ?? [])
    .filter((img) => img?.asset?._ref)
    .map((img) => ({
      url: urlFor(img as Parameters<typeof urlFor>[0])
        .width(1000)
        .height(1333)
        .fit("crop")
        .url(),
      alt: pick(img?.alt, locale) || heading,
    }));

  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-28 md:grid-cols-2 md:gap-14 md:pb-24 md:pt-32">
      <div className="flex flex-col gap-5 md:pr-6">
        {kicker && (
          <Reveal>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-sage-deep">
              {kicker}
            </span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            {heading}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-md font-body text-lg text-ink-muted">{subheading}</p>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/napravite-svoju"
            className="rounded-sm bg-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream transition-colors hover:bg-gold-deep"
          >
            {primaryCta}
          </Link>
          <Link
            href="/umetnost"
            className="rounded-sm border border-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-gold-deep transition-colors hover:bg-gold hover:text-cream"
          >
            {secondaryCta}
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        {slides.length > 0 ? (
          <HeroCarousel images={slides} seconds={hero?.heroCarouselSeconds ?? 5} />
        ) : (
          <div className="flex aspect-[3/4] w-full items-center justify-center rounded-md border border-line bg-kraft text-gold">
            <Lotus className="h-20 w-28 opacity-40" />
          </div>
        )}
      </Reveal>
    </section>
  );
}
