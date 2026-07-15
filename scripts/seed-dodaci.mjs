// Dev-only: seeds "Додаци" test data — the page singleton + a few showcase items
// (reusing the existing placeholder image asset) so the /dodaci page + nav link + IG
// button can be verified before real content exists. Re-runnable (fixed _ids).
// ⚠️ Delete the test items (ids starting "test-dodaci-") before launch.
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

const page = {
  _id: "dodaciPage",
  _type: "dodaciPage",
  kicker: { _type: "localeString", sr: "Уз позивницу", en: "Alongside the invitation" },
  heading: { _type: "localeString", sr: "Додаци", en: "Add-ons" },
  intro: {
    _type: "localeText",
    sr: "Радимо и пратеће ствари за ваше славље — захвалнице, поклоне за госте, табле добродошлице, китке и још много тога. Јавите нам се да заједно осмислимо детаље.",
    en: "We also make the pieces that complete your celebration — thank-you cards, guest gifts, welcome signs, boutonnieres and more. Get in touch and we'll design the details together.",
  },
  ctaLabel: { _type: "localeString", sr: "Јавите нам се", en: "Get in touch" },
};

const items = [
  ["test-dodaci-1", "Захвалнице", 1],
  ["test-dodaci-2", "Поклони за госте", 2],
  ["test-dodaci-3", "Табле добродошлице", 3],
  ["test-dodaci-4", "Китке", 4],
].map(([_id, sr, order]) => ({
  _id,
  _type: "dodaciItem",
  image: img(),
  caption: { _type: "localeString", sr },
  order,
}));

const run = async () => {
  await client.createOrReplace(page);
  for (const it of items) await client.createOrReplace(it);
  console.log(`Seeded dodaciPage + ${items.length} test items.`);
};
run().catch((e) => { console.error(e); process.exit(1); });
