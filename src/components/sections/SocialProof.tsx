import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getSocial } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import { urlFor } from "@/sanity/lib/image";
import SectionHeading from "./SectionHeading";
import Counter from "./Counter";
import PackagesDrop from "./PackagesDrop";
import PhoneMockup from "./PhoneMockup";
import UtisciGrid from "./UtisciGrid";
import Reveal from "@/components/motion/Reveal";

type ImgLike = Parameters<typeof urlFor>[0];

// "Postanite deo priče" — the social-proof band. A faint sepia watercolour (couple +
// church) washes the background; content sits on warm paper with dark ink text. Three
// columns: phone Instagram grid · counter + falling package photos · testimonials.
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

  const handle = (data?.instagramHandle || "kreativna_pozivnica").replace(/^@/, "");
  const igUrl = `https://instagram.com/${handle}`;
  const igShot = data?.instagramScreenshot?.asset?._ref
    ? urlFor(data.instagramScreenshot as ImgLike).width(600).url()
    : undefined;

  // "Утисци" — upright screenshots/photos; thumb for the grid, larger for the lightbox.
  const utisci = (data?.utisci ?? [])
    .filter((img) => img?.asset?._ref)
    .map((img) => ({
      thumb: urlFor(img as ImgLike).width(400).height(520).fit("crop").url(),
      full: urlFor(img as ImgLike).width(1400).fit("max").url(),
    }));

  return (
    <section className="relative isolate overflow-hidden bg-paper py-20 text-ink md:py-28">
      <Image
        src="/pozadina4.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-20"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading kicker={kicker} heading={heading} tone="dark" />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-3 lg:items-start lg:gap-8">
          {/* Left — Утисци (image grid → lightbox) */}
          <Reveal>
            <UtisciGrid items={utisci} kicker={tKicker} heading={tHeading} />
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

          {/* Right — phone (Instagram profile) */}
          <Reveal className="flex justify-center lg:justify-end">
            <PhoneMockup
              tiles={tiles}
              handle={data?.instagramHandle}
              screenshot={igShot}
              href={igUrl}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
