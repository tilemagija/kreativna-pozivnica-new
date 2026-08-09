"use client";

import { useState } from "react";

// Confetti burst for the „Акција" link (owner's ask #8). Deliberately cheap: a handful of
// absolutely-positioned specks with randomised angle/distance driven by CSS variables, so
// there is no canvas, no animation library and nothing to clean up — the specks are simply
// unmounted when the hover ends.
const COLORS = ["#b08d57", "#204022", "#b6805f", "#8c6c3c", "#f4ecd7"];
const COUNT = 14;

type Speck = { id: number; angle: number; distance: number; color: string; delay: number };

function makeSpecks(seed: number): Speck[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: seed * 100 + i,
    angle: (360 / COUNT) * i + (Math.random() * 20 - 10),
    distance: 26 + Math.random() * 26,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 90,
  }));
}

export default function Confetti({ children }: { children: React.ReactNode }) {
  const [specks, setSpecks] = useState<Speck[]>([]);
  const [burst, setBurst] = useState(0);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => {
        setBurst((b) => b + 1);
        setSpecks(makeSpecks(burst + 1));
      }}
      onMouseLeave={() => setSpecks([])}
    >
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {specks.map((s) => (
          <span
            key={s.id}
            className="confetti-speck"
            style={
              {
                background: s.color,
                animationDelay: `${s.delay}ms`,
                "--angle": `${s.angle}deg`,
                "--dist": `${s.distance}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </span>
  );
}
