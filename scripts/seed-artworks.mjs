// Dev-only: seeds World B test artworks (reusing the placeholder image asset) so the
// /umetnost gallery + price + lightbox + per-item page (/umetnost/[slug]) + SEO can be
// verified before real content exists. Re-runnable (fixed _ids).
// ⚠️ Delete the test items (ids starting "test-art-") before launch.
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
const frame = (sr) => ({ _type: "frame", _key: sr, name: { _type: "localeString", sr } });

const items = [
  {
    _id: "test-art-1", slug: "slavska-ikona-sv-nikola", name: "Славска икона — Св. Никола",
    category: "slava", priceFrom: 4500,
    description: "Ручно осликана славска икона на платну, по вашој жељи. Идеалан поклон за крсну славу.",
    dimensions: ["20×30 cm", "30×40 cm", "50×70 cm"], frames: ["Дрвени рам", "Златни рам"], order: 1,
  },
  {
    _id: "test-art-2", slug: "portret-po-fotografiji", name: "Портрет по фотографији",
    category: "art", priceFrom: 6000,
    description: "Ручно илустрован портрет према вашој фотографији — јединствена успомена.",
    dimensions: ["30×40 cm", "50×70 cm"], frames: ["Дрвени рам"], order: 2,
  },
  {
    _id: "test-art-3", slug: "uokvirena-uspomena", name: "Уоквирена успомена",
    category: "frame", priceFrom: 3000,
    description: "Уоквирено уметничко дело, спремно за поклон или зид.",
    dimensions: ["20×30 cm"], frames: [], order: 3,
  },
].map((it) => ({
  _id: it._id,
  _type: "artwork",
  image: img(),
  name: { _type: "localeString", sr: it.name },
  slug: { _type: "slug", current: it.slug },
  category: it.category,
  description: { _type: "localeText", sr: it.description },
  priceFrom: it.priceFrom,
  dimensions: it.dimensions,
  frames: it.frames.map(frame),
  order: it.order,
}));

const run = async () => {
  for (const it of items) await client.createOrReplace(it);
  console.log(`Seeded ${items.length} test artworks.`);
};
run().catch((e) => { console.error(e); process.exit(1); });
