import { defineType } from "sanity";

// Reusable bilingual long text (sr-Cyrl + en) — paragraphs, descriptions, quotes.
export const localeText = defineType({
  name: "localeText",
  title: "Пасус (двојезично)",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    { name: "sr", title: "Српски (ћирилица)", type: "text", rows: 3 },
    { name: "en", title: "English", type: "text", rows: 3 },
  ],
});
