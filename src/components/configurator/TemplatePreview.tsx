"use client";

import Image from "next/image";
import type { InvitationTemplate, TemplateTextField } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import { fontFamilyFor } from "@/lib/templateFonts";

// Live preview (konfigurator §5): the template image with the customer's text laid over
// it as real HTML. Every position/size is a % of the preview width (font-size in cqw), so
// it renders identically on phone and desktop. The text is CONTROLLED from React state —
// one source of truth — so it updates live and the checkout data is always correct. The
// customer edits TEXT ONLY (font/position/size/color are fixed by the owner's design).
//
// Editing itself happens in the side panel (mobile-reliable). Clicking a text field on the
// invitation focuses its panel input (onFieldClick), keeping the "click the invitation to
// edit that part" feel without the fragility of contentEditable-with-external-writes.
export type PreviewValues = Record<string, string>;

const FALLBACK_ASPECT = 0.71; // A6 portrait, used when image metadata has no ratio

export default function TemplatePreview({
  template,
  values,
  locale,
  onFieldClick,
  interactive = true,
}: {
  template: InvitationTemplate;
  values: PreviewValues;
  locale: string;
  onFieldClick?: (key: string) => void;
  interactive?: boolean;
}) {
  const aspect = template.aspect && template.aspect > 0 ? template.aspect : FALLBACK_ASPECT;

  return (
    <div
      className="tp-canvas relative mx-auto w-full overflow-hidden rounded-sm bg-cream shadow-[0_10px_40px_-12px_rgba(61,53,42,0.35)] ring-1 ring-line"
      style={{ aspectRatio: String(aspect) }}
    >
      {template.imageUrl && (
        <Image
          src={template.imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="pointer-events-none select-none object-cover"
          draggable={false}
          priority
        />
      )}

      {(template.textFields ?? []).map((field) => (
        <FieldBox
          key={field.key}
          field={field}
          value={values[field.key] ?? ""}
          label={pick(field.label, locale) || field.key}
          onFieldClick={interactive ? onFieldClick : undefined}
        />
      ))}
    </div>
  );
}

function FieldBox({
  field,
  value,
  label,
  onFieldClick,
}: {
  field: TemplateTextField;
  value: string;
  label: string;
  onFieldClick?: (key: string) => void;
}) {
  const clickable = !!onFieldClick;

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${field.xPct ?? 0}%`,
    top: `${field.yPct ?? 0}%`,
    width: `${field.widthPct ?? 60}%`,
    fontFamily: fontFamilyFor(field.fontKey),
    fontSize: `${field.fontSizePct ?? 5}cqw`,
    color: field.color ?? "#3d352a",
    textAlign: field.align ?? "center",
    lineHeight: String(field.lineHeight ?? 1.2),
    whiteSpace: field.multiline ? "pre-wrap" : "normal",
  };

  return (
    <div
      className={`tp-field${clickable ? " tp-field--clickable" : ""}`}
      style={style}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? label : undefined}
      onClick={clickable ? () => onFieldClick!(field.key) : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFieldClick!(field.key);
              }
            }
          : undefined
      }
    >
      {value || (clickable ? <span className="tp-field__placeholder">{label}</span> : "")}
    </div>
  );
}
