"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Count-up number (0 → target over ~2.4s) when it scrolls into view. Reduced motion
// shows the final number instantly. Serbian formats thousands with a dot (2.000).
export default function Counter({
  target,
  suffix,
  label,
  tagline,
  locale,
}: {
  target: number;
  suffix?: string;
  label?: string;
  tagline?: string;
  locale: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(target);
      return;
    }
    const duration = 2400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  const formatted = value.toLocaleString(locale === "en" ? "en-US" : "sr-RS");

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <div className="font-serif text-6xl text-gold md:text-7xl">
        {formatted}
        {suffix && <span className="align-top text-3xl md:text-4xl">{suffix}</span>}
      </div>
      {label && (
        <div className="font-sans text-xs uppercase tracking-[0.3em] text-ink-muted">
          {label}
        </div>
      )}
      {tagline && <p className="font-script text-2xl text-sage-deep">{tagline}</p>}
    </div>
  );
}
