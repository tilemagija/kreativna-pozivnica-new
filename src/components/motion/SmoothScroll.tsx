"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Global smooth scroll. Disabled when the user prefers reduced motion.
// Same-page hash links (e.g. the hero's „Хајде да се упознамо" → #galerija) use the
// native anchor jump; the target sections carry `scroll-mt` so the fixed header never
// covers them.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis();
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
