"use client";

import { useEffect, useRef, useState } from "react";

// Editorial mosaic gallery that loads in batches on scroll ("infinite scroll") instead of
// numbered pages — the ask for galleries that may hold hundreds of images. Design
// constraint (§11a): a restless, varied-size MOSAIC, never a uniform grid. We distribute
// items round-robin into a fixed number of flex columns: item i always lands in column
// (i % cols), so growing the visible slice only appends to the bottom of each column —
// nothing above moves (no reshuffle jump). The "nemir" (freshness) comes from unequal
// column widths + a vertical stagger per column + the images' own natural aspect ratios,
// so no two rows line up. Column count follows the breakpoint (1 phone / 2 tablet /
// 3 desktop); the layout table below carries the width weight + top offset (px) per
// column for each count. An IntersectionObserver sentinel near the bottom reveals the next
// batch. Callers pass already-built nodes (each with a stable `key`), so this works from
// both a server gallery and a client one.
type ColSpec = { grow: number; mt: number };
const LAYOUTS: Record<number, ColSpec[]> = {
  1: [{ grow: 1, mt: 0 }],
  2: [
    { grow: 1.12, mt: 0 },
    { grow: 0.88, mt: 56 },
  ],
  3: [
    { grow: 1.22, mt: 0 },
    { grow: 0.86, mt: 72 },
    { grow: 1.02, mt: 28 },
  ],
};

export default function MasonryInfinite({
  items,
  initial = 9,
  batch = 9,
}: {
  items: React.ReactNode[];
  initial?: number;
  batch?: number;
}) {
  const [count, setCount] = useState(() => Math.min(initial, items.length));
  const [cols, setCols] = useState(3); // SSR/first paint = 3 (matches server); corrected on mount
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const compute = () =>
      setCols(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    if (count >= items.length) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries[0].isIntersecting &&
        setCount((c) => Math.min(c + batch, items.length)),
      { rootMargin: "800px 0px" } // start loading well before the sentinel is in view
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, items.length, batch]);

  const visible = items.slice(0, count);
  const layout = LAYOUTS[cols];
  const columns = Array.from({ length: cols }, (_, j) =>
    visible.filter((_, i) => i % cols === j)
  );

  return (
    <>
      <div className="mt-10 flex items-start gap-4 md:mt-14 md:gap-6 lg:gap-8">
        {columns.map((col, j) => (
          <div
            key={j}
            className="flex min-w-0 flex-col gap-4 md:gap-6"
            style={{ flexGrow: layout[j].grow, flexBasis: 0, marginTop: layout[j].mt }}
          >
            {col}
          </div>
        ))}
      </div>
      {count < items.length && (
        <div ref={sentinelRef} aria-hidden className="h-8 w-full" />
      )}
    </>
  );
}
