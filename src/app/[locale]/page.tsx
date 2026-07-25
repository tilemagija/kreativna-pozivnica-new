import { setRequestLocale } from "next-intl/server";
// import IntroOverlay from "@/components/intro/IntroOverlay"; // TEMP hidden (hero revamp)
import Hero from "@/components/sections/Hero";
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
      {/* TEMP (hero revamp): intro overlay hidden so the hero image is the first thing. Re-enable to revert. */}
      {/* <IntroOverlay /> */}
      <Hero locale={locale} />
      <Gallery locale={locale} />
      <WhyUs locale={locale} />
      <About locale={locale} />
      <SocialProof locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
