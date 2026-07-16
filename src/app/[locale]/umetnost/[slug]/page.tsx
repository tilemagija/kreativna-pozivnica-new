import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArtworkBySlug, getArtworkSlugs, getInstagramUrl } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import { SITE_URL } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";

// Per-artwork indexable page (World B = organic-SEO magnet, §13): unique metadata,
// descriptive image, dimensions/frames/price as real text + CreativeWork structured data.
// Showcase → Instagram ("Проверите доступност"); no checkout (§14).
export async function generateStaticParams() {
  const slugs = await getArtworkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const art = await getArtworkBySlug(slug);
  if (!art) return {};
  const name = pick(art.name, locale);
  const description = pick(art.description, locale) || name;
  return {
    title: name,
    description,
    alternates: { canonical: `${SITE_URL}${locale === "en" ? "/en" : ""}/umetnost/${slug}` },
    openGraph: art.url
      ? { title: name, description, images: [{ url: art.url }], type: "article" }
      : { title: name, description, type: "article" },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [art, t, instagramUrl] = await Promise.all([
    getArtworkBySlug(slug),
    getTranslations("ArtPage"),
    getInstagramUrl(),
  ]);
  if (!art) notFound();

  const name = pick(art.name, locale);
  const description = pick(art.description, locale);
  const priceLabel =
    typeof art.priceFrom === "number"
      ? `${t("priceFrom")} ${art.priceFrom.toLocaleString("sr-RS")} ${t("currency")}`
      : "";

  // Structured data: CreativeWork + a "from" price (AggregateOffer.lowPrice) when set —
  // honest about the price being a starting guide, not a fixed checkout amount.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    ...(description ? { description } : {}),
    ...(art.url ? { image: art.url } : {}),
    ...(typeof art.priceFrom === "number"
      ? {
          offers: {
            "@type": "AggregateOffer",
            lowPrice: art.priceFrom,
            priceCurrency: "RSD",
          },
        }
      : {}),
  };

  return (
    <div data-world="b" className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/umetnost"
        className="font-body text-sm text-ink-muted transition-colors hover:text-gold"
      >
        ← {t("heading")}
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <Reveal className="overflow-hidden rounded-lg border border-line">
          {art.url && (
            <Image
              src={art.url}
              alt={pick(art.alt, locale) || name}
              width={art.dim?.width || 800}
              height={art.dim?.height || 1000}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="h-auto w-full"
              priority
            />
          )}
        </Reveal>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-serif text-3xl leading-tight text-ink md:text-4xl">{name}</h1>
            {priceLabel && <p className="mt-2 font-body text-lg text-gold-deep">{priceLabel}</p>}
          </div>

          {description && (
            <p className="font-body leading-relaxed text-ink-muted">{description}</p>
          )}

          {art.dimensions && art.dimensions.length > 0 && (
            <div>
              <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
                {t("dimensions")}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {art.dimensions.map((d) => (
                  <span key={d} className="rounded-sm border border-line px-2.5 py-1 font-body text-sm text-ink">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {art.frames && art.frames.length > 0 && (
            <div>
              <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
                {t("frames")}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-3">
                {art.frames.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 font-body text-sm text-ink">
                    {f.swatchUrl && (
                      <Image
                        src={f.swatchUrl}
                        alt={pick(f.name, locale)}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full border border-line object-cover"
                      />
                    )}
                    {pick(f.name, locale)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto pt-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-sm bg-gold px-7 py-3 font-serif text-base italic text-cream transition-colors hover:bg-gold-deep"
            >
              {t("availability")}
            </a>
          </div>
        </div>
      </div>

      {art.gallery && art.gallery.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-16 md:grid-cols-4">
          {art.gallery
            .filter((g) => g.url)
            .map((g, gi) => (
              <Reveal key={gi} delay={0.03 * (gi % 4)} className="overflow-hidden rounded-md border border-line">
                <Image
                  src={g.url as string}
                  alt={`${name} — ${gi + 1}`}
                  width={g.dim?.width || 600}
                  height={g.dim?.height || 600}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="h-full w-full object-cover"
                />
              </Reveal>
            ))}
        </div>
      )}
    </div>
  );
}
