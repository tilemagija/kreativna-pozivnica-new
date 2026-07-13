import { defineType, defineField, defineArrayMember } from "sanity";

// "Настанак" page (merged how-it's-made / process). YouTube videos of the craft.
export const nastanakPage = defineType({
  name: "nastanakPage",
  title: "Страница: Настанак",
  type: "document",
  fields: [
    defineField({ name: "kicker", title: "Надтекст", type: "localeString" }),
    defineField({ name: "heading", title: "Наслов", type: "localeString" }),
    defineField({ name: "intro", title: "Уводни текст", type: "localeText" }),
    defineField({
      name: "videos",
      title: "Снимци (YouTube)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", title: "Наслов снимка", type: "localeString" },
            {
              name: "youtube",
              title: "YouTube линк",
              type: "url",
              description: "Налепи цео линк снимка (нпр. https://youtu.be/...).",
              validation: (r) => r.required(),
            },
            { name: "description", title: "Кратак опис", type: "localeText" },
          ],
          preview: { select: { title: "title.sr", subtitle: "youtube" } },
        }),
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO наслов", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO опис", type: "localeText" }),
  ],
  preview: { prepare: () => ({ title: "Настанак" }) },
});
