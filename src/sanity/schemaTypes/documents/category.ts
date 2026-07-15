import { defineType, defineField } from "sanity";

// A gallery category for invitation designs (e.g. Венчање, Крштење, Слава, Двострана).
// Managed by the owner in Studio. Templates reference one or more categories; the gallery
// sidebar shows the categories that actually have designs in the active tab.
export const category = defineType({
  name: "category",
  title: "Категорија",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Назив", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (за адресу/филтер)",
      type: "slug",
      options: { source: "name.sr", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Редослед", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name.sr", subtitle: "slug.current" },
  },
});
