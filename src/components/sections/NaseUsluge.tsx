import { getTranslations } from "next-intl/server";
import { getUsluge, getGallery, getArtworks, getDodaciItems } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import Reveal from "@/components/motion/Reveal";
import CrossDivider from "@/components/brand/CrossDivider";
import UslugeCards, { type UslugaCardData } from "./UslugeCards";

// „Наше услуге" — the services hub. „Album" cards (torn cream edge, hand-tilted, script
// caption). On hover a card grows into a large panel over the others and scatters that
// card's own photos inside (see UslugeCards). Each card pulls a different world:
// Позивнице→gallery, Слике→art, Посебни детаљи→dodaci. Covers are Sanity-editable
// (getUsluge); copy in messages/*.json. Torn-edge SVG filters are defined once below.
const CARDS = [
  { key: "invitations", href: "/pozivnice", tilt: "-2.5deg", print: "", img: "pozivnice" },
  { key: "art", href: "/umetnost", tilt: "1.5deg", print: "album-print--b", img: "slike" },
  { key: "details", href: "/dodaci", tilt: "-1.5deg", print: "album-print--c", img: "detalji" },
] as const;

const first8 = (arr: { url?: string }[]) =>
  arr.filter((x) => x.url).slice(0, 8).map((x) => ({ url: x.url as string }));

export default async function NaseUsluge({ locale }: { locale: string }) {
  const [t, usluge, gallery, artworks, dodaci] = await Promise.all([
    getTranslations("Usluge"),
    getUsluge(),
    getGallery(),
    getArtworks(),
    getDodaciItems(),
  ]);

  // Each card previews its own world.
  const imagesByKey: Record<string, { url: string }[]> = {
    pozivnice: first8(gallery?.items ?? []),
    slike: first8(artworks ?? []),
    detalji: first8(dodaci ?? []),
  };

  const cards: UslugaCardData[] = CARDS.map((c) => {
    const cover = usluge?.[c.img];
    return {
      href: c.href,
      tilt: c.tilt,
      printClass: c.print,
      title: t(`cards.${c.key}.title`),
      desc: t(`cards.${c.key}.desc`),
      coverUrl: cover?.url,
      coverAlt: pick(cover?.alt, locale) || t(`cards.${c.key}.title`),
      photoSoon: t("photoSoon"),
      images: imagesByKey[c.img],
    };
  });

  return (
    <section
      className="relative bg-no-repeat py-16 md:py-24"
      style={{ backgroundImage: "url(/pozadina.jpg)", backgroundSize: "100% 100%" }}
    >
      {/* Torn-edge filters for the album prints (referenced from globals.css). */}
      <svg aria-hidden focusable="false" className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="torn-edge-a" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.032" numOctaves={4} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={15} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="torn-edge-b" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves={4} seed={24} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="torn-edge-c" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.024 0.034" numOctaves={4} seed={41} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={16} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="torn-edge-panel" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={11} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={26} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto max-w-5xl px-6 sm:px-10 md:px-16">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Reveal>
            <CrossDivider className="h-5 w-5 text-gold" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl uppercase tracking-[0.14em] text-forest sm:text-4xl md:text-5xl">
              {t("heading")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-script text-2xl leading-none text-gold-deep sm:text-3xl">
              {t("subtitle")}
            </p>
          </Reveal>
        </div>

        <UslugeCards cards={cards} />
      </div>
    </section>
  );
}
