import { defineType, defineField } from "sanity";

// One customer testimonial shown in the social-proof section.
export const testimonial = defineType({
  name: "testimonial",
  title: "Утисак",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Утисак (цитат)",
      type: "localeText",
      validation: (r) => r.required(),
    }),
    defineField({ name: "authorName", title: "Име", type: "string", validation: (r) => r.required() }),
    defineField({ name: "authorDetail", title: "Детаљ (нпр. град, датум венчања)", type: "localeString" }),
    defineField({
      name: "photo",
      title: "Фотографија (опционо)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "order", title: "Редослед (мањи број = раније)", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "authorName", subtitle: "quote.sr", media: "photo" },
  },
});
