"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import SmartInquiry from "./SmartInquiry";

// Button that opens the Smart Inquiry form in a modal, carrying the item's context
// (§16 popup). Escape + backdrop close, scroll lock, focus moves into the dialog.
// NOTE: currently unwired — World B switched to a pure Instagram button (owner's call).
// Kept on purpose: reserved for the not-yet-built showcase-only inquiries in §15
// (custom design "prilagodite baš vama", folded / scroll-in-bottle invitations).
export default function InquiryDialog({
  context,
  instagramUrl,
  label,
  title,
}: {
  context: string;
  instagramUrl: string;
  label?: string;
  title?: string;
}) {
  const t = useTranslations("Inquiry");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm border border-gold px-5 py-2 font-sans text-xs uppercase tracking-wider text-gold-deep transition-colors hover:bg-gold hover:text-cream"
      >
        {label || t("open")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md rounded-md border border-line bg-cream p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="absolute right-3 top-3 text-2xl leading-none text-ink-muted transition-colors hover:text-gold"
            >
              ×
            </button>

            {title && (
              <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
                {t("aboutItem")}
              </p>
            )}
            <h3 className="mb-4 font-serif text-2xl text-ink">{title || t("open")}</h3>

            <SmartInquiry context={context} instagramUrl={instagramUrl} />
          </div>
        </div>
      )}
    </>
  );
}
