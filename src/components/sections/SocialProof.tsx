import { getTranslations } from "next-intl/server";
import { getSocial } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import { urlFor } from "@/sanity/lib/image";
import SectionHeading from "./SectionHeading";
import Counter from "./Counter";
import PackagesDrop from "./PackagesDrop";
import PhoneMockup from "./PhoneMockup";
import Reveal from "@/components/motion/Reveal";

type ImgLike = Parameters<typeof urlFor>[0];

// "Postanite deo priče" — the social-proof band (deep green). Three columns:
// phone Instagram grid · counter + falling package photos · testimonials ("Utisci").
// Everything from Sanity with graceful placeholders while content is being added.
export default async function SocialProof({ locale }: { locale: string }) {
  const data = await getSocial();
  const t = await getTranslations("SocialProof");

  const kicker = pick(data?.socialKicker, locale) || t("kicker");
  const heading = pick(data?.socialHeading, locale) || t("heading");
  const counterLabel = pick(data?.counterLabel, locale) || t("counterLabel");
  const counterTagline = pick(data?.counterTagline, locale) || t("counterTagline");
  const tKicker = pick(data?.testimonialsKicker, locale) || t("testimonialsKicker");
  const tHeading = pick(data?.testimonialsHeading, locale) || t("testimonialsHeading");

  const packages = (data?.packageImages ?? [])
    .filter((img) => img?.asset?._ref)
    .map((img) => ({
      url: urlFor(img as ImgLike).width(420).height(320).fit("crop").url(),
      alt: pick(img?.alt, locale) || heading,
    }));

  const tiles = (data?.instagramImages ?? [])
    .filter((img) => img?.asset?._ref)
    .map((img) => ({
      url: urlFor(img as ImgLike).width(240).height(240).fit("crop").url(),
      alt: "Instagram",
    }));

  const testimonials = (data?.testimonials ?? []).filter(
    (item) => pick(item.quote, locale) || item.authorName,
  );
  // Show real testimonials, or 4 placeholder cards while none are added yet.
  const cards: (typeof testimonials[number] | null)[] = testimonials.length
    ? testimonials
    : [null, null, null, null];

  return (
    <section className="bg-forest py-20 text-cream md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading kicker={kicker} heading={heading} tone="light" />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-3 lg:items-start lg:gap-8">
          {/* Left — phone */}
          <Reveal className="flex justify-center lg:justify-start">
            <PhoneMockup tiles={tiles} handle={data?.instagramHandle} />
          </Reveal>

          {/* Center — packages + counter */}
          <div className="flex flex-col gap-8">
            <PackagesDrop images={packages} />
            <Counter
              target={data?.counterTarget ?? 2000}
              suffix={data?.counterSuffix ?? "+"}
              label={counterLabel}
              tagline={counterTagline}
              locale={locale}
            />
          </div>

          {/* Right — testimonials */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1 text-center lg:items-start lg:text-left">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-sage">
                {tKicker}
              </span>
              <h3 className="font-script text-3xl text-cream">{tHeading}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cards.map(
                (item, i) => {
                  const quote = item ? pick(item.quote, locale) : "";
                  return (
                    <Reveal
                      key={i}
                      delay={0.05 * i}
                      className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <span className="font-serif text-2xl leading-none text-gold">“</span>
                      {quote ? (
                        <>
                          <p className="line-clamp-4 font-body text-sm leading-relaxed text-greige">
                            {quote}
                          </p>
                          <span className="mt-auto font-sans text-xs text-sage">
                            {item?.authorName}
                            {item?.authorDetail
                              ? ` · ${pick(item.authorDetail, locale)}`
                              : ""}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col gap-1.5 py-2">
                          <span className="h-2 w-4/5 rounded bg-white/10" />
                          <span className="h-2 w-3/5 rounded bg-white/10" />
                        </div>
                      )}
                    </Reveal>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
