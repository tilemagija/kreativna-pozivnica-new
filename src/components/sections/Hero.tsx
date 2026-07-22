import { getTranslations } from "next-intl/server";
import { getHero } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import { urlFor } from "@/sanity/lib/image";
import Reveal from "@/components/motion/Reveal";
import HeroCarousel from "@/components/site/HeroCarousel";
import Lotus from "@/components/brand/Lotus";

// Landing hero (DESIGN.md — editorial/asymmetric, warm-rich, anti-template). Left: a
// gold-lotus kicker flourish → big deep-green serif heading → gold script accent → one
// green CTA that glides down to the gallery. Right: the illustration mounted like a
// framed photograph (cream mat + thin gold line + slight tilt) on the parchment surface.
// Content comes from Sanity (homePage) with translated fallbacks.
export default async function Hero({ locale }: { locale: string }) {
  const hero = await getHero();
  const t = await getTranslations("Home");

  const kicker = pick(hero?.heroKicker, locale);
  const heading = pick(hero?.heroHeading, locale) || t("title");
  const subheading = pick(hero?.heroSubheading, locale) || t("tagline");
  const cta = pick(hero?.heroSecondaryCta, locale) || t("ctaSecondary");

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
    <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:pb-24 md:pt-32">
      <div className="flex flex-col gap-5 md:pr-4">
        <Reveal>
          <div className="flex items-center gap-3 text-gold">
            <Lotus className="h-5 w-8" />
            {kicker && (
              <span className="font-sans text-xs uppercase tracking-[0.28em] text-sage-deep">
                {kicker}
              </span>
            )}
            <span className="h-px flex-1 bg-gold/40" />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="font-serif text-4xl leading-[1.05] text-forest sm:text-5xl md:text-6xl">
            {heading}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="max-w-md font-script text-2xl leading-snug text-gold-deep sm:text-3xl">
            {subheading}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="pt-2">
          <a
            href="#galerija"
            className="inline-block w-fit rounded-sm bg-forest px-7 py-3 font-sans text-sm uppercase tracking-wider text-cream transition-colors hover:bg-sage-deep"
          >
            {cta}
          </a>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto w-full max-w-sm md:-rotate-2">
          <div className="bg-cream p-3 shadow-[0_20px_45px_-20px_rgba(32,64,34,0.45)] sm:p-4">
            <div className="border border-gold/50 p-[3px]">
              {slides.length > 0 ? (
                <HeroCarousel images={slides} seconds={hero?.heroCarouselSeconds ?? 5} />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-kraft text-gold">
                  <Lotus className="h-20 w-28 opacity-40" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
