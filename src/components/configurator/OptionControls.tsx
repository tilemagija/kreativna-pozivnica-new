"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { ConfiguratorOptions, PricedOption } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import type { SealType, WrapperKind } from "@/lib/configuratorPricing";

// The right-hand control panel (konfigurator §1): quantity, paper, wrapper (+envelope
// submenu), add-ons, seal. Pure UI — it reports changes up; price is computed in the
// parent from the current selection (and re-checked on the server at checkout, §7).
export type Selection = {
  quantity: number;
  paperId?: string;
  wrapper: WrapperKind;
  envelopeId?: string;
  tornEdges: boolean;
  goldEdges: boolean;
  roundedCorners: boolean;
  sealType: SealType;
  sealMotifId?: string;
  sealColorId?: string;
};

export default function OptionControls({
  options,
  selection,
  set,
  locale,
}: {
  options: ConfiguratorOptions;
  selection: Selection;
  set: (patch: Partial<Selection>) => void;
  locale: string;
  currency?: string;
}) {
  const t = useTranslations("Configurator");
  const s = selection;
  const min = options.pricing?.minQuantity ?? 50;
  const fee = options.pricing?.setupFee ?? 4000;

  return (
    <div className="flex flex-col gap-8">
      {/* Quantity */}
      <section>
        <Heading>{t("quantity")}</Heading>
        <QuantityInput value={s.quantity} onChange={(q) => set({ quantity: q })} />
        <p className="mt-2 font-body text-xs text-ink-muted">{t("quantityHint", { min, fee })}</p>
      </section>

      {/* Paper */}
      {options.papers.length > 0 && (
        <section>
          <Heading>{t("paper")}</Heading>
          <SwatchGrid>
            {options.papers.map((p) => (
              <Swatch
                key={p._id}
                imageUrl={p.swatchUrl}
                label={pick(p.name, locale)}
                price={p.pricePerPiece}
                currency={t("currency")}
                selected={s.paperId === p._id}
                onClick={() => set({ paperId: p._id })}
              />
            ))}
          </SwatchGrid>
        </section>
      )}

      {/* Wrapper */}
      <section>
        <Heading>{t("wrapper")}</Heading>
        <div className="flex flex-wrap gap-2">
          <Pill selected={s.wrapper === "bez"} onClick={() => set({ wrapper: "bez" })}>{t("wrapperBez")}</Pill>
          <Pill selected={s.wrapper === "paus"} onClick={() => set({ wrapper: "paus" })}>{t("wrapperPaus")}</Pill>
          <Pill selected={s.wrapper === "koverat"} onClick={() => set({ wrapper: "koverat" })}>{t("wrapperKoverat")}</Pill>
        </div>

        {s.wrapper === "koverat" && options.envelopes.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 font-body text-sm text-ink-muted">{t("envelope")}</p>
            <SwatchGrid>
              {options.envelopes.map((e) => (
                <Swatch
                  key={e._id}
                  imageUrl={e.swatchUrl}
                  label={pick(e.name, locale)}
                  price={e.pricePerPiece}
                  currency={t("currency")}
                  selected={s.envelopeId === e._id}
                  onClick={() => set({ envelopeId: e._id })}
                />
              ))}
            </SwatchGrid>
          </div>
        )}
      </section>

      {/* Add-ons */}
      <section>
        <Heading>{t("addons")}</Heading>
        <div className="flex flex-col gap-2">
          <Toggle checked={s.tornEdges} onChange={(v) => set({ tornEdges: v })}>{t("tornEdges")}</Toggle>
          <Toggle checked={s.goldEdges} onChange={(v) => set({ goldEdges: v })}>{t("goldEdges")}</Toggle>
          <Toggle checked={s.roundedCorners} onChange={(v) => set({ roundedCorners: v })}>{t("roundedCorners")}</Toggle>
        </div>
      </section>

      {/* Seal */}
      <section>
        <Heading>{t("seal")}</Heading>
        <div className="flex flex-wrap gap-2">
          {(["none", "plain", "goldLeaf", "tatarika"] as SealType[]).map((st) => (
            <Pill key={st} selected={s.sealType === st} onClick={() => set({ sealType: st })}>
              {t(st === "none" ? "sealNone" : st === "plain" ? "sealPlain" : st === "goldLeaf" ? "sealGold" : "sealTatarika")}
            </Pill>
          ))}
        </div>

        {s.sealType !== "none" && (
          <div className="mt-4 flex flex-col gap-4">
            {options.sealMotifs.length > 0 && (
              <div>
                <p className="mb-2 font-body text-sm text-ink-muted">{t("sealMotif")}</p>
                <SwatchGrid>
                  {options.sealMotifs.map((m) => (
                    <Swatch
                      key={m._id}
                      imageUrl={m.imageUrl}
                      label={pick(m.name, locale)}
                      selected={s.sealMotifId === m._id}
                      onClick={() => set({ sealMotifId: m._id })}
                    />
                  ))}
                </SwatchGrid>
              </div>
            )}
            {options.sealColors.length > 0 && (
              <div>
                <p className="mb-2 font-body text-sm text-ink-muted">{t("sealColor")}</p>
                <SwatchGrid>
                  {options.sealColors.map((c) => (
                    <Swatch
                      key={c._id}
                      imageUrl={c.swatchUrl}
                      label={pick(c.name, locale)}
                      selected={s.sealColorId === c._id}
                      onClick={() => set({ sealColorId: c._id })}
                    />
                  ))}
                </SwatchGrid>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">{children}</h2>;
}

// Quantity field with a local text buffer so it can be cleared while typing (the price
// keeps the last valid value); on blur it snaps back to a valid whole number ≥ 1.
function QuantityInput({ value, onChange }: { value: number; onChange: (q: number) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <input
      type="number"
      min={1}
      inputMode="numeric"
      value={text}
      onChange={(e) => {
        const v = e.target.value;
        setText(v);
        const n = Math.floor(Number(v));
        if (v !== "" && Number.isFinite(n) && n >= 1) onChange(n);
      }}
      onBlur={() => {
        const n = Math.max(1, Math.floor(Number(text) || 0));
        setText(String(n));
        onChange(n);
      }}
      className="w-32 rounded-sm border border-line bg-cream px-3 py-2 font-body text-ink outline-none focus:border-gold"
    />
  );
}

function SwatchGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">{children}</div>;
}

function Swatch({
  imageUrl,
  label,
  price,
  currency,
  selected,
  onClick,
}: {
  imageUrl?: string;
  label: string;
  price?: number;
  currency?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      title={label}
      className={`group relative flex flex-col rounded-sm border text-left transition-colors ${
        selected ? "border-gold ring-2 ring-gold/40" : "border-line hover:border-gold"
      }`}
    >
      <span className="relative block aspect-square w-full overflow-hidden rounded-t-sm bg-greige">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={label}
            fill
            sizes="(min-width: 640px) 280px, 120px"
            className="object-cover"
          />
        )}
      </span>
      <span className="px-1.5 py-1">
        <span className="block truncate font-body text-[11px] text-ink">{label}</span>
        {typeof price === "number" && (
          <span className="block font-sans text-[10px] text-ink-muted">
            +{price} {currency}
          </span>
        )}
      </span>

      {/* Hover magnifier: the swatch is ~90px, too small to judge a paper texture by. Shows the
          same image ~3× over the grid. Tailwind's `hover` variant only matches hover-capable
          pointers, so phones never render it — no popover can widen the layout there. */}
      {imageUrl && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-40 hidden w-[270px] max-w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-gold/40 bg-cream p-1 shadow-xl group-hover:block"
        >
          <span className="relative block aspect-square w-full overflow-hidden rounded-[2px]">
            <Image src={imageUrl} alt="" fill sizes="280px" className="object-cover" />
          </span>
        </span>
      )}
    </button>
  );
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-sm border px-4 py-2 font-body text-sm transition-colors ${
        selected ? "border-gold bg-gold text-cream" : "border-line text-ink hover:border-gold"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 font-body text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--c-gold)]"
      />
      {children}
    </label>
  );
}
