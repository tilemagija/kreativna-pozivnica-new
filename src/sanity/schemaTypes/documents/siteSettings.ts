import { defineType, defineField } from "sanity";

// Global settings — one document. Contact email + Instagram used from Phase 1.3 on.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Подешавања сајта",
  type: "document",
  fields: [
    defineField({
      name: "instagramHandle",
      title: "Instagram корисничко име",
      type: "string",
      description: "Нпр. kreativna_pozivnica (без @).",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram линк",
      type: "url",
      description: "Пуна адреса профила, нпр. https://instagram.com/kreativna_pozivnica",
    }),
    defineField({
      name: "contactEmail",
      title: "Мејл за упите",
      type: "string",
      description: "Овде ће стизати упити послати са сајта (користи се од касније фазе).",
    }),
    defineField({
      name: "footerNote",
      title: "Текст у футеру",
      type: "localeText",
    }),
  ],
  preview: { prepare: () => ({ title: "Подешавања сајта" }) },
});
