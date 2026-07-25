"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";

// Fixed header (ethno/vintage). A real Serbian embroidery (vez) band sits on top
// (seamless mirror-tiled). No logo — the nav links are centered; language +
// „Дизајнирајте сами" stay on the right. The hero starts BELOW the header (no overlap).
const NAV_ITEMS = [
  { href: "/nastanak", key: "nastanak" },
  { href: "/umetnost", key: "art" },
  { href: "/dodaci", key: "dodaci" },
  { href: "/prilagodite", key: "prilagodite" },
] as const;

// Top vez band — one clean repeating unit cropped from the owner's embroidery photo between
// two cream gaps, so it tiles across any width with NO breaks (cream meets cream at the seam).
const TRAKA_VRH = "url(/traka-tile.png)";

export default function Header() {
  const t = useTranslations("Nav");
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll detection via IntersectionObserver on a tiny sentinel at the very top of the
  // page. Lenis (smooth scroll) suppresses native "scroll" events, so we watch a real
  // element's position instead — reliable regardless of how scrolling is driven.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;height:8px;width:1px;pointer-events:none;opacity:0;";
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
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
          ? "bg-cream/95 backdrop-blur shadow-[0_5px_20px_-6px_rgba(32,64,34,0.22)]"
          : "bg-transparent"
      }`}
    >
      {/* Top vez strip — hidden over the hero (transparent nav), slides in on scroll */}
      <div
        aria-hidden
        className={`w-full overflow-hidden transition-[height,opacity] duration-300 ${
          scrolled || menuOpen ? "h-10 opacity-100" : "h-0 opacity-0"
        }`}
        style={{
          backgroundImage: TRAKA_VRH,
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 40px",
          backgroundPosition: "center",
        }}
      />

      <nav className="relative mx-auto flex w-full max-w-[1440px] items-center px-5 py-3 md:px-8">
        {/* Centered nav links (desktop) */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-[13px] text-ink-muted lg:flex">
          <li>
            <Link
              href="/akcija"
              className="akcija-link font-serif text-[15px] italic tracking-wide"
            >
              {t("akcija")}
            </Link>
          </li>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="whitespace-nowrap transition-colors hover:text-forest">
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right cluster (desktop): language + CTA */}
        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <LocaleSwitcher />
          <Link
            href="/napravite-svoju"
            className="whitespace-nowrap rounded-sm bg-gold px-5 py-2 font-serif text-sm italic text-cream transition-colors hover:bg-gold-deep"
          >
            {t("configurator")}
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={t(menuOpen ? "close" : "menu")}
          className="ml-auto flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-ink lg:hidden"
        >
          <span className={`h-px w-6 bg-current transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-current transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 top-[104px] z-40 flex flex-col gap-5 bg-cream px-8 py-10 lg:hidden"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Link href="/akcija" onClick={close} className="akcija-link w-fit font-serif text-3xl italic">
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
