import { defineType, defineField } from "sanity";

// A World B showcase item (art, slava gift, frame, religious). Showcase → Smart
// Inquiry (not purchasable online for launch, §14). Owner adds these in Studio.
export const artwork = defineType({
  name: "artwork",
  title: "Рад (уметност/поклон)",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Фотографија",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [{ name: "alt", title: "Опис слике (приступачност/SEO)", type: "localeString" }],
    }),
    defineField({ name: "name", title: "Назив", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Категорија",
      type: "string",
      options: {
        list: [
          { title: "Славски поклони", value: "slava" },
          { title: "Уметност (илустрације)", value: "art" },
          { title: "Уоквирено", value: "frame" },
          { title: "Религијско", value: "religious" },
          { title: "Остало", value: "other" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "description", title: "Опис", type: "localeText" }),
    defineField({ name: "order", title: "Редослед (мањи број = раније)", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.sr", subtitle: "category", media: "image" } },
});
