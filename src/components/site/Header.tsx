import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function Header() {
  const t = await getTranslations("Nav");

  return (
    <header className="border-b border-line bg-cream/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="font-serif text-lg font-medium uppercase tracking-[0.15em] text-gold"
        >
          Креативна позивница
        </Link>

        <ul className="hidden gap-6 text-sm text-ink-muted md:flex">
          <li>
            <Link href="/napravite-svoju" className="transition-colors hover:text-gold">
              {t("configurator")}
            </Link>
          </li>
          <li>
            <Link href="/kako-se-pravi" className="transition-colors hover:text-gold">
              {t("howItsMade")}
            </Link>
          </li>
          <li>
            <Link href="/umetnost" className="transition-colors hover:text-gold">
              {t("art")}
            </Link>
          </li>
          <li>
            <Link href="/kontakt" className="transition-colors hover:text-gold">
              {t("contact")}
            </Link>
          </li>
        </ul>

        <LocaleSwitcher />
      </nav>
    </header>
  );
}
