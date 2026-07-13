"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import Lotus from "@/components/brand/Lotus";

// Fixed header: transparent over the hero, gains a soft cream backdrop once scrolled.
// Desktop: logo left, links right. Mobile/tablet: logo + hamburger → full-screen menu.
// "Акција" (first) and "Дизајнирајте сами" (last) are the two accented, eye-catching items.
// Nav links lead ONLY to separate pages. Landing scroll-sections (about/gallery/contact)
// are NOT in the nav by design.
const NAV_ITEMS = [
  { href: "/nastanak", key: "nastanak" },
  { href: "/umetnost", key: "art" },
] as const;

export default function Header() {
  const t = useTranslations("Nav");
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-line bg-cream/85 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" onClick={close} className="flex items-center gap-2 text-gold">
          <Lotus className="h-6 w-9" />
          <span className="font-serif text-lg font-medium uppercase tracking-[0.15em]">
            Креативна позивница
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Акција — accented, festive on hover */}
          <Link
            href="/akcija"
            className="akcija-link hidden font-serif text-[15px] italic tracking-wide lg:inline-block"
          >
            {t("akcija")}
          </Link>

          <ul className="hidden items-center gap-6 text-sm text-ink-muted lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <LocaleSwitcher />
          </div>

          <Link
            href="/napravite-svoju"
            className="hidden rounded-sm bg-gold px-5 py-2 font-serif text-sm italic text-cream transition-colors hover:bg-gold-deep lg:inline-block"
          >
            {t("configurator")}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={t(menuOpen ? "close" : "menu")}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-ink lg:hidden"
          >
            <span className={`h-px w-6 bg-current transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 bg-current transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 top-[65px] z-40 flex flex-col gap-5 bg-cream px-8 py-10 lg:hidden"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Link
              href="/akcija"
              onClick={close}
              className="akcija-link w-fit font-serif text-3xl italic"
            >
              {t("akcija")}
            </Link>
            <ul className="flex flex-col gap-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="font-serif text-2xl text-ink transition-colors hover:text-gold"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/napravite-svoju"
              onClick={close}
              className="mt-2 inline-block w-fit rounded-sm bg-gold px-6 py-3 font-serif text-lg italic text-cream"
            >
              {t("configurator")}
            </Link>
            <div className="mt-2">
              <LocaleSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
