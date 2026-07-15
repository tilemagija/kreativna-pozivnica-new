"use client";

import type { TemplateTextField } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import type { PreviewValues } from "./TemplatePreview";

// The "Уреди текст" panel (konfigurator §1): a labeled input per editable field. Typing
// here updates the invitation live — it shares state with the click-on-the-invitation
// editing, so both stay in sync. This is the mobile-reliable path (tapping tiny text on
// an image is fiddly on phones); the two together are the "best of both".
export default function TextEditPanel({
  fields,
  values,
  onChange,
  locale,
  title,
  registerRef,
}: {
  fields: TemplateTextField[];
  values: PreviewValues;
  onChange: (key: string, value: string) => void;
  locale: string;
  title: string;
  registerRef?: (key: string, el: HTMLInputElement | HTMLTextAreaElement | null) => void;
}) {
  if (!fields.length) return null;

  return (
    <section>
      <h2 className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">{title}</h2>
      <div className="flex flex-col gap-4">
        {fields.map((f) => {
          const label = pick(f.label, locale) || f.key;
          const value = values[f.key] ?? "";
          const max = f.maxLength ?? 200;
          const shared =
            "w-full rounded-sm border border-line bg-cream px-3 py-2 font-body text-ink outline-none transition-colors focus:border-gold";
          return (
            <label key={f.key} className="flex flex-col gap-1">
              <span className="flex items-baseline justify-between font-body text-sm text-ink-muted">
                <span>{label}</span>
                <span className="font-sans text-[11px] text-line">
                  {value.length}/{max}
                </span>
              </span>
              {f.multiline ? (
                <textarea
                  ref={(el) => registerRef?.(f.key, el)}
                  value={value}
                  maxLength={max}
                  rows={2}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={`${shared} resize-none`}
                />
              ) : (
                <input
                  ref={(el) => registerRef?.(f.key, el)}
                  value={value}
                  maxLength={max}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className={shared}
                />
              )}
            </label>
          );
        })}
      </div>
    </section>
  );
}
