// Dev-only: sets a PLACEHOLDER digital-invitation price on the pricing singleton so the
// digital flow (/napravite-svoju/[slug]?tip=digitalna) can be verified before the owner
// sets the real price. Safe to re-run. ⚠️ Owner sets the real price in Studio → Ценовник.
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

const res = await client
  .patch("pricing")
  .setIfMissing({ digitalPrice: 3000 })
  .commit();
console.log("digitalPrice =", res.digitalPrice);
