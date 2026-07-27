import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getGallery } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "./SectionHeading";
import Reveal from "@/components/motion/Reveal";

// Gallery mosaic (the moat, §11a: varied sizes, not a uniform grid). Masonry via CSS
// columns; real works from Sanity, tasteful placeholder tiles while empty.
const PLACEHOLDER_HEIGHTS = ["h-64", "h-80", "h-56", "h-72", "h-96", "h-60"];

export default async function Gallery({ locale }: { locale: string }) {
  const data = await getGallery();
  const t = await getTranslations("Gallery");

  const kicker = pick(data?.galleryKicker, locale) || t("kicker");
  const heading = pick(data?.galleryHeading, locale) || t("heading");
  const sub = pick(data?.gallerySubheading, locale) || t("subheading");

  const items = (data?.items ?? []).filter((it) => it.url);

  return (
    <section id="galerija" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:py-28">
      <SectionHeading kicker={kicker} heading={heading} />
      {sub && (
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-center font-body text-ink-muted">
            {sub}
          </p>
        </Reveal>
      )}

      <div className="mt-12 gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3] md:mt-16">
        {items.length
          ? items.map((it, i) => (
              <Reveal key={i} delay={0.03 * (i % 6)} className="mb-4 break-inside-avoid">
                <figure className="overflow-hidden rounded-md border border-line">
                  <Image
                    src={it.url as string}
                    alt={heading}
                    width={it.dim?.width || 800}
                    height={it.dim?.height || 1000}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full"
                  />
                </figure>
              </Reveal>
            ))
          : PLACEHOLDER_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className={`mb-4 break-inside-avoid rounded-md border border-line bg-greige ${h}`}
              />
            ))}
      </div>
    </section>
  );
}
