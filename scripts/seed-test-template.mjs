// Dev-only: seeds ONE test invitationTemplate (with a placeholder background image and
// 3 text fields) so the configurator preview has something to render before the owner
// adds real templates in Studio. Re-runnable: it replaces the doc id "test-template".
// Run:  node scripts/seed-test-template.mjs
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Minimal .env.local loader (no dotenv dependency).
function loadEnv() {
  const out = {};
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
  return out;
}

const env = { ...loadEnv(), ...process.env };
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || "oil2tj3x";
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN (put it in .env.local). Aborting.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const bg = readFileSync(join(__dirname, "test-template-bg.svg"));

const asset = await client.assets.upload("image", bg, { filename: "test-template-bg.svg" });
console.log("Uploaded image asset:", asset._id);

const doc = {
  _id: "test-template",
  _type: "invitationTemplate",
  name: { sr: "Тест шаблон", en: "Test template" },
  slug: { _type: "slug", current: "test-sablon" },
  type: "stampana",
  doubleSided: false,
  image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  active: true,
  order: 1,
  textFields: [
    {
      _key: "imena",
      _type: "templateTextField",
      key: "imena",
      label: { sr: "Имена младенаца", en: "Names" },
      defaultText: "Ана & Марко",
      fontKey: "playfair",
      fontSizePct: 9,
      color: "#927741",
      align: "center",
      xPct: 15,
      yPct: 28,
      widthPct: 70,
      lineHeight: 1.15,
      multiline: false,
      maxLength: 40,
    },
    {
      _key: "datum",
      _type: "templateTextField",
      key: "datum",
      label: { sr: "Датум", en: "Date" },
      defaultText: "12. септембар 2026.",
      fontKey: "cormorant",
      fontSizePct: 5,
      color: "#3D352A",
      align: "center",
      xPct: 20,
      yPct: 46,
      widthPct: 60,
      lineHeight: 1.2,
      multiline: false,
      maxLength: 40,
    },
    {
      _key: "mesto",
      _type: "templateTextField",
      key: "mesto",
      label: { sr: "Место", en: "Place" },
      defaultText: "Црква Св. Ђорђа, Београд",
      fontKey: "lora",
      fontSizePct: 3.6,
      color: "#6C6049",
      align: "center",
      xPct: 12,
      yPct: 56,
      widthPct: 76,
      lineHeight: 1.3,
      multiline: true,
      maxLength: 80,
    },
  ],
};

await client.createOrReplace(doc);
console.log("Seeded invitationTemplate:", doc._id);
process.exit(0);
