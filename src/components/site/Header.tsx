"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import Confetti from "@/components/site/Confetti";

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

// One place for the link look, so desktop and the mobile sheet can never drift apart.
// Hover is a filled parchment rectangle with a gold underline — it should read as a button,
// not as a text link (owner's ask #6).
const NAV_LINK =
  "inline-block whitespace-nowrap rounded-sm px-3 py-2.5 font-nav text-[15px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 hover:bg-greige hover:shadow-[inset_0_-2px_0_var(--c-gold)] xl:px-4";

// „Акција" opts out of that treatment entirely: its own foreign font in a gold chip, plus
// the confetti burst. It is meant to break the pattern, not follow it.
const AKCIJA_LINK =
  "inline-block whitespace-nowrap rounded-sm bg-gold px-4 py-2 font-akcija text-[17px] uppercase tracking-[0.04em] text-cream shadow-[0_2px_10px_rgba(176,141,87,0.5)] transition-colors duration-200 hover:bg-gold-deep";

export default function Header() {
  const t = useTranslations("Nav");
  const reduce = useReducedMotion();
  const pathname = usePathname();
  // On the landing page „Почетна" points at the page you are already on — it only takes
  // space in a bar that is already tight (owner's ask #4).
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll detection — belt-and-suspenders so the transparent→cream switch can never
  // silently fail. Two independent signals both drive `scrolled`, whichever fires:
  //  1. A native passive "scroll" listener. Lenis runs in default (window) mode here, so
  //     real scroll events DO fire in the browser.
  //  2. An IntersectionObserver on a tiny sentinel at the very top of the page, as a
  //     fallback for any environment where scroll events are throttled.
  // (Both are throttled together only in a backgrounded/headless tab — a tooling quirk,
  // not something a real visitor hits.)
  useEffect(() => {
    const PAST = 8; // px scrolled before the header switches
    const onScroll = () => setScrolled(window.scrollY > PAST);
    onScroll(); // sync initial state (e.g. reload while already scrolled)
    window.addEventListener("scroll", onScroll, { passive: true });

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
      window.removeEventListener("scroll", onScroll);
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
        {/* Desktop links — spread across the whole bar rather than clustered in the middle,
            which left most of the width empty (owner's ask #5). */}
        <ul className="hidden flex-1 items-center justify-between gap-1 text-ink lg:flex">
          {!isHome && (
            <li>
              <Link href="/" className={NAV_LINK}>
                {t("home")}
              </Link>
            </li>
          )}
          <li>
            <Confetti>
              <Link href="/akcija" className={AKCIJA_LINK}>
                {t("akcija")}
              </Link>
            </Confetti>
          </li>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={NAV_LINK}>
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right cluster (desktop): CTA. Language moved out of the nav entirely — it now
            lives in the slip pinned to the bottom of the viewport (LanguageSlip). */}
        <div className="ml-6 hidden items-center gap-4 lg:flex">
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
            {!isHome && (
              <Link
                href="/"
                onClick={close}
                className="w-fit font-nav text-2xl font-bold uppercase tracking-[0.1em] text-ink"
              >
                {t("home")}
              </Link>
            )}
            <Link
              href="/akcija"
              onClick={close}
              className="w-fit rounded-sm bg-gold px-5 py-2.5 font-akcija text-xl uppercase tracking-[0.04em] text-cream"
            >
              {t("akcija")}
            </Link>
            <ul className="flex flex-col gap-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="font-nav text-2xl font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:text-forest"
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
