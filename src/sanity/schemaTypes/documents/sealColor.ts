import { defineType, defineField } from "sanity";

// A wax color for the seal (konfigurator §3.2), shown as a swatch image. Replaces the
// plain string list previously kept in `pricing.sealColors` (which had no images).
export const sealColor = defineType({
  name: "sealColor",
  title: "Печат — боја воска",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Назив боје", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "swatch",
      title: "Свотч (узорак боје воска)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "order", title: "Редослед", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name.sr", media: "swatch" },
    prepare: ({ title, media }) => ({ title: title || "Боја", media }),
  },
});
