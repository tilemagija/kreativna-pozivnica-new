"use client";

import { useTranslations } from "next-intl";
import type { PriceBreakdown } from "@/lib/configuratorPricing";

// Live price panel (konfigurator §6): per-piece, total, 50% deposit + rest-on-delivery,
// lead time, and the "something special" link. Per the owner's decision this button is a
// plain Instagram link (not the Smart Inquiry popup). The number shown is for UX only —
// the charged amount is recomputed on the server at checkout (§7).
export default function PriceSummary({
  breakdown,
  instagramUrl,
}: {
  breakdown: PriceBreakdown;
  instagramUrl: string;
}) {
  const t = useTranslations("Configurator");
  const cur = t("currency");
  const fmt = (n: number) => `${n.toLocaleString("sr-RS")} ${cur}`;

  return (
    <section className="rounded-md border border-line bg-greige/40 p-5">
      <div className="flex items-center justify-between font-body text-sm text-ink-muted">
        <span>{t("perPiece")}</span>
        <span>{fmt(breakdown.perPiece)}</span>
      </div>
      {breakdown.setupFee > 0 && (
        <div className="mt-1 flex items-center justify-between font-body text-sm text-ink-muted">
          <span>{t("setupFee")}</span>
          <span>+{fmt(breakdown.setupFee)}</span>
        </div>
      )}

      <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
        <span className="font-serif text-lg text-ink">{t("total")}</span>
        <span className="font-serif text-2xl text-gold-deep">{fmt(breakdown.total)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between font-body text-sm text-ink">
        <span>{t("deposit")}</span>
        <span>
          {fmt(breakdown.deposit)} <span className="text-ink-muted">· {t("restCod")}</span>
        </span>
      </div>

      <p className="mt-3 font-body text-xs text-ink-muted">{t("delivery")}</p>

      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block rounded-sm border border-gold px-4 py-2 text-center font-sans text-xs uppercase tracking-wider text-gold-deep transition-colors hover:bg-gold hover:text-cream"
      >
        {t("special")}
      </a>
    </section>
  );
}
