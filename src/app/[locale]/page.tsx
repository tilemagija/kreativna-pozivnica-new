import { setRequestLocale } from "next-intl/server";
import IntroOverlay from "@/components/intro/IntroOverlay";
import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
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
      <WhyUs locale={locale} />
      <SocialProof locale={locale} />
    </>
  );
}
