import { setRequestLocale } from "next-intl/server";
import IntroOverlay from "@/components/intro/IntroOverlay";
import Hero from "@/components/sections/Hero";
import TrakaDivider from "@/components/site/TrakaDivider";
import NaseUsluge from "@/components/sections/NaseUsluge";
import WhyUs from "@/components/sections/WhyUs";
import About from "@/components/sections/About";
import SocialProof from "@/components/sections/SocialProof";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <IntroOverlay />
      <Hero locale={locale} />
      <TrakaDivider />
      <NaseUsluge locale={locale} />
      <TrakaDivider src="/traka2-tile.png" />
      <WhyUs locale={locale} />
      <TrakaDivider src="/traka3-tile.png" />
      <About locale={locale} />
      <TrakaDivider src="/traka4-tile.png" />
      <SocialProof locale={locale} />
    </>
  );
}
