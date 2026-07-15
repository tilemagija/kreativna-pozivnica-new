import { defineType, defineField } from "sanity";

// Editable intro copy + SEO for the "Додаци" page (World A supporting stationery:
// thank-you cards, guest gifts, welcome signs, boutonnieres…). Pure showcase → Instagram.
export const dodaciPage = defineType({
  name: "dodaciPage",
  title: "Страница: Додаци",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Надтекст", type: "localeString" }),
    defineField({ name: "heading", title: "Наслов", type: "localeString" }),
    defineField({ name: "intro", title: "Уводни текст", type: "localeText" }),
    defineField({
      name: "ctaLabel",
      title: "Текст дугмета (води на Instagram)",
      type: "localeString",
    }),
    defineField({ name: "seoTitle", title: "SEO наслов (таб/Google)", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO опис", type: "localeText" }),
  ],
  preview: { prepare: () => ({ title: "Додаци" }) },
});
