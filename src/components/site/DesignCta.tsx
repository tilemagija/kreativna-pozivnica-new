"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";

// „Дизајнирајте сами" — the site's main CTA, given the same weight as „Акција" (owner's ask).
// Two things beyond a normal link:
//   1. IDLE: the gilt catches the light every few seconds (`.cta-gilt` in globals.css), so the
//      button calls to the eye before anyone hovers it. Pure CSS, no JS ticking.
//   2. HOVER: a framed preview opens underneath with a sped-up film of an invitation being made.
// The film is a DESKTOP-ONLY enhancement: it is mounted only where a real pointer exists, so
// phones never download it, and never for `prefers-reduced-motion`. Until the owner delivers
// the file the request 404s, `onError` disarms the preview, and the button simply behaves as a
// button — nothing broken shows.
const VIDEO_SRC = "/kako-nastaje-pozivnica.mp4";

export default function DesignCta({
  label,
  className = "",
  preview = true,
  onClick,
}: {
  label: string;
  className?: string;
  /** false in the mobile sheet — there is no hover there, so no film either. */
  preview?: boolean;
  onClick?: () => void;
}) {
  const reduce = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false); // the film exists and can actually play
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mount the film only where it can actually be used: a real pointer AND the `lg` breakpoint,
  // which is exactly when the desktop CTA is on screen (below it the header collapses to the
  // burger and this button is display:none — no reason to fetch anything for it).
  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Same lesson as the „Наше услуге" hover panel: a panel that only listens for mouseleave
  // gets stuck on screen when the window loses focus or the tab is hidden.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("blur", close);
    document.addEventListener("visibilitychange", close);
    return () => {
      window.removeEventListener("blur", close);
      document.removeEventListener("visibilitychange", close);
    };
  }, [open]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      v.currentTime = 0;
      void v.play().catch(() => {}); // autoplay of a muted clip; ignore a rejected promise
    } else {
      v.pause();
    }
  }, [open]);

  const showFilm = preview && canHover && !reduce;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <Link href="/napravite-svoju" onClick={onClick} className={className}>
        {label}
      </Link>

      {showFilm && (
        // Kept mounted (not conditionally rendered) so the film can preload its metadata and
        // start instantly on hover; visibility is a transition, not a remount.
        <span
          aria-hidden
          className={`absolute right-0 top-[calc(100%+12px)] w-[340px] rounded-sm border border-line bg-cream p-1.5 shadow-[0_14px_36px_rgba(59,50,39,0.32)] transition-[opacity,transform] duration-300 ${
            open && ready
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0"
          }`}
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            loop
            preload="metadata"
            onCanPlay={() => setReady(true)}
            onError={() => setReady(false)}
            // 16:9 — the film is shot landscape; `cover` keeps the frame filled if it isn't.
            className="aspect-video w-full rounded-[2px] bg-greige object-cover"
          />
        </span>
      )}
    </span>
  );
}
