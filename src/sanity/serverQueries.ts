import "server-only";
import { writeClient } from "./lib/serverClient";
import {
  OPTIONS_QUERY,
  CATALOG_QUERY,
  TEMPLATE_BY_ID_QUERY,
  TEMPLATE_NAME_PROJECTION,
  type ConfiguratorOptions,
  type InvitationTemplate,
  type CatalogData,
} from "./queries";

// Configurator pricing/options (paperOption, envelopeOption, sealMotif, sealColor) are
// NOT in this dataset's public read grant — only `invitationTemplate`/`pricing`/etc. are.
// So we read them with the authenticated server client (token stays server-side, §3).
// Called only from the server component page, never the browser.
export async function getConfiguratorOptionsServer(): Promise<ConfiguratorOptions> {
  return writeClient.fetch(OPTIONS_QUERY, {}, { next: { revalidate: 60 } });
}

// All templates (incl. inactive) with their text fields — for the visual placement tool.
const TOOL_TEXTFIELDS = `{
  key, label, defaultText, fontKey, fontSizePct, color, align,
  xPct, yPct, widthPct, lineHeight, multiline, maxLength
}`;
const TOOL_TEMPLATES_QUERY = `*[_type == "invitationTemplate"] | order(order asc){
  _id, ${TEMPLATE_NAME_PROJECTION}, active, doubleSided,
  "imageUrl": image.asset->url,
  "aspect": image.asset->metadata.dimensions.aspectRatio,
  textFields[]${TOOL_TEXTFIELDS},
  "backImageUrl": backImage.asset->url,
  "backAspect": backImage.asset->metadata.dimensions.aspectRatio,
  backTextFields[]${TOOL_TEXTFIELDS}
}`;

export async function getTemplatesForToolServer(): Promise<InvitationTemplate[]> {
  return writeClient.fetch(TOOL_TEMPLATES_QUERY, {}, { cache: "no-store" });
}

// Gallery data (templates + categories). Read server-side because `category` is not in the
// dataset's public read grant (same as the configurator options).
export async function getGalleryDataServer(): Promise<CatalogData> {
  return writeClient.fetch(CATALOG_QUERY, {}, { next: { revalidate: 60 } });
}

// One template (front + back) by document id — for its dedicated configurator page.
// The id comes straight from the URL, so it is treated as untrusted: it is bound as a GROQ
// parameter (never string-concatenated), `drafts.` ids are refused so unpublished work is
// never served, and the query itself requires `active == true` so a design the owner hid
// from the catalog cannot be reached by guessing its address. A miss returns null → 404.
export async function getTemplateByIdServer(id: string): Promise<InvitationTemplate | null> {
  if (!id || id.startsWith("drafts.")) return null;
  return writeClient.fetch(TEMPLATE_BY_ID_QUERY, { id }, { next: { revalidate: 60 } });
}
