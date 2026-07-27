import { getTranslations } from "next-intl/server";
import { getUsluge, getGallery } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import Reveal from "@/components/motion/Reveal";
import CrossDivider from "@/components/brand/CrossDivider";
import UslugaCard from "./UslugaCard";

// „Наше услуге" — the services hub from the owner's mockup. Direction chosen with the owner:
// „album" — three equal-size photo prints with a torn cream edge, hand-tilted, with a
// handwritten (script) caption. On hover each card scatters the first 8 gallery photos
// (see UslugaCard). The torn edge is an SVG feDisplacement filter on the cream paper layer
// (see globals.css `.album-print`), defined once below. Vez side ornaments live in the page
// background (pozadina.jpg). Card cover images are Sanity-editable (getUsluge); copy in
// messages/*.json.
const CARDS = [
  { key: "invitations", href: "/pozivnice", tilt: "-2.5deg", print: "", img: "pozivnice" },
  { key: "art", href: "/umetnost", tilt: "1.5deg", print: "album-print--b", img: "slike" },
  { key: "details", href: "/dodaci", tilt: "-1.5deg", print: "album-print--c", img: "detalji" },
] as const;

export default async function NaseUsluge({ locale }: { locale: string }) {
  const [t, usluge, gallery] = await Promise.all([
    getTranslations("Usluge"),
    getUsluge(),
    getGallery(),
  ]);

  // First 8 gallery photos, shared by all cards' hover fan.
  const galleryImages = (gallery?.items ?? [])
    .filter((it) => it.url)
    .slice(0, 8)
    .map((it) => ({ url: it.url as string }));

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

        {/* Cards — album prints (hover scatters gallery photos) */}
        <div className="mt-12 grid gap-x-12 gap-y-16 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-x-16">
          {CARDS.map((c, i) => {
            const cover = usluge?.[c.img];
            return (
              <Reveal key={c.key} delay={0.06 * i} className="flex justify-center">
                <UslugaCard
                  href={c.href}
                  tilt={c.tilt}
                  printClass={c.print}
                  title={t(`cards.${c.key}.title`)}
                  desc={t(`cards.${c.key}.desc`)}
                  coverUrl={cover?.url}
                  coverAlt={pick(cover?.alt, locale) || t(`cards.${c.key}.title`)}
                  photoSoon={t("photoSoon")}
                  images={galleryImages}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
