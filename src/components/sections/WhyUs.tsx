import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getWhy } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import Reveal from "@/components/motion/Reveal";
import CrossDivider from "@/components/brand/CrossDivider";

type Reason = { title: string; text: string };

// „Зашто баш ми" — the differentiator story, laid over the owner's sepia watercolor of
// a couple before a village church (public/crkva.jpg). The painting keeps the church +
// couple on the left; text sits in the empty warm space on the right (desktop) or on a
// paper scrim at the bottom (mobile) so it always reads. Content from Sanity, falls back
// to translated starter copy (owner edits it in Studio).
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
    <section className="relative isolate overflow-hidden">
      {/* Owner's watercolor — church + couple stay on the left; empty field/sky on the right. */}
      <Image
        src="/crkva.jpg"
        alt="Млади пар пред сеоском црквом — акварел у сепији"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[22%_center] md:object-[center_35%]"
      />
      {/* Paper scrim: light wash so the watercolour still shows through under the text.
          Fades in from the bottom on mobile (text below), from the right on desktop
          (text right) — the church side stays fully clear either way. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-paper via-paper/80 to-paper/10 md:bg-gradient-to-l md:from-paper/75 md:via-paper/35 md:to-transparent"
      />

      {/* On desktop the section keeps the painting's own aspect ratio (~1672/941) so the
          whole illustration — cross on top, couple at the bottom — is visible, uncropped. */}
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-end px-6 py-20 sm:px-10 md:min-h-[57vw] md:items-center md:justify-end md:py-12">
        <div className="w-full max-w-xl md:max-w-md">
          <Reveal>
            <div className="flex items-center gap-3 text-gold">
              <CrossDivider className="h-5 w-5" />
              <span className="font-script text-2xl leading-none text-gold-deep sm:text-3xl">
                {kicker}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-forest sm:text-4xl md:text-[2.6rem]">
              {heading}
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-6 md:mt-10">
            {reasons.map((r, i) => (
              <Reveal key={i} delay={0.12 + 0.07 * i}>
                <div className="border-l-2 border-gold/40 pl-5">
                  <h3 className="font-serif text-xl text-forest sm:text-2xl">{r.title}</h3>
                  <p className="mt-1 font-body leading-relaxed text-ink-muted">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
