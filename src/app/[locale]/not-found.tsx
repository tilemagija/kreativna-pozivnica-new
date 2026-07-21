import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Lotus from "@/components/brand/Lotus";

// Branded 404. Rendered inside the locale layout (Header/Footer + translations),
// so a lost visitor stays on-brand and gets clear ways back. Reached via the
// catch-all page ([...rest]) and any notFound() call within a valid locale.
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex items-center gap-3 text-gold">
        <span className="h-px w-10 bg-gold/40" />
        <Lotus className="h-8 w-12" />
        <span className="h-px w-10 bg-gold/40" />
      </div>

      <span className="font-sans text-xs uppercase tracking-[0.3em] text-sage-deep">
        {t("kicker")}
      </span>
      <h1 className="max-w-xl font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
        {t("heading")}
      </h1>
      <p className="max-w-md font-body leading-relaxed text-ink-muted">{t("text")}</p>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-sm bg-gold px-7 py-3 font-serif text-base italic text-cream transition-colors hover:bg-gold-deep"
        >
          {t("home")}
        </Link>
        <Link
          href="/napravite-svoju"
          className="rounded-sm border border-gold px-7 py-3 font-serif text-base italic text-gold-deep transition-colors hover:bg-gold hover:text-cream"
        >
          {t("configurator")}
        </Link>
      </div>
    </section>
  );
}
