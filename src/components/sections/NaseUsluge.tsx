import type { CSSProperties } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getUsluge } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import Reveal from "@/components/motion/Reveal";
import Lotus from "@/components/brand/Lotus";
import CrossDivider from "@/components/brand/CrossDivider";

// „Наше услуге" — the services hub from the owner's mockup. Direction chosen with the owner:
// „album" — three equal-size photo prints with a torn cream edge, hand-tilted, with a
// handwritten (script) caption. The torn edge is an SVG feDisplacement filter on the cream
// paper layer (see globals.css `.album-print`). Vez side ornaments live in the page
// background (pozadina.jpg). NOTE (CMS follow-up): card images are placeholders — the owner
// supplies photos, which should become Sanity-editable. Copy in messages/*.json.
const CARDS = [
  { key: "invitations", href: "/pozivnice", tilt: "-2.5deg", print: "", img: "pozivnice" },
  { key: "art", href: "/umetnost", tilt: "1.5deg", print: "album-print--b", img: "slike" },
  { key: "details", href: "/dodaci", tilt: "-1.5deg", print: "album-print--c", img: "detalji" },
] as const;

export default async function NaseUsluge({ locale }: { locale: string }) {
  const [t, usluge] = await Promise.all([getTranslations("Usluge"), getUsluge()]);

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

        {/* Cards — album prints */}
        <div className="mt-12 grid gap-x-12 gap-y-16 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-x-16">
          {CARDS.map((c, i) => {
            const cover = usluge?.[c.img];
            return (
              <Reveal key={c.key} delay={0.06 * i} className="flex justify-center">
                <Link href={c.href} className="group block w-full max-w-[290px]">
                  <div
                    className={`album-print ${c.print}`}
                    style={{ "--tilt": c.tilt } as CSSProperties}
                  >
                    <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden border border-line bg-kraft">
                      {cover?.url ? (
                        <Image
                          src={cover.url}
                          alt={pick(cover.alt, locale) || t(`cards.${c.key}.title`)}
                          fill
                          sizes="(max-width: 640px) 90vw, 290px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gold/45">
                          <Lotus className="h-10 w-16" />
                          <span className="font-sans text-[10px] uppercase tracking-[0.25em]">
                            {t("photoSoon")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="album-name">{t(`cards.${c.key}.title`)}</div>
                  </div>
                  <p className="mx-auto mt-7 max-w-[18rem] text-center font-sans text-base leading-relaxed text-ink">
                    {t(`cards.${c.key}.desc`)}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
