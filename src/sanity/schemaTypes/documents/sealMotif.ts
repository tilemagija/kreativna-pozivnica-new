import { defineType, defineField } from "sanity";

// A wax-seal motif/imprint the customer can choose (konfigurator §3.2), shown with an
// image. Seal prices themselves stay in `pricing` (sealBase / +gold leaf / +tatarika).
export const sealMotif = defineType({
  name: "sealMotif",
  title: "Печат — мотив",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Назив", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "image",
      title: "Слика отиска/мотива",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Редослед", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name.sr", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Мотив", media }),
  },
});
