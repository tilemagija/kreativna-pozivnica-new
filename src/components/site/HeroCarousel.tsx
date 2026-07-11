"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Slide = { url: string; alt: string };

// Hero image carousel: cross-fades through the images from Sanity at a configurable
// speed. Respects reduced motion (shows the first image, no auto-rotation).
export default function HeroCarousel({
  images,
  seconds,
}: {
  images: Slide[];
  seconds: number;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || images.length <= 1) return;
    const ms = Math.max(2, seconds || 5) * 1000;
    const id = setInterval(() => setIndex((p) => (p + 1) % images.length), ms);
    return () => clearInterval(id);
  }, [reduce, images.length, seconds]);

  const current = images[index] ?? images[0];

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-line bg-kraft">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1, ease: "easeInOut" }}
        >
          <Image
            src={current.url}
            alt={current.alt}
            fill
            sizes="(max-width: 768px) 90vw, 40vw"
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
