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

// Traditional Serbian embroidery (vez) border — the header's bottom "line" (owner's call:
// ethno red/black). One seamless tile (diamond + wax-red center + orange seam beads on two
// black rules) that repeats horizontally at any width. Self-contained SVG (no asset).
const ETNO_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='30'%3E%3Crect width='50' height='30' fill='%23F4ECD7'/%3E%3Crect y='2.5' width='50' height='1.4' fill='%232b2b2b'/%3E%3Crect y='28.6' width='50' height='1.4' fill='%232b2b2b'/%3E%3Crect y='6' width='50' height='0.7' fill='%23C0392B'/%3E%3Crect y='24.5' width='50' height='0.7' fill='%23C0392B'/%3E%3Cpath d='M25 9 L35 16.5 L25 24 L15 16.5 Z' fill='none' stroke='%232b2b2b' stroke-width='1.3'/%3E%3Cpath d='M25 12 L31 16.5 L25 21 L19 16.5 Z' fill='%23C0392B'/%3E%3Ccircle cx='25' cy='16.5' r='1.3' fill='%23F4ECD7'/%3E%3Cpath d='M8 16.5 l5 -3 v6 z' fill='%23E2621F'/%3E%3Cpath d='M42 16.5 l-5 -3 v6 z' fill='%23E2621F'/%3E%3Cpath d='M0 13.5 L3 16.5 L0 19.5 L-3 16.5 Z' fill='%232b2b2b'/%3E%3Cpath d='M50 13.5 L53 16.5 L50 19.5 L47 16.5 Z' fill='%232b2b2b'/%3E%3C/svg%3E\")";

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
      className={`fixed inset-x-0 top-0 z-40 bg-cream/95 backdrop-blur transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_5px_20px_-6px_rgba(32,64,34,0.22)]"
          : "shadow-[0_2px_10px_-4px_rgba(32,64,34,0.14)]"
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

      {/* Ethno vez strip — the header's bottom edge */}
      <div
        aria-hidden
        className="h-[30px] w-full"
        style={{
          backgroundImage: ETNO_TILE,
          backgroundRepeat: "repeat-x",
          backgroundSize: "50px 30px",
          backgroundPosition: "left center",
        }}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 top-[87px] z-40 flex flex-col gap-5 bg-cream px-8 py-10 lg:hidden"
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
