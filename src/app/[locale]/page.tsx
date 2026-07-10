import { setRequestLocale, getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
      <h1 className="font-serif text-4xl font-medium uppercase tracking-[0.18em] text-gold sm:text-5xl">
        {t("title")}
      </h1>
      <div className="h-px w-16 bg-gold" />
      <p className="font-script text-3xl text-ink-muted sm:text-4xl">
        {t("tagline")}
      </p>
      <LocaleSwitcher />
    </main>
  );
}
