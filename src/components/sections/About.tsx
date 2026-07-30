import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getAbout } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import { urlFor } from "@/sanity/lib/image";
import Reveal from "@/components/motion/Reveal";

// "O nama" — the story. Asymmetric two-column: image on the left (bleeds), text right.
export default async function About({ locale }: { locale: string }) {
  const data = await getAbout();
  const t = await getTranslations("About");

  const kicker = pick(data?.aboutKicker, locale) || t("kicker");
  const heading = pick(data?.aboutHeading, locale) || t("heading");
  const text = pick(data?.aboutText, locale) || t("text");
  const hasImage = Boolean(data?.aboutImage?.asset?._ref);
  // Default to the family photo (public/porodica.jpg); the owner can still override it
  // from Sanity (aboutImage) later.
  const imgUrl = hasImage
    ? urlFor(data!.aboutImage as Parameters<typeof urlFor>[0])
        .width(1200)
        .height(800)
        .fit("crop")
        .url()
    : "/porodica.jpg";

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
              alt={pick(data?.aboutImage?.alt, locale) || heading}
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
            <p className="whitespace-pre-line font-body leading-relaxed text-ink-muted">
              {text}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
