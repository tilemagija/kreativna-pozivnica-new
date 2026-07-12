"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Reusable Smart Inquiry form (§16). Knows its `context` (which product/section
// triggered it), posts to /api/inquiry (saved to Sanity + emailed later). On any
// failure it offers the real Instagram fallback — never fakes success (§6).
type Status = "idle" | "sending" | "sent" | "error";

export default function SmartInquiry({
  context,
  instagramUrl,
}: {
  context: string;
  instagramUrl: string;
}) {
  const t = useTranslations("Inquiry");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          contact: data.get("contact"),
          message: data.get("message"),
          website: data.get("website"), // honeypot
          context,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-md rounded-md border border-line bg-cream px-6 py-8 text-center">
        <p className="font-serif text-2xl text-ink">{t("thanksTitle")}</p>
        <p className="mt-2 font-body text-ink-muted">{t("thanksBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-md flex-col gap-3 text-left">
      {/* honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <input
        name="name"
        required
        maxLength={100}
        placeholder={t("name")}
        className="rounded-sm border border-line bg-cream px-4 py-3 font-body text-ink outline-none focus:border-gold"
      />
      <input
        name="contact"
        required
        maxLength={150}
        placeholder={t("contact")}
        className="rounded-sm border border-line bg-cream px-4 py-3 font-body text-ink outline-none focus:border-gold"
      />
      <textarea
        name="message"
        rows={4}
        maxLength={2000}
        placeholder={t("message")}
        className="resize-none rounded-sm border border-line bg-cream px-4 py-3 font-body text-ink outline-none focus:border-gold"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-sm bg-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      {status === "error" && (
        <p className="text-center font-body text-sm text-terracotta">
          {t("errorPrefix")}{" "}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold"
          >
            {t("errorInstagram")}
          </a>
        </p>
      )}
    </form>
  );
}
