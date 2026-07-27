import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/motion/Reveal";
import Lotus from "@/components/brand/Lotus";
import CrossDivider from "@/components/brand/CrossDivider";

// „Наше услуге" — the services hub from the owner's mockup: three windows that route to
// the three worlds. The vez side ornaments are woven into the page background
// (pozadina.jpg), so the section itself just needs the heading + cards; cross ornaments
// punctuate the heading and the card row.
// NOTE (CMS follow-up): card images are placeholders for now — the owner will supply
// photos, and they should become Sanity-editable. Copy lives in messages/*.json.
const CARDS = [
  { key: "invitations", href: "/pozivnice" },
  { key: "art", href: "/umetnost" },
  { key: "details", href: "/dodaci" },
] as const;

export default async function NaseUsluge() {
  const t = await getTranslations("Usluge");

  return (
    <section
      className="relative bg-no-repeat py-16 md:py-24"
      style={{ backgroundImage: "url(/pozadina.jpg)", backgroundSize: "100% 100%" }}
    >
      <div className="mx-auto max-w-4xl px-10 sm:px-16 md:px-24">
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

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-14 md:gap-8">
          {CARDS.map((c, i) => (
            <Reveal key={c.key} delay={0.05 * i} className="h-full">
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-sm border border-gold/30 bg-cream/70 p-4 text-center shadow-[0_14px_30px_-20px_rgba(32,64,34,0.5)] backdrop-blur-[1px] transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_20px_38px_-20px_rgba(32,64,34,0.6)]"
              >
                {/* Image placeholder (owner photos + CMS to come) */}
                <div className="flex aspect-[4/5] w-full items-center justify-center border border-line bg-greige">
                  <div className="flex flex-col items-center gap-2 text-gold/45">
                    <Lotus className="h-10 w-16" />
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em]">
                      {t("photoSoon")}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 font-serif text-xl uppercase tracking-wide text-forest">
                  {t(`cards.${c.key}.title`)}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
                  {t(`cards.${c.key}.desc`)}
                </p>
                <span className="mt-auto pt-4">
                  <CrossDivider className="mx-auto h-3.5 w-3.5 text-gold/70" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
