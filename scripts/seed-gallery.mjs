// Dev-only: seeds gallery test data — a few categories + printed/digital/double-sided
// test templates (reusing the existing placeholder image asset) so the gallery + tabs +
// category filter + double-sided flow can be verified before real content exists.
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const l of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "oil2tj3x",
  dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: env.SANITY_API_WRITE_TOKEN,
});

const IMG = "image-e3246104f05ba320a9fb37d7ec79529fb57c35ce-500x704-svg";
const img = () => ({ _type: "image", asset: { _type: "reference", _ref: IMG } });
const cat = (id) => ({ _type: "reference", _ref: `category.${id}`, _key: id });

const categories = [
  { _id: "category.vencanje", _type: "category", name: { _type: "localeString", sr: "Венчање" }, slug: { _type: "slug", current: "vencanje" }, order: 1 },
  { _id: "category.krstenje", _type: "category", name: { _type: "localeString", sr: "Крштење" }, slug: { _type: "slug", current: "krstenje" }, order: 2 },
  { _id: "category.decije", _type: "category", name: { _type: "localeString", sr: "Дечије" }, slug: { _type: "slug", current: "decije" }, order: 3 },
];

const field = (key, sr, txt, y, font = "cormorant", size = 6) => ({
  _key: key, _type: "templateTextField", key, label: { _type: "localeString", sr },
  defaultText: txt, fontKey: font, fontSizePct: size, color: "#3d352a", align: "center",
  xPct: 15, yPct: y, widthPct: 70, lineHeight: 1.2, multiline: false, maxLength: 60,
});

const templates = [
  {
    _id: "test-double", _type: "invitationTemplate",
    name: { _type: "localeString", sr: "Тест двострана" }, slug: { _type: "slug", current: "test-dvostrana" },
    doubleSided: true, active: true, order: 2,
    categories: [cat("vencanje"), cat("decije")],
    image: img(), textFields: [field("imena", "Имена", "Ана & Марко", 28, "playfair", 9)],
    backImage: img(), backTextFields: [field("program", "Програм", "Венчање у 17ч", 40)],
  },
  {
    _id: "test-digital", _type: "invitationTemplate",
    name: { _type: "localeString", sr: "Тест дигитална" }, slug: { _type: "slug", current: "test-digitalna" },
    doubleSided: false, active: true, order: 3,
    categories: [cat("krstenje")],
    image: img(), textFields: [field("ime", "Име детета", "Марко", 30, "playfair", 9)],
  },
];

for (const c of categories) await client.createOrReplace(c);
console.log("Seeded categories:", categories.length);
// tag the existing test-template with Венчање
await client.patch("test-template").set({ categories: [cat("vencanje")] }).commit();
console.log("Tagged test-template with Венчање");
for (const t of templates) await client.createOrReplace(t);
console.log("Seeded templates:", templates.map((t) => t._id).join(", "));
// "Двострана" is no longer a category (it's the TIP filter) — remove the old one.
await client.delete("category.dvostrana").catch((e) => console.log("dvostrana delete skipped:", e.message));
console.log("Removed old category.dvostrana");
process.exit(0);
