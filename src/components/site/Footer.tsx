import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-greige">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center">
        <p className="font-serif text-lg font-medium uppercase tracking-[0.15em] text-gold">
          Креативна позивница
        </p>
        <p className="font-script text-2xl text-sage">{t("tagline")}</p>
        <a
          href="https://www.instagram.com/kreativna_pozivnica/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink-muted transition-colors hover:text-gold"
        >
          @kreativna_pozivnica
        </a>
        <p className="mt-2 text-xs text-ink-muted">
          © {year} · {t("rights")}
        </p>
      </div>
    </footer>
  );
}
