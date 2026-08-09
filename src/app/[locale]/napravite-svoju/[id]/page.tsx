import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getTemplateByIdServer, getConfiguratorOptionsServer } from "@/sanity/serverQueries";
import { getInstagramUrl, getDigitalPrice } from "@/sanity/queries";
import { pickPlain } from "@/sanity/locale";
import { Link } from "@/i18n/navigation";
import { configuratorFontVars } from "../../../fonts";
import SectionHeading from "@/components/sections/SectionHeading";
import Configurator from "@/components/configurator/Configurator";
import DigitalConfigurator from "@/components/configurator/DigitalConfigurator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const template = await getTemplateByIdServer(id);
  const t = await getTranslations("Configurator");
  return { title: pickPlain(template?.name, locale) || t("heading"), description: t("intro") };
}

// One design's configurator (printed = full flow; digital = placeholder until Phase 4).
export default async function DesignPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ tip?: string }>;
}) {
  const { locale, id } = await params;
  const { tip } = await searchParams;
  setRequestLocale(locale);
  const template = await getTemplateByIdServer(id);
  if (!template) notFound();

  const t = await getTranslations("Configurator");
  const g = await getTranslations("Catalog");
  const name = pickPlain(template.name, locale);

  // Every design can be ordered printed OR digital — the customer's choice arrives as ?tip.
  if (tip === "digitalna") {
    const digitalPrice = await getDigitalPrice();

    // Digital is priced → run the real digital flow (text editor → pay 100% → PDF by email).
    if (digitalPrice > 0) {
      return (
        <div className={`${configuratorFontVars} mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 md:pt-36`}>
          <Link
            href="/napravite-svoju"
            className="font-body text-sm text-ink-muted transition-colors hover:text-gold-deep"
          >
            {g("backToGallery")}
          </Link>
          <div className="mt-4">
            <SectionHeading kicker={t("digitalKicker")} heading={name} />
          </div>
          <DigitalConfigurator template={template} digitalPrice={digitalPrice} locale={locale} />
        </div>
      );
    }

    // Not priced yet → keep the showcase fallback (Instagram) so nothing looks broken.
    const instagramUrl = await getInstagramUrl();
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 text-center md:pt-36">
        <SectionHeading kicker={t("kicker")} heading={name} />
        <p className="mx-auto mt-6 max-w-xl font-body text-ink-muted">{g("digitalSoon")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-gold px-6 py-2 font-sans text-sm uppercase tracking-wider text-cream hover:bg-gold-deep"
          >
            Instagram
          </a>
          <Link href="/napravite-svoju" className="rounded-sm border border-line px-6 py-2 font-body text-ink hover:border-gold">
            {g("backToGallery")}
          </Link>
        </div>
      </div>
    );
  }

  const [options, instagramUrl] = await Promise.all([
    getConfiguratorOptionsServer(),
    getInstagramUrl(),
  ]);

  return (
    <div className={`${configuratorFontVars} mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 md:pt-36`}>
      <Link
        href="/napravite-svoju"
        className="font-body text-sm text-ink-muted transition-colors hover:text-gold-deep"
      >
        {g("backToGallery")}
      </Link>
      <div className="mt-4">
        <SectionHeading kicker={t("kicker")} heading={name} />
      </div>
      <Configurator template={template} options={options} instagramUrl={instagramUrl} locale={locale} />
    </div>
  );
}
