"use client";

import { useEffect, useState } from "react";

// Ink-bleed reveal for the hero. It WAITS for the intro overlay to leave (event
// "intro:done") and only then plays — so the sequence reads: envelope opens → the image
// bleeds in like ink on paper → settles. If the intro was already seen this session (flag
// already set) or reduced motion is on, it resolves immediately. While waiting the image
// is fully masked (invisible, and hidden behind the intro cover anyway). After the reveal
// the mask is dropped so the image is clean with no lingering filter cost.
type Phase = "waiting" | "revealing" | "done";

export default function InkReveal({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("waiting");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    let started = false;
    let revealTimer = 0;
    let fallback = 0;
    const start = () => {
      if (started) return;
      started = true;
      window.clearTimeout(fallback);
      setPhase("revealing");
      revealTimer = window.setTimeout(() => setPhase("done"), 3200);
    };

    // Intro already gone (e.g. seen this session) → reveal now.
    if ((window as unknown as { __introDone?: boolean }).__introDone) {
      start();
      return () => window.clearTimeout(revealTimer);
    }

    // Otherwise wait for the intro to close; safety net if the signal never comes.
    window.addEventListener("intro:done", start);
    fallback = window.setTimeout(start, 12000);
    return () => {
      window.removeEventListener("intro:done", start);
      window.clearTimeout(fallback);
      window.clearTimeout(revealTimer);
    };
  }, []);

  const cls =
    phase === "revealing"
      ? "ink-reveal absolute inset-0"
      : phase === "waiting"
        ? "ink-reveal-waiting absolute inset-0"
        : "absolute inset-0";
  return <div className={cls}>{children}</div>;
}
