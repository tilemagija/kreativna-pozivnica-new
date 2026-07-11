import { setRequestLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/motion/Reveal";
import IntroOverlay from "@/components/intro/IntroOverlay";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <>
      <IntroOverlay />
      <section className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <Reveal>
        <h1 className="font-serif text-5xl font-medium uppercase tracking-[0.18em] text-gold sm:text-6xl">
          {t("title")}
        </h1>
      </Reveal>
      <div className="h-px w-16 bg-gold" />
      <Reveal delay={0.1}>
        <p className="font-script text-3xl text-ink-muted sm:text-4xl">
          {t("tagline")}
        </p>
      </Reveal>
      </section>
    </>
  );
}
