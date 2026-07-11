import { getTranslations } from "next-intl/server";
import { getWhy } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "./SectionHeading";
import Reveal from "@/components/motion/Reveal";

type Reason = { title: string; text: string };

// "Zašto baš mi" — the differentiator story. Editorial, asymmetric alternating rows
// with big gold numerals (§11a: typography-led, anti-template). Content from Sanity;
// falls back to translated starter copy (owner edits it in Studio).
export default async function WhyUs({ locale }: { locale: string }) {
  const data = await getWhy();
  const t = await getTranslations("WhyUs");

  const kicker = pick(data?.whyKicker, locale) || t("kicker");
  const heading = pick(data?.whyHeading, locale) || t("heading");

  const cmsReasons = (data?.whyReasons ?? [])
    .map((r) => ({ title: pick(r.title, locale), text: pick(r.text, locale) }))
    .filter((r) => r.title || r.text);
  const reasons: Reason[] = cmsReasons.length
    ? cmsReasons
    : (t.raw("reasons") as Reason[]);

  return (
    <section className="bg-greige py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading kicker={kicker} heading={heading} />

        <div className="mt-14 flex flex-col gap-12 md:mt-20 md:gap-16">
          {reasons.map((r, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <div
                className={`flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10 ${
                  i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""
                }`}
              >
                <span className="font-serif text-5xl leading-none text-gold/45 md:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex max-w-lg flex-col gap-2">
                  <h3 className="font-serif text-2xl text-ink md:text-3xl">{r.title}</h3>
                  <p className="font-body leading-relaxed text-ink-muted">{r.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
