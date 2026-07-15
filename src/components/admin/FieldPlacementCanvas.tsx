"use client";

import Image from "next/image";
import { useRef } from "react";
import type { TemplateTextField } from "@/sanity/queries";
import { fontFamilyFor } from "@/lib/templateFonts";

// Visual placement surface for the template tool: the design image with each text field
// shown where it will appear. Drag a field to reposition it (updates xPct/yPct, all in %
// of the image so it stays 1:1 with the live configurator). Click selects a field. Size /
// font / color are edited in the side panel — here we own POSITION, the painful part.
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const round1 = (v: number) => Math.round(v * 10) / 10;

export default function FieldPlacementCanvas({
  imageUrl,
  aspect,
  fields,
  selectedKey,
  onSelect,
  onMove,
}: {
  imageUrl?: string;
  aspect: number;
  fields: TemplateTextField[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  onMove: (key: string, xPct: number, yPct: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<
    { key: string; px: number; py: number; ox: number; oy: number; w: number; h: number } | null
  >(null);

  function onPointerDown(e: React.PointerEvent, f: TemplateTextField) {
    e.preventDefault();
    onSelect(f.key);
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    drag.current = {
      key: f.key,
      px: e.clientX,
      py: e.clientY,
      ox: f.xPct ?? 0,
      oy: f.yPct ?? 0,
      w: rect.width,
      h: rect.height,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const nx = clamp(d.ox + ((e.clientX - d.px) / d.w) * 100, 0, 100);
    const ny = clamp(d.oy + ((e.clientY - d.py) / d.h) * 100, 0, 100);
    onMove(d.key, round1(nx), round1(ny));
  }

  function endDrag(e: React.PointerEvent) {
    drag.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  return (
    <div
      ref={ref}
      className="tp-canvas relative w-full select-none overflow-hidden rounded-sm bg-cream ring-1 ring-line"
      style={{ aspectRatio: String(aspect) }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 520px"
          className="pointer-events-none object-cover"
          draggable={false}
        />
      )}

      {fields.map((f) => {
        const selected = f.key === selectedKey;
        return (
          <div
            key={f.key}
            data-fieldkey={f.key}
            onPointerDown={(e) => onPointerDown(e, f)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`tp-field absolute cursor-move touch-none rounded-[2px] ${
              selected
                ? "outline outline-2 outline-offset-1 outline-gold"
                : "outline-dashed outline-1 outline-gold/50 hover:outline-gold"
            }`}
            style={{
              left: `${f.xPct ?? 0}%`,
              top: `${f.yPct ?? 0}%`,
              width: `${f.widthPct ?? 60}%`,
              fontFamily: fontFamilyFor(f.fontKey),
              fontSize: `${f.fontSizePct ?? 5}cqw`,
              color: f.color ?? "#3d352a",
              textAlign: (f.align as "left" | "center" | "right") ?? "center",
              lineHeight: String(f.lineHeight ?? 1.2),
              whiteSpace: f.multiline ? "pre-wrap" : "normal",
            }}
          >
            {f.defaultText || f.key}
          </div>
        );
      })}
    </div>
  );
}
