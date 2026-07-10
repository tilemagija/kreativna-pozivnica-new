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
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-10 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-lg text-zinc-600">{t("tagline")}</p>
      <LocaleSwitcher />
    </main>
  );
}
