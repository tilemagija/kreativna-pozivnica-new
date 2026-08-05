import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getGallery } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "./SectionHeading";
import Reveal from "@/components/motion/Reveal";
import MasonryInfinite from "@/components/gallery/MasonryInfinite";

// Invitations gallery (the moat, §11a: varied sizes, not a uniform grid). Images come from
// Sanity and are matted like photographs on the linen field. Rendering + batch-on-scroll
// loading is handled by MasonryInfinite; here we just build the nodes. Tasteful placeholder
// tiles show while the gallery is empty.
const PLACEHOLDER_HEIGHTS = ["h-64", "h-80", "h-56", "h-72", "h-96", "h-60"];

export default async function Gallery({ locale }: { locale: string }) {
  const data = await getGallery();
  const t = await getTranslations("Gallery");

  const kicker = pick(data?.galleryKicker, locale) || t("kicker");
  const heading = pick(data?.galleryHeading, locale) || t("heading");
  const sub = pick(data?.gallerySubheading, locale) || t("subheading");

  const items = (data?.items ?? []).filter((it) => it.url);

  const nodes = items.map((it, i) => (
    <Reveal key={i} delay={0.03 * (i % 3)}>
      <figure className="rounded-sm border border-line bg-cream p-1.5 shadow-[0_8px_22px_rgba(59,50,39,0.18)] transition-transform duration-300 hover:-translate-y-1">
        <Image
          src={it.url as string}
          alt={heading}
          width={it.dim?.width || 800}
          height={it.dim?.height || 1000}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-auto w-full rounded-[2px]"
        />
      </figure>
    </Reveal>
  ));

  return (
    <section id="galerija" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 md:py-24">
      <SectionHeading kicker={kicker} heading={heading} />
      {sub && (
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-center font-body text-ink-muted">
            {sub}
          </p>
        </Reveal>
      )}

      {nodes.length ? (
        <MasonryInfinite items={nodes} />
      ) : (
        <div className="mt-12 flex items-start gap-4 md:mt-16">
          {[0, 1, 2].map((c) => (
            <div key={c} className="flex flex-1 flex-col gap-4">
              {PLACEHOLDER_HEIGHTS.filter((_, i) => i % 3 === c).map((h, i) => (
                <div key={i} className={`rounded-sm border border-line bg-greige ${h}`} />
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
