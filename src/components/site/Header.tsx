"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";

// Fixed header. Has its OWN surface + bottom border + soft shadow from the start (a clear
// "razdelnik" so it never gets lost on the parchment page). Logo image + wordmark sit far
// left; links + language + CTA on the right. Labels kept short so sr and en both fit ONE row.
// Mobile/tablet: logo + hamburger → full-screen menu.
const NAV_ITEMS = [
  { href: "/nastanak", key: "nastanak" },
  { href: "/umetnost", key: "art" },
  { href: "/dodaci", key: "dodaci" },
  { href: "/prilagodite", key: "prilagodite" },
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
      className={`fixed inset-x-0 top-0 z-40 border-b border-gold/25 bg-cream/95 backdrop-blur transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_4px_20px_-6px_rgba(32,64,34,0.20)]"
          : "shadow-[0_1px_10px_-4px_rgba(32,64,34,0.12)]"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-2.5 md:px-8">
        {/* Logo + wordmark — far left */}
        <Link href="/" onClick={close} className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Креативна позивница"
            width={267}
            height={220}
            priority
            className="h-10 w-auto lg:h-11"
          />
          <span className="font-serif text-[15px] font-medium uppercase tracking-[0.13em] text-forest lg:text-base">
            Креативна позивница
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {/* Акција — accented, festive on hover */}
          <Link
            href="/akcija"
            className="akcija-link hidden font-serif text-[15px] italic tracking-wide lg:inline-block"
          >
            {t("akcija")}
          </Link>

          <ul className="hidden items-center gap-5 text-[13px] text-ink-muted lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="whitespace-nowrap transition-colors hover:text-forest">
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
            className="hidden whitespace-nowrap rounded-sm bg-gold px-5 py-2 font-serif text-sm italic text-cream transition-colors hover:bg-gold-deep lg:inline-block"
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
            className="fixed inset-0 top-[57px] z-40 flex flex-col gap-5 bg-cream px-8 py-10 lg:hidden"
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
                    className="font-serif text-2xl text-ink transition-colors hover:text-forest"
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
