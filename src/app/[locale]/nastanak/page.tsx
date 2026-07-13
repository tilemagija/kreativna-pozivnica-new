import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getNastanak } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "@/components/sections/SectionHeading";
import Reveal from "@/components/motion/Reveal";

// Extract the 11-char YouTube id from any common link shape (or a raw id).
function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|watch\?v=|embed\/|shorts\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(url) ? url : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [data, t] = [await getNastanak(), await getTranslations("Nastanak")];
  const title = pick(data?.seoTitle, locale) || pick(data?.heading, locale) || t("heading");
  const description =
    pick(data?.seoDescription, locale) || pick(data?.intro, locale) || t("intro");
  return { title, description };
}

export default async function NastanakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Nastanak");
  const data = await getNastanak();

  const kicker = pick(data?.kicker, locale) || t("kicker");
  const heading = pick(data?.heading, locale) || t("heading");
  const intro = pick(data?.intro, locale) || t("intro");

  const videos = (data?.videos ?? [])
    .map((v) => ({
      id: youtubeId(v.youtube),
      title: pick(v.title, locale),
      description: pick(v.description, locale),
    }))
    .filter((v) => v.id);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 md:pt-36">
      <SectionHeading kicker={kicker} heading={heading} />
      <Reveal delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body leading-relaxed text-ink-muted">
          {intro}
        </p>
      </Reveal>

      {videos.length ? (
        <div className="mt-14 flex flex-col gap-14 md:mt-20">
          {videos.map((v, i) => (
            <Reveal key={i} delay={0.05}>
              <figure className="flex flex-col gap-3">
                <div className="relative aspect-video overflow-hidden rounded-md border border-line">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    title={v.title || heading}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                {(v.title || v.description) && (
                  <figcaption className="text-center">
                    {v.title && <h2 className="font-serif text-xl text-ink">{v.title}</h2>}
                    {v.description && (
                      <p className="mt-1 font-body text-sm text-ink-muted">{v.description}</p>
                    )}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center font-body text-ink-muted">{t("empty")}</p>
      )}
    </div>
  );
}
