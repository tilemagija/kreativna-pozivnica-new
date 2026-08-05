"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import Reveal from "@/components/motion/Reveal";
import MasonryInfinite from "@/components/gallery/MasonryInfinite";

// World B gallery (showcase → Instagram, §14). Mosaic grid with a starting price under
// each piece; clicking a piece opens an in-page lightbox (NOT a new window) with the
// description, offered dimensions + frames, price and a "Проверите доступност" button
// that goes to Instagram. The lightbox also links to the piece's own indexable page
// (/umetnost/[slug]) — World B is the organic-SEO magnet (§13).
export default function ArtGallery({
  artworks,
  locale,
  instagramUrl,
}: {
  artworks: Artwork[];
  locale: string;
  instagramUrl: string;
}) {
  const t = useTranslations("ArtPage");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const priceLabel = (p?: number) =>
    typeof p === "number" ? `${t("priceFrom")} ${p.toLocaleString("sr-RS")} ${t("currency")}` : "";

  // Lock scroll, close on Escape, restore focus to the trigger when the lightbox closes.
  useEffect(() => {
    if (openIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    const returnTo = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIndex(null);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      returnTo?.focus?.();
    };
  }, [openIndex]);

  const open = openIndex !== null ? artworks[openIndex] : null;

  const nodes = artworks.map((a, i) => {
    const name = pick(a.name, locale);
    return (
      <Reveal key={a.slug || i} delay={0.03 * (i % 3)}>
        <button
          type="button"
          onClick={() => setOpenIndex(i)}
          className="group block w-full overflow-hidden rounded-sm border border-line bg-cream p-1.5 text-left shadow-[0_8px_22px_rgba(59,50,39,0.15)] transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_14px_30px_rgba(59,50,39,0.22)]"
        >
          <figure>
            <Image
              src={a.url as string}
              alt={pick(a.alt, locale) || name}
              width={a.dim?.width || 800}
              height={a.dim?.height || 1000}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full rounded-[2px]"
            />
            <figcaption className="flex items-baseline justify-between gap-3 px-2.5 pb-1 pt-3">
              <span className="font-serif text-base text-ink">{name}</span>
              {priceLabel(a.priceFrom) && (
                <span className="whitespace-nowrap font-body text-sm text-gold-deep">
                  {priceLabel(a.priceFrom)}
                </span>
              )}
            </figcaption>
          </figure>
        </button>
      </Reveal>
    );
  });

  return (
    <>
      <MasonryInfinite items={nodes} />

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={pick(open.name, locale)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm md:items-center"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative my-8 grid w-full max-w-4xl gap-6 rounded-lg border border-line bg-cream p-5 md:grid-cols-2 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label={t("close")}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-xl text-ink shadow-sm transition-colors hover:text-gold"
            >
              ×
            </button>

            <div className="relative overflow-hidden rounded-md border border-line">
              <Image
                src={open.url as string}
                alt={pick(open.alt, locale) || pick(open.name, locale)}
                width={open.dim?.width || 800}
                height={open.dim?.height || 1000}
                sizes="(max-width: 768px) 100vw, 45vw"
                className="h-auto w-full"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-serif text-2xl text-ink">{pick(open.name, locale)}</h2>
                {priceLabel(open.priceFrom) && (
                  <p className="mt-1 font-body text-gold-deep">{priceLabel(open.priceFrom)}</p>
                )}
              </div>

              {pick(open.description, locale) && (
                <p className="font-body text-sm leading-relaxed text-ink-muted">
                  {pick(open.description, locale)}
                </p>
              )}

              {open.dimensions && open.dimensions.length > 0 && (
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
                    {t("dimensions")}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {open.dimensions.map((d) => (
                      <span key={d} className="rounded-sm border border-line px-2.5 py-1 font-body text-sm text-ink">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {open.frames && open.frames.length > 0 && (
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
                    {t("frames")}
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-3">
                    {open.frames.map((f, fi) => (
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

              <div className="mt-auto flex flex-col gap-2 pt-2">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-sm bg-gold px-6 py-3 text-center font-serif text-base italic text-cream transition-colors hover:bg-gold-deep"
                >
                  {t("availability")}
                </a>
                {open.slug && (
                  <Link
                    href={`/umetnost/${open.slug}`}
                    className="text-center font-body text-sm text-ink-muted underline-offset-2 transition-colors hover:text-gold hover:underline"
                  >
                    {t("fullPage")} →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
