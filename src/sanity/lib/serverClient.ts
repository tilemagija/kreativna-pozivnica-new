import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Server-only Sanity client with a write token. NEVER import this into client code —
// the token must never reach the browser (CLAUDE.md §3/§18).
//
// `perspective: "published"` is not optional here: a token-bearing client otherwise also
// returns DRAFTS, which leaked the owner's unfinished designs into the public catalog and
// would let an unpublished `pricing`/`siteSettings` draft drive real prices and bank
// details. Reads must see exactly what the owner has published. (Writes are unaffected.)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_WRITE_TOKEN,
});
