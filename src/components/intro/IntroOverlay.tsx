"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

// Signature "otvaranje pozivnice" intro (CLAUDE.md §12), driven by the brand's own
// rendered video: the sealed envelope (first frame) → click → the wax seal lifts and
// the flap opens → a light bloom masks the cut to the hero underneath.
// - The real page stays server-rendered UNDERNEATH (SEO-safe); this is only a cover.
// - Shows once per session (sessionStorage), skippable by button/keyboard.
// - Reduced-motion: no video playback, click enters instantly. Never traps.
const SEEN_KEY = "kp-intro-seen";

type State = "cover" | "playing" | "revealing" | "closed";

export default function IntroOverlay() {
  const reduce = useReducedMotion();
  const t = useTranslations("Intro");
  const videoRef = useRef<HTMLVideoElement>(null);
  const coverRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<State>("cover");

  // Already opened it this session → skip straight to the page.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) setState("closed");
    } catch {
      /* storage blocked → show the cover */
    }
  }, []);

  // Lock background scroll + focus the cover for keyboard users while it's up.
  useEffect(() => {
    if (state === "closed") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (state === "cover") coverRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state === "closed") return null;

  const markSeen = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  // Leave the overlay: fade out (bloom masks the cut), or instant for reduced motion.
  const dismiss = () => {
    markSeen();
    setState(reduce ? "closed" : "revealing");
  };

  const open = () => {
    if (reduce) return dismiss();
    setState("playing");
    videoRef.current?.play().catch(dismiss);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-cream"
      initial={false}
      animate={{ opacity: state === "revealing" ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (state === "revealing") setState("closed");
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/intro/otvaranje.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
      />

      {state === "cover" && (
        <button
          ref={coverRef}
          type="button"
          onClick={open}
          aria-label={t("aria")}
          className="group absolute inset-0 flex flex-col items-center justify-end pb-[14vh] focus:outline-none"
        >
          <span className="rounded-full bg-cream/70 px-6 py-2 font-serif text-xs uppercase tracking-[0.3em] text-ink backdrop-blur-sm transition-colors group-hover:text-gold sm:text-sm">
            {t("prompt")}
          </span>
        </button>
      )}

      {state === "playing" && (
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full bg-cream/70 px-4 py-1.5 font-sans text-xs uppercase tracking-widest text-ink-muted backdrop-blur-sm transition-colors hover:text-gold"
        >
          {t("skip")}
        </button>
      )}
    </motion.div>
  );
}
