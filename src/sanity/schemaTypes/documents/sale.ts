import { defineType, defineField } from "sanity";

// One "Акција" (sale) item — showcase only (no prices, no inquiry per owner).
// Auto-hidden when inactive or past "validUntil".
export const sale = defineType({
  name: "sale",
  title: "Акција (ставка)",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Слика",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [{ name: "alt", title: "Опис слике", type: "localeString" }],
    }),
    defineField({ name: "title", title: "Наслов", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Кратак опис", type: "localeText" }),
    defineField({
      name: "discountPercent",
      title: "Проценат попуста (%)",
      type: "number",
      validation: (r) => r.required().min(1).max(100),
    }),
    defineField({
      name: "validUntil",
      title: "Важи до (опционо)",
      type: "date",
      options: { dateFormat: "DD.MM.YYYY." },
      description: "Ако поставиш датум, акција се сама сакрије после њега.",
    }),
    defineField({
      name: "active",
      title: "Активно",
      type: "boolean",
      initialValue: true,
      description: "Искључи да сакријеш акцију без брисања.",
    }),
    defineField({ name: "order", title: "Редослед", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.sr", percent: "discountPercent", active: "active", media: "image" },
    prepare: ({ title, percent, active, media }) => ({
      title: `${active ? "" : "⏸ "}${title || "Акција"}`,
      subtitle: percent ? `−${percent}%` : "",
      media,
    }),
  },
});
