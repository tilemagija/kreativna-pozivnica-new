"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { InvitationTemplate } from "@/sanity/queries";
import TemplatePreview, { type PreviewValues } from "./TemplatePreview";
import TextEditPanel from "./TextEditPanel";
import DigitalCheckout from "./DigitalCheckout";

// Digital-invitation configurator (§15): pick design → edit TEXT ONLY with a live preview
// → fixed price → checkout (100% online) → PDF by email. Reuses the same live text editor
// as the physical flow, minus paper/wrapper/seal/quantity. Front + back share one value map.
export default function DigitalConfigurator({
  template,
  digitalPrice,
  locale,
}: {
  template: InvitationTemplate;
  digitalPrice: number;
  locale: string;
}) {
  const t = useTranslations("Configurator");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const allFields = useMemo(
    () => [...(template.textFields ?? []), ...(template.backTextFields ?? [])],
    [template],
  );

  const [values, setValues] = useState<PreviewValues>(() => {
    const seeded: PreviewValues = {};
    for (const f of allFields) seeded[f.key] = f.defaultText ?? "";
    return seeded;
  });
  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  // Clicking text on the invitation focuses its input in the panel.
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  function focusField(key: string) {
    const el = inputRefs.current[key];
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.focus();
    el.select?.();
  }

  const backTemplate: InvitationTemplate | null = template.doubleSided
    ? { ...template, imageUrl: template.backImageUrl, aspect: template.backAspect, textFields: template.backTextFields }
    : null;

  const cur = t("currency");
  const fmt = (n: number) => `${n.toLocaleString("sr-RS")} ${cur}`;

  return (
    <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[1fr_360px] lg:gap-12">
      {/* LEFT: live preview(s) */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="mx-auto flex max-w-sm flex-col gap-5">
          <TemplatePreview template={template} values={values} locale={locale} onFieldClick={focusField} />
          {backTemplate && (
            <TemplatePreview template={backTemplate} values={values} locale={locale} onFieldClick={focusField} />
          )}
        </div>
        <p className="mt-4 text-center font-body text-sm text-ink-muted">{t("editHint")}</p>
      </div>

      {/* RIGHT: text + price + checkout */}
      <div className="flex flex-col gap-8">
        <TextEditPanel
          fields={allFields}
          values={values}
          onChange={setValue}
          locale={locale}
          title={t("editText")}
          registerRef={(key, el) => {
            inputRefs.current[key] = el;
          }}
        />

        <div className="rounded-md border border-line bg-greige/40 p-5">
          <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
            {t("digitalKicker")}
          </p>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-ink">{t("digitalPriceLabel")}</span>
            <span className="font-serif text-2xl text-gold-deep">{fmt(digitalPrice)}</span>
          </div>
          <p className="mt-2 font-body text-xs text-ink-muted">{t("digitalNote")}</p>
        </div>

        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          disabled={digitalPrice <= 0}
          className="rounded-sm bg-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
        >
          {t("checkout")}
        </button>
      </div>

      {checkoutOpen && (
        <DigitalCheckout
          template={template}
          values={values}
          price={digitalPrice}
          locale={locale}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
