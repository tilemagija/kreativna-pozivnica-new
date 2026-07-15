import { defineType, defineField } from "sanity";

// One showcase image on the "Додаци" page (a thank-you card, guest gift, welcome sign,
// boutonniere…). No category, no price — purely informative. Owner/wife adds these freely.
export const dodaciItem = defineType({
  name: "dodaciItem",
  title: "Додатак (ставка)",
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
