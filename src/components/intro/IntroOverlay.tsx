"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Lotus from "@/components/brand/Lotus";

// Signature "otvaranje pozivnice" cover (CLAUDE.md §12).
// - The real page is server-rendered UNDERNEATH this layer (SEO-safe): this is only
//   a visual cover, never a gate that hides content from crawlers.
// - Shows once per browser session (sessionStorage), skippable by click or keyboard.
// - Respects prefers-reduced-motion (instant, no animation) and never traps the user.
const SEEN_KEY = "kp-intro-seen";

export default function IntroOverlay() {
  const reduce = useReducedMotion();
  const t = useTranslations("Intro");
  const btnRef = useRef<HTMLButtonElement>(null);
  // Cover is shown by default so first-time visitors see the closed invitation with
  // no flash of the hero. SSR and first client render agree → no hydration mismatch.
  const [state, setState] = useState<"open" | "closing" | "closed">("open");

  // Already opened it this session → remove instantly, no animation.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) setState("closed");
    } catch {
      /* private mode / storage blocked → just show the cover */
    }
  }, []);

  // Lock background scroll while the cover is up; focus the cover for keyboard users.
  useEffect(() => {
    if (state === "closed") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    btnRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
    };
  }, [state]);

  if (state === "closed") return null;

  const open = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setState(reduce ? "closed" : "closing");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-cream"
      initial={false}
      animate={
        state === "closing"
          ? { opacity: 0, y: -18, scale: 1.03 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (state === "closing") setState("closed");
      }}
      style={{
        backgroundImage:
          "radial-gradient(120% 120% at 50% 35%, transparent 55%, rgba(146,119,65,0.10) 100%)",
      }}
    >
      <button
        ref={btnRef}
        type="button"
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Escape") open();
        }}
        aria-label={t("aria")}
        className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-6 px-6 text-center focus:outline-none"
      >
        {/* Inset double-line frame — the "card" feel */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-sm border border-line sm:inset-8"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-6 rounded-sm border border-gold/30 sm:inset-10"
        />

        <span className="font-script text-2xl text-sage-deep sm:text-3xl">
          {t("welcome")}
        </span>

        <motion.span
          aria-hidden="true"
          className="text-gold"
          animate={reduce || state === "closing" ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lotus className="h-16 w-24 sm:h-20 sm:w-32" />
        </motion.span>

        <span className="h-px w-12 bg-gold/60" />

        <span className="font-serif text-xs uppercase tracking-[0.3em] text-ink-muted transition-colors group-hover:text-gold sm:text-sm">
          {t("prompt")}
        </span>
      </button>
    </motion.div>
  );
}
