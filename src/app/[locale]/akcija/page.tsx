import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getSalePage, getSales } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "@/components/sections/SectionHeading";
import Reveal from "@/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [data, t] = [await getSalePage(), await getTranslations("SalePage")];
  const title = pick(data?.seoTitle, locale) || pick(data?.heading, locale) || t("heading");
  const description =
    pick(data?.seoDescription, locale) || pick(data?.intro, locale) || t("intro");
  return { title, description };
}

export default async function AkcijaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SalePage");
  const [data, sales] = await Promise.all([getSalePage(), getSales()]);

  const kicker = pick(data?.kicker, locale) || t("kicker");
  const heading = pick(data?.heading, locale) || t("heading");
  const intro = pick(data?.intro, locale) || t("intro");

  // Hide items with a past "validUntil" (compare against start of today).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const items = sales.filter(
    (s) => s.url && (!s.validUntil || new Date(s.validUntil) >= today),
  );

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale === "en" ? "en-US" : "sr-RS");

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 md:pt-36">
      <SectionHeading kicker={kicker} heading={heading} />
      <Reveal delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body leading-relaxed text-ink-muted">
          {intro}
        </p>
      </Reveal>

      {items.length ? (
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {items.map((s, i) => (
            <Reveal key={i} delay={0.04 * (i % 3)}>
              <article className="flex flex-col overflow-hidden rounded-md border border-line bg-cream">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={s.url as string}
                    alt={pick(s.alt, locale) || pick(s.title, locale)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {s.discountPercent ? (
                    <span className="absolute right-3 top-3 rounded-full bg-terracotta px-3 py-1 font-serif text-sm text-cream shadow-md">
                      −{s.discountPercent}%
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="font-serif text-xl text-ink">{pick(s.title, locale)}</h2>
                  {pick(s.description, locale) && (
                    <p className="font-body text-sm leading-relaxed text-ink-muted">
                      {pick(s.description, locale)}
                    </p>
                  )}
                  {s.validUntil && (
                    <p className="mt-auto pt-2 font-sans text-xs uppercase tracking-wider text-sage-deep">
                      {t("until")} {fmt(s.validUntil)}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center font-body text-ink-muted">{t("empty")}</p>
      )}
    </div>
  );
}
