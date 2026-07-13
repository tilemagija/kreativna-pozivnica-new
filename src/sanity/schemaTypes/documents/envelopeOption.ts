import { defineType, defineField } from "sanity";

// An envelope / wrapper choice for the configurator (Faza 3). Price per piece.
export const envelopeOption = defineType({
  name: "envelopeOption",
  title: "Коверта (опција)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Назив", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "pricePerPiece",
      title: "Цена по комаду (дин)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({ name: "description", title: "Кратак опис", type: "localeText" }),
    defineField({
      name: "swatch",
      title: "Свотч слика (узорак коверте)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "order", title: "Редослед", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name.sr", price: "pricePerPiece", media: "swatch" },
    prepare: ({ title, price, media }) => ({ title, subtitle: `${price} дин/ком`, media }),
  },
});
