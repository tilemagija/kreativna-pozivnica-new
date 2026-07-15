import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";
import { TEMPLATE_FONTS } from "@/lib/templateFonts";

export const runtime = "nodejs";

// Saves the text-field layout for one invitationTemplate — used by the in-app visual
// placement tool (/template-tool). This WRITES to Sanity, so it is guarded: in production
// it requires the TEMPLATE_TOOL_KEY secret (sent as x-admin-key); in local dev it's open
// for convenience. Every field is validated/clamped server-side (never trust the client).
const FONT_KEYS = new Set<string>(TEMPLATE_FONTS.map((f) => f.key));
const ALIGNS = new Set(["left", "center", "right"]);

const num = (v: unknown, d: number, min: number, max: number): number => {
  const n = Number(v);
  if (!Number.isFinite(n)) return d;
  return Math.max(min, Math.min(max, n));
};

// Trim, drop control characters (keeps spaces/letters), cap length.
function str(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  let out = "";
  for (const ch of v) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 32 && code !== 127) out += ch;
  }
  return out.trim().slice(0, max);
}

function localeString(v: unknown): { _type: "localeString"; sr?: string; en?: string } | undefined {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const out: { _type: "localeString"; sr?: string; en?: string } = { _type: "localeString" };
    if (typeof o.sr === "string") out.sr = str(o.sr, 100);
    if (typeof o.en === "string") out.en = str(o.en, 100);
    return out.sr || out.en ? out : undefined;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const expected = process.env.TEMPLATE_TOOL_KEY;
  const provided = req.headers.get("x-admin-key") || "";
  if (!isDev && (!expected || provided !== expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const templateId = str(body.templateId, 200);
  if (!templateId) return NextResponse.json({ error: "no_template" }, { status: 400 });

  const textFields = sanitizeFields(body.textFields);
  const backTextFields = sanitizeFields(body.backTextFields);

  try {
    await writeClient.patch(templateId).set({ textFields, backTextFields }).commit();
  } catch (err) {
    console.error("Failed to save template fields:", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: textFields.length, backCount: backTextFields.length });
}

// Validate/clamp a list of text fields (front or back). Keys are unique within the list.
function sanitizeFields(input: unknown) {
  const raw = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  return raw.slice(0, 30).map((f, i) => {
    const o = (f ?? {}) as Record<string, unknown>;
    let key = str(o.key, 60).toLowerCase().replace(/[^a-z0-9_]/g, "_") || `polje_${i + 1}`;
    while (seen.has(key)) key = `${key}_`;
    seen.add(key);
    const fontKey = FONT_KEYS.has(str(o.fontKey, 40)) ? str(o.fontKey, 40) : TEMPLATE_FONTS[0].key;
    return {
      _type: "templateTextField",
      _key: key,
      key,
      label: localeString(o.label),
      defaultText: str(o.defaultText, 200),
      fontKey,
      fontSizePct: num(o.fontSizePct, 5, 0.5, 40),
      color: /^#[0-9a-fA-F]{3,8}$/.test(str(o.color, 9)) ? str(o.color, 9) : "#3d352a",
      align: ALIGNS.has(str(o.align, 10)) ? str(o.align, 10) : "center",
      xPct: num(o.xPct, 10, 0, 100),
      yPct: num(o.yPct, 10, 0, 100),
      widthPct: num(o.widthPct, 60, 1, 100),
      lineHeight: num(o.lineHeight, 1.2, 0.8, 3),
      multiline: o.multiline === true,
      maxLength: Math.round(num(o.maxLength, 60, 1, 500)),
    };
  });
}
