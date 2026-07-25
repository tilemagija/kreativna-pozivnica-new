"use client";

import { useEffect, useState } from "react";

// Ink-bleed reveal: on load, the child (hero image) is revealed through an organic,
// rough-edged mask that "bleeds" open like ink soaking into paper (see .ink-reveal in
// globals.css). After the animation, the mask is dropped so the image is fully clean with
// no lingering filter cost. Reduced motion is handled in CSS (mask removed) — and we still
// clear the class here so nothing is ever left partially masked.
export default function InkReveal({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }
    const id = setTimeout(() => setDone(true), 3200);
    return () => clearTimeout(id);
  }, []);

  return <div className={done ? "absolute inset-0" : "ink-reveal absolute inset-0"}>{children}</div>;
}
