import { defineType, defineField } from "sanity";

// Editable intro copy + SEO for the "Прилагодите баш вама" page — fully custom designs
// and special invitations (folded, scroll-in-a-bottle…). Pure showcase → Instagram
// (owner's call, same as World B: unique pieces go straight to a DM, not a form).
export const prilagoditePage = defineType({
  name: "prilagoditePage",
  title: "Страница: Прилагодите баш вама",
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
  preview: { prepare: () => ({ title: "Прилагодите баш вама" }) },
});
