"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Utisak = { thumb: string; full: string };

// "Утисци" — a scrollable 2-column grid of upright screenshots/photos. Hovering a tile
// nudges it up a touch; clicking one makes it grow (shared-layout animation) to the
// middle of the screen (~45% wide) over a blurred backdrop, and clicking the backdrop
// shrinks it back into place. No gallery/navigation — just zoom one in, then out.
export default function UtisciGrid({
  items,
  kicker,
  heading,
}: {
  items: Utisak[];
  kicker?: string;
  heading?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  // Escape closes; lock page scroll while a tile is zoomed.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1 text-center lg:items-start lg:text-left">
        {kicker && (
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-sage-deep">
            {kicker}
          </span>
        )}
        {heading && <h3 className="font-script text-3xl text-forest">{heading}</h3>}
      </div>

      {items.length > 0 ? (
        <div
          data-lenis-prevent
          className="utisci-scroll max-h-[30rem] overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-2 gap-2.5">
            {items.map((it, i) => (
              <motion.button
                key={i}
                layoutId={`utisak-${i}`}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                aria-label={`Утисак ${i + 1} — увеличај`}
                className="relative aspect-[3/4] overflow-hidden rounded-md border border-line bg-cream shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        // No impressions yet — soft placeholder tiles so the block still reads as intentional.
        <div className="grid grid-cols-2 gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-md border border-dashed border-line bg-cream/50"
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {active !== null && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.img
              layoutId={`utisak-${active}`}
              src={items[active].full}
              alt=""
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="max-h-[85vh] max-w-[88vw] rounded-xl object-contain shadow-2xl md:max-w-[46vw]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
