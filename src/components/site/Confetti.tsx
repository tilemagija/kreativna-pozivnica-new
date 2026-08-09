"use client";

import { useState } from "react";

// Confetti burst for the „Акција" link. No canvas and no animation library: each speck is a
// span that flies along its own --angle for its own --dist via one CSS keyframe, and the
// whole set is unmounted when the pointer leaves — nothing keeps running in the background.
//
// Richness comes from variety, not count: three shapes, two sizes, staggered starts and
// uneven angles, so it reads as a scatter instead of a clock face.
const COLORS = ["#b08d57", "#8c6c3c", "#d8c39b", "#204022", "#b6805f", "#f4ecd7"];
const COUNT = 26;

type Speck = {
  id: number;
  angle: number;
  distance: number;
  color: string;
  delay: number;
  size: number;
  round: boolean;
  thin: boolean;
  spin: number;
};

function makeSpecks(seed: number): Speck[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const spread = 360 / COUNT;
    return {
      id: seed * 1000 + i,
      // Even spacing would look mechanical; the jitter is what makes it feel thrown.
      angle: spread * i + (Math.random() * spread - spread / 2),
      distance: 30 + Math.random() * 46,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 140,
      size: 4 + Math.random() * 5,
      round: Math.random() < 0.3,
      thin: Math.random() < 0.35,
      spin: 180 + Math.random() * 360,
    };
  });
}

export default function Confetti({ children }: { children: React.ReactNode }) {
  const [specks, setSpecks] = useState<Speck[]>([]);
  const [burst, setBurst] = useState(0);

  const fire = () => {
    setBurst((b) => {
      setSpecks(makeSpecks(b + 1));
      return b + 1;
    });
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={fire}
      onMouseLeave={() => setSpecks([])}
      onFocus={fire}
      onBlur={() => setSpecks([])}
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
                width: `${s.thin ? s.size * 0.45 : s.size}px`,
                height: `${s.size}px`,
                borderRadius: s.round ? "50%" : "1px",
                animationDelay: `${s.delay}ms`,
                "--angle": `${s.angle}deg`,
                "--dist": `${s.distance}px`,
                "--spin": `${s.spin}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </span>
  );
}
