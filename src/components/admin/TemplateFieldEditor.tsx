"use client";

import { useMemo, useState } from "react";
import type { InvitationTemplate, TemplateTextField } from "@/sanity/queries";
import { TEMPLATE_FONTS } from "@/lib/templateFonts";
import FieldPlacementCanvas from "./FieldPlacementCanvas";

// In-app visual placement tool (§ visual editor). Pick a template, drag its text fields
// onto the design, tweak size/font/color per field, and save back to Sanity. This owns
// the painful part (positioning) visually; the % model it writes is exactly what the live
// configurator + PDF read. Guarded save endpoint: /api/template-fields.
const FALLBACK_ASPECT = 0.71;
const nameOf = (t?: InvitationTemplate) => t?.name?.sr || t?.name?.en || t?._id || "";

type Fields = TemplateTextField[];
type Sides = { front: Fields; back: Fields };
type Side = "front" | "back";

export default function TemplateFieldEditor({ templates }: { templates: InvitationTemplate[] }) {
  const [activeId, setActiveId] = useState(templates[0]?._id);
  const [side, setSide] = useState<Side>("front");
  const [byId, setById] = useState<Record<string, Sides>>(() =>
    Object.fromEntries(
      templates.map((t) => [
        t._id,
        {
          front: (t.textFields ?? []).map((f) => ({ ...f })),
          back: (t.backTextFields ?? []).map((f) => ({ ...f })),
        },
      ]),
    ),
  );
  const [selectedKey, setSelectedKey] = useState<string>();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

  const active = useMemo(
    () => templates.find((t) => t._id === activeId) ?? templates[0],
    [templates, activeId],
  );

  if (!active) return <p className="p-8 font-body text-ink-muted">Нема шаблона.</p>;

  const sides = byId[active._id] ?? { front: [], back: [] };
  const fields = sides[side];
  const selected = fields.find((f) => f.key === selectedKey);

  function setFields(next: Fields) {
    setById((prev) => ({ ...prev, [active._id]: { ...prev[active._id], [side]: next } }));
    setStatus("idle");
  }
  const patch = (key: string, p: Partial<TemplateTextField>) =>
    setFields(fields.map((f) => (f.key === key ? { ...f, ...p } : f)));

  function addField() {
    let key = `polje_${fields.length + 1}`;
    while (fields.some((f) => f.key === key)) key += "_";
    setFields([
      ...fields,
      { key, label: { sr: "Ново поље" }, defaultText: "Текст", fontKey: TEMPLATE_FONTS[0].key,
        fontSizePct: 6, color: "#3d352a", align: "center", xPct: 20, yPct: 40, widthPct: 60,
        lineHeight: 1.2, multiline: false, maxLength: 60 },
    ]);
    setSelectedKey(key);
  }
  function removeField(key: string) {
    setFields(fields.filter((f) => f.key !== key));
    if (selectedKey === key) setSelectedKey(undefined);
  }
  function switchSide(next: Side) {
    setSide(next);
    setSelectedKey(undefined);
  }
  function switchTemplate(id: string) {
    setActiveId(id);
    setSide("front");
    setSelectedKey(undefined);
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/template-fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": (typeof window !== "undefined" && localStorage.getItem("templateToolKey")) || "",
        },
        body: JSON.stringify({
          templateId: active._id,
          textFields: sides.front,
          backTextFields: active.doubleSided ? sides.back : [],
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("saved");
      setMsg("Сачувано ✓");
    } catch (e) {
      setStatus("error");
      setMsg(`Грешка при чувању (${e instanceof Error ? e.message : "?"})`);
    }
  }

  const imageUrl = side === "back" ? active.backImageUrl : active.imageUrl;
  const rawAspect = side === "back" ? active.backAspect : active.aspect;
  const aspect = rawAspect && rawAspect > 0 ? rawAspect : FALLBACK_ASPECT;

  const sideBtn = (value: Side, label: string) => (
    <button
      type="button"
      onClick={() => switchSide(value)}
      className={`rounded-sm px-4 py-1.5 font-body text-sm ${side === value ? "bg-gold text-cream" : "border border-line text-ink hover:border-gold"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* LEFT: template picker + side toggle + canvas */}
      <div>
        {templates.length > 1 && (
          <select
            value={active._id}
            onChange={(e) => switchTemplate(e.target.value)}
            className="mb-4 rounded-sm border border-line bg-cream px-3 py-2 font-body text-ink"
          >
            {templates.map((t) => (
              <option key={t._id} value={t._id}>{nameOf(t)}{t.active === false ? " (скривен)" : ""}</option>
            ))}
          </select>
        )}

        {active.doubleSided && (
          <div className="mb-4 flex gap-2">
            {sideBtn("front", "Предња")}
            {sideBtn("back", "Задња")}
          </div>
        )}

        <div className="mx-auto max-w-md">
          <FieldPlacementCanvas
            imageUrl={imageUrl}
            aspect={aspect}
            fields={fields}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            onMove={(key, xPct, yPct) => patch(key, { xPct, yPct })}
          />
        </div>
        <p className="mt-3 text-center font-body text-sm text-ink-muted">
          Превуците поље по позивници да га поставите. Кликните да га изаберете.
          {active.doubleSided && side === "back" && !active.backImageUrl && (
            <span className="mt-1 block text-terracotta">Нема слике задње стране — окачите је у Studiju.</span>
          )}
        </p>
      </div>

      {/* RIGHT: field list + selected field controls + save */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {fields.map((f) => (
            <button key={f.key} type="button" onClick={() => setSelectedKey(f.key)}
              className={`rounded-sm border px-3 py-1 font-body text-sm ${f.key === selectedKey ? "border-gold bg-gold text-cream" : "border-line text-ink hover:border-gold"}`}>
              {f.label?.sr || f.key}
            </button>
          ))}
          <button type="button" onClick={addField} className="rounded-sm border border-dashed border-gold px-3 py-1 font-body text-sm text-gold-deep">+ поље</button>
        </div>

        {selected ? (
          <FieldForm field={selected} onPatch={(p) => patch(selected.key, p)} onRemove={() => removeField(selected.key)} />
        ) : (
          <p className="font-body text-sm text-ink-muted">Изаберите поље да мењате фонт, величину, боју…</p>
        )}

        <button type="button" onClick={save} disabled={status === "saving"}
          className="rounded-sm bg-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream hover:bg-gold-deep disabled:opacity-60">
          {status === "saving" ? "Чува се…" : "Сачувајте распоред"}
        </button>
        {msg && <p className={`font-body text-sm ${status === "error" ? "text-terracotta" : "text-sage-deep"}`}>{msg}</p>}
      </div>
    </div>
  );
}

function FieldForm({
  field, onPatch, onRemove,
}: {
  field: TemplateTextField;
  onPatch: (p: Partial<TemplateTextField>) => void;
  onRemove: () => void;
}) {
  const input = "w-full rounded-sm border border-line bg-cream px-3 py-2 font-body text-ink outline-none focus:border-gold";
  const Label = ({ children }: { children: React.ReactNode }) => (
    <span className="mb-1 block font-body text-xs text-ink-muted">{children}</span>
  );
  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-greige/30 p-4">
      <label><Label>Назив (за купца)</Label>
        <input className={input} value={field.label?.sr ?? ""} onChange={(e) => onPatch({ label: { ...field.label, sr: e.target.value } })} /></label>
      <label><Label>Пример текста</Label>
        <input className={input} value={field.defaultText ?? ""} onChange={(e) => onPatch({ defaultText: e.target.value })} /></label>
      <label><Label>Фонт</Label>
        <select className={input} value={field.fontKey ?? TEMPLATE_FONTS[0].key} onChange={(e) => onPatch({ fontKey: e.target.value })}>
          {TEMPLATE_FONTS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select></label>
      <label><Label>Величина: {field.fontSizePct ?? 5}</Label>
        <input type="range" min={1} max={20} step={0.5} value={field.fontSizePct ?? 5} onChange={(e) => onPatch({ fontSizePct: Number(e.target.value) })} className="w-full accent-[var(--c-gold)]" /></label>
      <label><Label>Ширина: {field.widthPct ?? 60}%</Label>
        <input type="range" min={5} max={100} step={1} value={field.widthPct ?? 60} onChange={(e) => onPatch({ widthPct: Number(e.target.value) })} className="w-full accent-[var(--c-gold)]" /></label>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2"><Label>Боја</Label>
          <input type="color" value={field.color ?? "#3d352a"} onChange={(e) => onPatch({ color: e.target.value })} className="h-8 w-10 rounded border border-line" /></label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button key={a} type="button" onClick={() => onPatch({ align: a })}
              className={`rounded-sm border px-2 py-1 text-xs ${field.align === a ? "border-gold bg-gold text-cream" : "border-line text-ink"}`}>{a === "left" ? "◧" : a === "center" ? "▣" : "◨"}</button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 font-body text-sm text-ink">
        <input type="checkbox" checked={field.multiline ?? false} onChange={(e) => onPatch({ multiline: e.target.checked })} className="h-4 w-4 accent-[var(--c-gold)]" />
        Више редова
      </label>
      <button type="button" onClick={onRemove} className="self-start font-body text-sm text-terracotta hover:underline">Обриши поље</button>
    </div>
  );
}
