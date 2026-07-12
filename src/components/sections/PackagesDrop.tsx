"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Pkg = { url: string; alt: string };

// Loose overlapping pile of real package photos that "drop in" one by one as the
// section scrolls into view (in sync with the counter). Reduced motion = static pile.
// When no images are set yet, kraft-colored placeholders keep the layout intact.
const SLOTS = [
  { left: "6%", top: "4%", rot: -8 },
  { left: "50%", top: "0%", rot: 7 },
  { left: "28%", top: "30%", rot: -3 },
  { left: "2%", top: "54%", rot: 6 },
  { left: "52%", top: "48%", rot: -6 },
  { left: "30%", top: "72%", rot: 4 },
];

export default function PackagesDrop({ images }: { images: Pkg[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Fill up to 6 slots; use real photos where present, placeholders otherwise.
  const items = SLOTS.map((slot, i) => ({ slot, img: images[i] ?? null }));

  return (
    <div ref={ref} className="relative mx-auto h-72 w-full max-w-sm md:h-80">
      {items.map(({ slot, img }, i) => (
        <motion.div
          key={i}
          className="absolute w-[42%]"
          style={{ left: slot.left, top: slot.top }}
          initial={reduce ? false : { opacity: 0, y: -50, rotate: slot.rot - 5 }}
          animate={
            inView || reduce
              ? { opacity: 1, y: 0, rotate: slot.rot }
              : { opacity: 0, y: -50, rotate: slot.rot - 5 }
          }
          transition={{ duration: 0.6, delay: i * 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md shadow-lg shadow-black/30">
            {img ? (
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 40vw, 180px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-kraft" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
