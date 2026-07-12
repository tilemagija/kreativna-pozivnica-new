import { defineType, defineField } from "sanity";

// A saved inquiry (Smart Inquiry, §16). Written server-side by /api/inquiry.
// Permanent evidence so no lead is lost; owner works them via the "handled" flag.
export const inquiry = defineType({
  name: "inquiry",
  title: "Упит",
  type: "document",
  // Read-only in Studio — these come from the website, not hand-entered.
  fields: [
    defineField({ name: "name", title: "Име", type: "string", readOnly: true }),
    defineField({ name: "contact", title: "Контакт (мејл/телефон)", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Порука", type: "text", readOnly: true }),
    defineField({
      name: "context",
      title: "Одакле је упит (производ/секција)",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "createdAt", title: "Стигло", type: "datetime", readOnly: true }),
    defineField({
      name: "handled",
      title: "Решено",
      type: "boolean",
      initialValue: false,
      description: "Означи када одговориш на упит.",
    }),
  ],
  orderings: [
    { title: "Најновије", name: "newest", by: [{ field: "createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "context", handled: "handled" },
    prepare: ({ title, subtitle, handled }) => ({
      title: `${handled ? "✓ " : "• "}${title || "Упит"}`,
      subtitle,
    }),
  },
});
