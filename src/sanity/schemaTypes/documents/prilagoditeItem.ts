import { defineType, defineField } from "sanity";

// One showcase example on the "Прилагодите баш вама" page (a fully custom design, a
// folded invitation, a scroll-in-a-bottle…). No price, no configurator — purely a
// visual example that leads to an Instagram inquiry. Owner/wife adds these freely.
export const prilagoditeItem = defineType({
  name: "prilagoditeItem",
  title: "Прилагодите — пример",
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
    defineField({ name: "caption", title: "Назив (опционо)", type: "localeString" }),
    defineField({ name: "order", title: "Редослед (мањи број = раније)", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "caption.sr", media: "image" } },
});
