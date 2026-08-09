"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

// Language picker as a „slip" taped to the bottom edge of every page: a dark tab reading
// „Језик" that opens upward on hover (desktop) or tap (touch) to reveal all three.
//
// The option labels are hardcoded, NOT translated on purpose — each one is written in the
// script it switches to, so it demonstrates itself. Running them through the message
// catalogue would transliterate „Ћирилица" into „Ćirilica" on the Latin site, which is
// exactly the wrong thing for a script picker.
const OPTIONS = [
  { locale: "sr", label: "Ћирилица" },
  { locale: "sr-Latn", label: "Latinica" },
  { locale: "en", label: "English" },
] as const;

export default function LanguageSlip() {
  const pathname = usePathname();
  const active = useLocale();
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Touch has no hover, so the tab is also a button. That means it needs the two escapes a
  // hover menu gets for free: Escape, and a tap anywhere outside.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="fixed bottom-0 right-4 z-50 sm:right-8"
    >
      {/* The options are absolutely positioned ABOVE the tab rather than expanding it, so
          opening never reflows the page. (The `grid-rows-[0fr]→[1fr]` trick was tried first
          and resolved to 0px here — the tab has no definite height to size the fr against.) */}
      <div className="relative">
        <ul
          className={`absolute bottom-full right-0 mb-1 flex min-w-full flex-col gap-px rounded-md bg-slip p-1 shadow-[0_-6px_20px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          {OPTIONS.map((o) => {
            const isActive = o.locale === active;
            return (
              <li key={o.locale}>
                <Link
                  href={pathname}
                  locale={o.locale}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  aria-current={isActive ? "true" : undefined}
                  className={`block whitespace-nowrap rounded-sm px-4 py-2 text-center font-body text-sm transition-colors ${
                    isActive
                      ? "bg-cream/15 text-cream"
                      : "text-cream/70 hover:bg-cream/10 hover:text-cream"
                  }`}
                >
                  {o.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-center gap-2 rounded-t-md bg-slip px-5 py-2 font-sans text-[11px] uppercase tracking-[0.2em] text-cream shadow-[0_-6px_20px_rgba(0,0,0,0.3)]"
        >
          {t("language")}
          <span
            aria-hidden
            className={`text-[9px] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            ▲
          </span>
        </button>
      </div>
    </div>
  );
}
