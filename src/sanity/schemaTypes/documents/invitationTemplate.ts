import { defineType, defineField, defineArrayMember } from "sanity";

// One invitation design the owner adds (konfigurator §3.1 + gallery). It is the BACKGROUND
// image (illustration with empty spots) plus text fields the customer edits — all positions
// in % so the live overlay stays 1:1. `categories`/`types` drive the sidebar filters.
// Double-sided designs add a back image + back fields and auto-charge the double-sided
// add-on (price handled server-side).
// No slug: these pages are reached by clicking a card in the catalog and are not in the
// sitemap, and Cyrillic names make no readable slug — so the route keys off `_id` and the
// owner has one less field to fill in.
export const invitationTemplate = defineType({
  name: "invitationTemplate",
  title: "Позивница — шаблон",
  type: "document",
  groups: [
    { name: "main", title: "Основно", default: true },
    { name: "front", title: "Предња страна" },
    { name: "back", title: "Задња страна (двострана)" },
  ],
  fields: [
    defineField({ name: "name", title: "Име шаблона", type: "string", validation: (r) => r.required(), group: "main" }),
    defineField({
      name: "categories",
      title: "Категорије",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      group: "main",
    }),
    defineField({
      name: "types",
      title: "Типови (облик/димензија)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "invitationType" }] }],
      description: "Нпр. Класична, Квадратна, Издужена — управљаш у „Позивнице — типови\". Пуни „Тип\" филтер у каталогу.",
      group: "main",
    }),
    defineField({
      name: "doubleSided",
      title: "Двострана (предња + задња)",
      type: "boolean",
      initialValue: false,
      description: "Ако је укључено: наплаћује се двострана штампа (+20/ком) и користи се задња страна.",
      group: "main",
    }),
    defineField({ name: "active", title: "Активан (приказан купцима)", type: "boolean", initialValue: true, group: "main" }),
    defineField({ name: "order", title: "Редослед", type: "number", initialValue: 100, group: "main" }),

    // FRONT
    defineField({
      name: "image",
      title: "Слика (предња страна, без текста који купац мења)",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      group: "front",
    }),
    defineField({
      name: "textFields",
      title: "Текст-поља (предња страна)",
      type: "array",
      of: [defineArrayMember({ type: "templateTextField" })],
      group: "front",
    }),

    // BACK (only for double-sided)
    defineField({
      name: "backImage",
      title: "Слика (задња страна)",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => !document?.doubleSided,
      group: "back",
    }),
    defineField({
      name: "backTextFields",
      title: "Текст-поља (задња страна)",
      type: "array",
      of: [defineArrayMember({ type: "templateTextField" })],
      hidden: ({ document }) => !document?.doubleSided,
      group: "back",
    }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", media: "image", double: "doubleSided" },
    prepare: ({ title, media, double }) => ({
      title,
      subtitle: double ? "двострана" : undefined,
      media,
    }),
  },
});
