import { defineType, defineField } from "sanity";

// One real work in the gallery (the moat). Rendered as a mosaic on the landing.
export const galleryItem = defineType({
  name: "galleryItem",
  title: "Рад у галерији",
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
    defineField({ name: "title", title: "Назив рада", type: "localeString" }),
    defineField({
      name: "category",
      title: "Категорија",
      type: "string",
      options: {
        list: [
          { title: "Позивнице", value: "invitations" },
          { title: "Уметност и поклони", value: "art" },
          { title: "Слава", value: "slava" },
          { title: "Остало", value: "other" },
        ],
      },
    }),
    defineField({ name: "order", title: "Редослед (мањи број = раније)", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.sr", media: "image", subtitle: "category" },
  },
});
