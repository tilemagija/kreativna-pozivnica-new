import { defineType } from "sanity";

// Reusable bilingual short text (sr-Cyrl + en). Used for headings, labels, titles.
// Editors fill both languages; the site shows the one matching the active locale.
export const localeString = defineType({
  name: "localeString",
  title: "Текст (двојезично)",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    { name: "sr", title: "Српски (ћирилица)", type: "string" },
    { name: "en", title: "English", type: "string" },
  ],
});
