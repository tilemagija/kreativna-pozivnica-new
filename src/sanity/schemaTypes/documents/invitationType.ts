import { defineType, defineField } from "sanity";

// An invitation TYPE — shape/format the owner manages in Studio (e.g. Класична, Квадратна,
// Издужена, Панорама). Mirrors `category`: templates reference one or more types, and the
// gallery "Тип" sidebar shows the types that actually have designs. Kept separate from the
// single/double-sided print option (that stays a per-template pricing flag, not a filter).
export const invitationType = defineType({
  name: "invitationType",
  title: "Тип позивнице (облик/димензија)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Назив", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (за филтер)",
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
