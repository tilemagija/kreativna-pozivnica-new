import { setRequestLocale } from "next-intl/server";
import IntroOverlay from "@/components/intro/IntroOverlay";
import Hero from "@/components/sections/Hero";
import TrakaDivider from "@/components/site/TrakaDivider";
import Gallery from "@/components/sections/Gallery";
import WhyUs from "@/components/sections/WhyUs";
import About from "@/components/sections/About";
import SocialProof from "@/components/sections/SocialProof";
import Contact from "@/components/sections/Contact";

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
      <Gallery locale={locale} />
      <WhyUs locale={locale} />
      <About locale={locale} />
      <SocialProof locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
