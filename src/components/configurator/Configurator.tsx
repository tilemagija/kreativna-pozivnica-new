"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ConfiguratorOptions, InvitationTemplate } from "@/sanity/queries";
import { computePrice, type PriceSelection } from "@/lib/configuratorPricing";
import TemplatePreview, { type PreviewValues } from "./TemplatePreview";
import TextEditPanel from "./TextEditPanel";
import OptionControls, { type Selection } from "./OptionControls";
import PriceSummary from "./PriceSummary";
import Checkout from "./Checkout";

// The configurator for ONE chosen design (reached from the gallery at
// /napravite-svoju/[slug]). Left = live preview (front, plus back for double-sided);
// right = edit text + options + live price + checkout. The customer edits TEXT ONLY.
export default function Configurator({
  template,
  options,
  instagramUrl,
  locale,
}: {
  template: InvitationTemplate;
  options: ConfiguratorOptions;
  instagramUrl: string;
  locale: string;
}) {
  const t = useTranslations("Configurator");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Front + back fields share one value map (keys are unique across sides).
  const allFields = useMemo(
    () => [...(template.textFields ?? []), ...(template.backTextFields ?? [])],
    [template],
  );

  const [values, setValues] = useState<PreviewValues>(() => {
    const seeded: PreviewValues = {};
    for (const f of allFields) seeded[f.key] = f.defaultText ?? "";
    return seeded;
  });
  const setValue = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const [selection, setSelection] = useState<Selection>(() => ({
    quantity: options.pricing?.minQuantity ?? 50,
    paperId: options.papers[0]?._id,
    wrapper: "bez",
    envelopeId: options.envelopes[0]?._id,
    tornEdges: false,
    goldEdges: false,
    roundedCorners: false,
    sealType: "none",
    sealMotifId: options.sealMotifs[0]?._id,
    sealColorId: options.sealColors[0]?._id,
  }));
  const setSel = (patch: Partial<Selection>) => setSelection((prev) => ({ ...prev, ...patch }));

  const breakdown = useMemo(() => {
    const paper = options.papers.find((p) => p._id === selection.paperId);
    const env = options.envelopes.find((e) => e._id === selection.envelopeId);
    const priceSel: PriceSelection = {
      quantity: selection.quantity,
      paperPrice: paper?.pricePerPiece ?? 0,
      wrapper: selection.wrapper,
      envelopePrice: env?.pricePerPiece ?? 0,
      doubleSided: template.doubleSided ?? false,
      tornEdges: selection.tornEdges,
      goldEdges: selection.goldEdges,
      roundedCorners: selection.roundedCorners,
      sealType: selection.sealType,
    };
    return computePrice(priceSel, options.pricing ?? {});
  }, [selection, options, template.doubleSided]);

  // Clicking text on the invitation focuses its input in the panel.
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  function focusField(key: string) {
    const el = inputRefs.current[key];
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.focus();
    el.select?.();
  }

  // Synthetic "template" for the back side so TemplatePreview can render it.
  const backTemplate: InvitationTemplate | null = template.doubleSided
    ? { ...template, imageUrl: template.backImageUrl, aspect: template.backAspect, textFields: template.backTextFields }
    : null;

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

      {/* RIGHT: controls */}
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

        <OptionControls options={options} selection={selection} set={setSel} locale={locale} />

        <PriceSummary breakdown={breakdown} instagramUrl={instagramUrl} />

        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          className="rounded-sm bg-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream transition-colors hover:bg-gold-deep"
        >
          {t("checkout")}
        </button>
      </div>

      {checkoutOpen && (
        <Checkout
          template={template}
          values={values}
          selection={selection}
          options={options}
          breakdown={breakdown}
          locale={locale}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
