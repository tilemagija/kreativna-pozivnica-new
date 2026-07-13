import { defineType, defineField } from "sanity";

// Editable intro copy + SEO for the "Акција" (sale) page.
export const salePage = defineType({
  name: "salePage",
  title: "Страница: Акција",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Надтекст", type: "localeString" }),
    defineField({ name: "heading", title: "Наслов", type: "localeString" }),
    defineField({ name: "intro", title: "Уводни текст", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO наслов", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO опис", type: "localeText" }),
  ],
  preview: { prepare: () => ({ title: "Акција" }) },
});
