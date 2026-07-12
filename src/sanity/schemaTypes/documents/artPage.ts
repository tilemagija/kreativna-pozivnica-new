import { defineType, defineField } from "sanity";

// Editable intro copy + SEO for the "Уметност и поклони" (World B) page.
export const artPage = defineType({
  name: "artPage",
  title: "Страница: Уметност и поклони",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Надтекст", type: "localeString" }),
    defineField({ name: "heading", title: "Наслов", type: "localeString" }),
    defineField({ name: "intro", title: "Уводни текст", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO наслов (таб/Google)", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO опис", type: "localeText" }),
  ],
  preview: { prepare: () => ({ title: "Уметност и поклони" }) },
});
