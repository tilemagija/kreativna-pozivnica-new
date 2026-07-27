"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import Lotus from "@/components/brand/Lotus";
import Reveal from "@/components/motion/Reveal";

export type CardImage = { url: string };
export type UslugaCardData = {
  href: string;
  tilt: string;
  printClass: string;
  title: string;
  desc: string;
  coverUrl?: string;
  coverAlt: string;
  photoSoon: string;
  images: CardImage[];
};

// On hover (pointer devices) the hovered card itself GROWS from its own spot into a big
// panel that covers the whole row of three, and that card's own photos scatter inside
// (Позивнице→gallery, Слике→art, Детаљи→dodaci). We measure the card + the row and animate
// top/left/width/height so it visibly expands out of the card (no separate centred window).
// Touch / reduced-motion get no panel — a tap just follows the link.
// Bigger, overlapping, tilted prints spread across the panel (not a tidy arc) so the space
// reads as a lively scatter, not an empty rectangle. Two loose staggered rows.
const SCATTER = [
  { x: -300, y: -44, r: -11 },
  { x: -215, y: 46, r: 8 },
  { x: -120, y: -54, r: -5 },
  { x: -20, y: 40, r: 6 },
  { x: 90, y: -52, r: -8 },
  { x: 185, y: 44, r: 9 },
  { x: 285, y: -40, r: 13 },
  { x: 320, y: 48, r: -5 },
];

type Rect = { top: number; left: number; width: number; height: number };

export default function UslugeCards({ cards }: { cards: UslugaCardData[] }) {
  const reduce = useReducedMotion();
  const [hoverable, setHoverable] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [from, setFrom] = useState<Rect | null>(null);
  const [rowSize, setRowSize] = useState<{ w: number; h: number } | null>(null);

  const rowRef = useRef<HTMLDivElement>(null);
  const printRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setHoverable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const canHover = hoverable && !reduce;

  const onEnter = (i: number) => {
    if (!canHover || cards[i].images.length === 0) return;
    const row = rowRef.current;
    const print = printRefs.current[i];
    if (!row || !print) return;
    const r = row.getBoundingClientRect();
    const p = print.getBoundingClientRect();
    setRowSize({ w: r.width, h: r.height });
    setFrom({ top: p.top - r.top, left: p.left - r.left, width: p.width, height: p.height });
    setHovered(i);
  };

  const active = hovered !== null ? cards[hovered] : null;

  return (
    <div ref={rowRef} className="relative mt-12 md:mt-16">
      <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16">
        {cards.map((c, i) => (
          <Reveal key={c.href} delay={0.06 * i} className="flex justify-center">
            <Link
              href={c.href}
              onMouseEnter={() => onEnter(i)}
              className="group relative block w-full max-w-[290px]"
              style={{ opacity: hovered === i ? 0 : 1, transition: "opacity 0.15s" }}
            >
              <div
                ref={(el) => {
                  printRefs.current[i] = el;
                }}
                className={`album-print ${c.printClass}`}
                style={{ "--tilt": c.tilt } as CSSProperties}
              >
                <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden border border-line bg-kraft">
                  {c.coverUrl ? (
                    <Image
                      src={c.coverUrl}
                      alt={c.coverAlt}
                      fill
                      sizes="(max-width: 640px) 90vw, 290px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gold/45">
                      <Lotus className="h-10 w-16" />
                      <span className="font-sans text-[10px] uppercase tracking-[0.25em]">{c.photoSoon}</span>
                    </div>
                  )}
                </div>
                <div className="album-name">{c.title}</div>
              </div>
              <p className="mx-auto mt-7 max-w-[18rem] text-center font-sans text-base leading-relaxed text-ink">
                {c.desc}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active && from && rowSize && (
          <motion.div
            key="grow"
            className="usluga-panel absolute inset-0 z-50"
            style={{
              transformOrigin: `${((from.left + from.width / 2) / rowSize.w) * 100}% ${((from.top + from.height / 2) / rowSize.h) * 100}%`,
            }}
            onMouseLeave={() => setHovered(null)}
            initial={{ scale: Math.max(0.22, from.width / rowSize.w), opacity: 0.35 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: Math.max(0.22, from.width / rowSize.w), opacity: 0 }}
            transition={{ type: "spring", stiffness: 230, damping: 30 }}
          >
            <Link href={active.href} aria-label={active.title} className="absolute inset-0 z-10" />
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="relative h-0 w-0">
                {active.images.slice(0, 8).map((img, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute h-[228px] w-[186px] overflow-hidden border-[7px] border-cream bg-kraft shadow-[0_16px_30px_-12px_rgba(43,38,28,0.6)]"
                    style={{ left: -93, top: -114 }}
                    initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
                    animate={{ opacity: 1, x: SCATTER[idx].x, y: SCATTER[idx].y, rotate: SCATTER[idx].r, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.5 }}
                    transition={{ delay: 0.08 + idx * 0.04, type: "spring", stiffness: 240, damping: 22 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${img.url}?w=380&h=470&fit=crop&auto=format`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-30 text-center font-script text-2xl text-gold-deep">
              {active.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
