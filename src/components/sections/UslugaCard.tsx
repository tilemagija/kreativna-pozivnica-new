"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import Lotus from "@/components/brand/Lotus";

// One „album" service card. On hover (pointer devices only) up to 8 gallery photos
// scatter out like tossed prints, spilling over the neighbours — a peek into the work.
// Touch devices get no fan: a tap just follows the link. Needs the `.album-print` styles
// + the torn-edge SVG filters rendered by the parent section.
export type CardImage = { url: string };

// Scatter targets (px offsets + rotation) around the card centre — a loose fan.
const SCATTER = [
  { x: -128, y: -34, r: -13 },
  { x: -66, y: -78, r: -6 },
  { x: 6, y: -94, r: 3 },
  { x: 78, y: -72, r: 11 },
  { x: 128, y: -18, r: 15 },
  { x: -98, y: 36, r: -15 },
  { x: -4, y: 26, r: 2 },
  { x: 98, y: 42, r: 13 },
];

export default function UslugaCard({
  href,
  tilt,
  printClass,
  title,
  desc,
  coverUrl,
  coverAlt,
  photoSoon,
  images,
}: {
  href: string;
  tilt: string;
  printClass: string;
  title: string;
  desc: string;
  coverUrl?: string;
  coverAlt: string;
  photoSoon: string;
  images: CardImage[];
}) {
  const reduce = useReducedMotion();
  const [hoverable, setHoverable] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHoverable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const fan = images.slice(0, 8);
  const canFan = hoverable && !reduce && fan.length > 0;

  return (
    <Link
      href={href}
      className="group relative block w-full max-w-[290px] hover:z-30"
      onMouseEnter={() => canFan && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className={`album-print ${printClass}`} style={{ "--tilt": tilt } as CSSProperties}>
        <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden border border-line bg-kraft">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={coverAlt}
              fill
              sizes="(max-width: 640px) 90vw, 290px"
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gold/45">
              <Lotus className="h-10 w-16" />
              <span className="font-sans text-[10px] uppercase tracking-[0.25em]">{photoSoon}</span>
            </div>
          )}
        </div>
        <div className="album-name">{title}</div>
      </div>

      <p className="mx-auto mt-7 max-w-[18rem] text-center font-sans text-base leading-relaxed text-ink">
        {desc}
      </p>

      <AnimatePresence>
        {open && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[32%] z-40 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="relative h-0 w-0">
              {fan.map((img, idx) => (
                <motion.div
                  key={idx}
                  className="absolute h-[112px] w-[90px] overflow-hidden border-[5px] border-cream bg-kraft shadow-[0_12px_24px_-10px_rgba(43,38,28,0.6)]"
                  style={{ left: -45, top: -56 }}
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.5 }}
                  animate={{ opacity: 1, x: SCATTER[idx].x, y: SCATTER[idx].y, rotate: SCATTER[idx].r, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.5 }}
                  transition={{ delay: idx * 0.03, type: "spring", stiffness: 260, damping: 22 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${img.url}?w=200&h=250&fit=crop&auto=format`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
