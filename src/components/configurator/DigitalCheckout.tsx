"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { InvitationTemplate } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import QRCode from "qrcode";
import { buildIpsQrString } from "@/lib/payment";
import type { PreviewValues } from "./TemplatePreview";
import TemplatePreview from "./TemplatePreview";

// Digital-invitation checkout (§15): confirm preview → customer form (name + EMAIL required,
// since the PDF is delivered by email) → success with full-amount bank details + IPS QR.
// Posts to /api/order with kind:"digital", which RECOMPUTES the price server-side (§7).
type Step = "confirm" | "form" | "success";

type PaymentInfo = {
  total?: number;
  orderNumber?: string;
  payment?: {
    recipient?: string;
    account?: string;
    bankName?: string;
    model?: string;
    paymentCode?: string;
    purpose?: string;
  };
};

export default function DigitalCheckout({
  template,
  values,
  price,
  locale,
  onClose,
}: {
  template: InvitationTemplate;
  values: PreviewValues;
  price: number;
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations("Configurator");
  const [step, setStep] = useState<Step>("confirm");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const returnTo = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      returnTo?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    if (step === "form") nameRef.current?.focus();
  }, [step]);

  // Build the NBS IPS QR (scan-to-pay) on the success screen once we have bank details.
  useEffect(() => {
    const p = paymentInfo?.payment;
    if (step !== "success" || !p?.account) {
      setQrUrl("");
      return;
    }
    const ips = buildIpsQrString({
      account: p.account,
      recipient: p.recipient,
      amount: paymentInfo?.total ?? price,
      model: p.model,
      reference: paymentInfo?.orderNumber ?? "",
      paymentCode: p.paymentCode,
      purpose: p.purpose,
    });
    QRCode.toDataURL(ips, { margin: 1, width: 220 })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [step, paymentInfo, price]);

  const cur = t("currency");
  const fmt = (n: number) => `${n.toLocaleString("sr-RS")} ${cur}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const customer = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      eventDate: String(fd.get("eventDate") || "").trim(),
    };
    if (customer.name.length < 2 || !customer.email.includes("@")) {
      setStatus("error");
      setErrMsg(t("digitalEmailRequired"));
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "digital",
          templateId: template._id,
          templateName: pick(template.name, locale),
          textValues: Object.entries(values).map(([key, value]) => ({ key, value })),
          customer,
          website: fd.get("website"),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const json: PaymentInfo = await res.json().catch(() => ({}));
      setPaymentInfo(json);
      setStep("success");
    } catch {
      setStatus("error");
      setErrMsg(t("orderError"));
    }
  }

  const inputCls =
    "w-full rounded-sm border border-line bg-cream px-3 py-2 font-body text-ink outline-none focus:border-gold";

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="mx-auto my-6 w-full max-w-lg rounded-md border border-line bg-cream p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="float-right text-2xl leading-none text-ink-muted hover:text-gold"
        >
          ×
        </button>

        {step === "confirm" && (
          <div>
            <h3 className="mb-1 font-serif text-2xl text-ink">{t("confirmTitle")}</h3>
            <p className="mb-4 font-body text-sm text-ink-muted">{t("digitalConfirmBody")}</p>
            <div className="mx-auto flex max-w-[240px] flex-col gap-3">
              <TemplatePreview template={template} values={values} locale={locale} interactive={false} />
              {template.doubleSided && (
                <TemplatePreview
                  template={{ ...template, imageUrl: template.backImageUrl, aspect: template.backAspect, textFields: template.backTextFields }}
                  values={values}
                  locale={locale}
                  interactive={false}
                />
              )}
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-sm border border-line px-4 py-2 font-body text-ink hover:border-gold"
              >
                {t("back")}
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 rounded-sm bg-gold px-4 py-2 font-sans text-sm uppercase tracking-wider text-cream hover:bg-gold-deep"
              >
                {t("confirmContinue")}
              </button>
            </div>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={submit}>
            <h3 className="mb-4 font-serif text-2xl text-ink">{t("orderTitle")}</h3>

            {/* honeypot */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="flex flex-col gap-3">
              <input ref={nameRef} name="name" required maxLength={100} placeholder={t("custName")} className={inputCls} />
              <input name="email" type="email" required maxLength={150} placeholder={t("custEmailRequired")} className={inputCls} />
              <input name="eventDate" maxLength={40} placeholder={t("custEventDate")} className={inputCls} />
            </div>

            <div className="mt-5 rounded-sm border border-line bg-greige/40 p-4">
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">{t("summary")}</p>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-ink">{t("digitalPriceLabel")}</span>
                <span className="font-serif text-xl text-gold-deep">{fmt(price)}</span>
              </div>
              <p className="mt-2 font-body text-xs text-ink-muted">{t("digitalPayNote")}</p>
            </div>

            {status === "error" && (
              <p className="mt-3 text-center font-body text-sm text-terracotta">{errMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-4 w-full rounded-sm bg-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream hover:bg-gold-deep disabled:opacity-60"
            >
              {status === "sending" ? t("sending") : t("submitOrder")}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="py-2">
            <p className="text-center font-serif text-2xl text-ink">{t("successTitle")}</p>

            {paymentInfo?.payment?.account ? (
              <div className="mt-4 rounded-md border border-line bg-greige/40 p-4">
                <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">{t("payTitle")}</p>
                <p className="mb-3 font-body text-sm text-ink-muted">{t("digitalPayInstructions")}</p>
                <SummaryRow label={t("payRecipient")} value={paymentInfo.payment.recipient ?? ""} />
                <SummaryRow label={t("payAccount")} value={paymentInfo.payment.account} />
                <SummaryRow label={t("payBank")} value={paymentInfo.payment.bankName ?? ""} />
                <div className="my-2 border-t border-line pt-2">
                  <SummaryRow label={t("digitalPayAmount")} value={fmt(paymentInfo.total ?? price)} />
                  <SummaryRow
                    label={t("payReference")}
                    value={`${paymentInfo.payment.model ?? "00"}  ${paymentInfo.orderNumber ?? ""}`}
                  />
                </div>
                <SummaryRow label={t("payPurpose")} value={paymentInfo.payment.purpose ?? ""} />
                {qrUrl && (
                  <div className="mt-4 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="IPS QR" width={176} height={176} className="mx-auto rounded-sm border border-line bg-white p-1" />
                    <p className="mt-1 font-body text-xs text-ink-muted">{t("payScan")}</p>
                  </div>
                )}
                <p className="mt-3 font-body text-xs text-ink-muted">{t("digitalPayAfter")}</p>
              </div>
            ) : (
              <p className="mt-2 text-center font-body text-ink-muted">{t("digitalSuccessBody")}</p>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border border-gold px-6 py-2 font-sans text-xs uppercase tracking-wider text-gold-deep hover:bg-gold hover:text-cream"
              >
                {t("close")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between font-body text-sm text-ink-muted">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
