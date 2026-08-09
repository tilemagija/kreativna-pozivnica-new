import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getAbout } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import Reveal from "@/components/motion/Reveal";

// "O nama" — the story. Asymmetric two-column: image on the left (bleeds), text right.
export default async function About({ locale }: { locale: string }) {
  const data = await getAbout();
  const t = await getTranslations("About");

  const kicker = pick(data?.aboutKicker, locale) || t("kicker");
  const heading = pick(data?.aboutHeading, locale) || t("heading");
  const text = pick(data?.aboutText, locale) || t("text");
  // The family photo is the „О нама" image (public/porodica.jpg). Kept static on purpose:
  // a stale Sanity aboutImage used to override it. To change it, swap the file (or ask
  // to re-wire the CMS field).
  const imgUrl = "/porodica.jpg";

  return (
    <section
      className="bg-no-repeat py-20 md:py-28"
      style={{ backgroundImage: "url(/pozadina3.jpg)", backgroundSize: "100% 100%" }}
    >
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 sm:px-10 md:grid-cols-2 md:gap-16 md:px-16">
        <Reveal>
          <div className="relative aspect-[3/2] overflow-hidden rounded-md border border-line">
            <Image
              src={imgUrl}
              alt={heading}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-5">
          <Reveal>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-sage-deep">
              {kicker}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-serif text-3xl leading-tight text-forest sm:text-4xl">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            {/* The story runs long, so it is set larger (+30% over base) and in medium rather
                than regular — owner's call after seeing it at body size. Slightly gentler on
                phones, where 1.3rem over a six-paragraph story gets tall. */}
            <p className="whitespace-pre-line font-body text-[1.15rem] font-medium leading-relaxed text-ink-muted md:text-[1.3rem]">
              {text}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
