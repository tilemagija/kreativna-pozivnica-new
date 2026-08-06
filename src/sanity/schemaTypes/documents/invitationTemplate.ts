import { defineType, defineField, defineArrayMember } from "sanity";
import { TemplateFieldsSummary } from "../../components/TemplateFieldsSummary";

// One invitation design the owner adds (konfigurator §3.1 + gallery). It is the BACKGROUND
// image (illustration with empty spots) plus text fields the customer edits — all positions
// in % so the live overlay stays 1:1. `categories`/`types` drive the sidebar filters.
// Double-sided designs add a back image + back fields and auto-charge the double-sided
// add-on (price handled server-side).
//
// The form is deliberately ONE flat page in the owner's own working order (sided → images →
// name → filters): field groups/tabs split this across screens and confused more than they
// organised. Text-field placement is authored visually in /template-tool, so those arrays
// render as a read-only summary here — see TemplateFieldsSummary.
//
// No slug: these pages are reached by clicking a card in the catalog and are not in the
// sitemap, and Cyrillic names make no readable slug — so the route keys off `_id` and the
// owner has one less field to fill in.
export const invitationTemplate = defineType({
  name: "invitationTemplate",
  title: "Позивница — шаблон",
  type: "document",
  fields: [
    // 1 — sided first: it decides whether the back-side image below is even shown.
    defineField({
      name: "doubleSided",
      title: "Двострана (предња + задња)",
      type: "boolean",
      initialValue: false,
      description:
        "Неукључено = једнострана. Укључено = двострана: тражи и задњу слику и наплаћује двострану штампу (+20/ком).",
    }),

    // 2 — the design itself.
    defineField({
      name: "image",
      title: "Слика — предња страна",
      type: "image",
      options: { hotspot: true },
      description: "Позадина БЕЗ текста који купац мења (тај текст се додаје преко, у алату).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "backImage",
      title: "Слика — задња страна",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => !document?.doubleSided,
      validation: (r) =>
        r.custom((value, context) =>
          (context.document as { doubleSided?: boolean } | undefined)?.doubleSided && !value
            ? "Двострана позивница тражи и слику задње стране."
            : true,
        ),
    }),

    // 3 — name (single field, no translation).
    defineField({
      name: "name",
      title: "Име шаблона",
      type: "string",
      validation: (r) => r.required(),
    }),

    // 4 + 5 — filters. Pick from existing only: new categories/types are managed in their own
    // Studio lists, so they can't be created ad-hoc here and quietly duplicated.
    defineField({
      name: "categories",
      title: "Категорије",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }], options: { disableNew: true } }],
      description: "Бира се из постојећих — нове се додају у „Позивнице — категорије“.",
    }),
    defineField({
      name: "types",
      title: "Типови (облик/димензија)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "invitationType" }], options: { disableNew: true } }],
      description: "Бира се из постојећих — нови се додају у „Позивнице — типови“.",
    }),

    defineField({ name: "active", title: "Активан (приказан купцима)", type: "boolean", initialValue: true }),
    defineField({ name: "order", title: "Редослед", type: "number", initialValue: 100 }),

    // Read-only: authored in /template-tool, kept here because the configurator reads it.
    defineField({
      name: "textFields",
      title: "Текст-поља — предња страна",
      type: "array",
      of: [defineArrayMember({ type: "templateTextField" })],
      readOnly: true,
      components: { input: TemplateFieldsSummary },
    }),
    defineField({
      name: "backTextFields",
      title: "Текст-поља — задња страна",
      type: "array",
      of: [defineArrayMember({ type: "templateTextField" })],
      hidden: ({ document }) => !document?.doubleSided,
      readOnly: true,
      components: { input: TemplateFieldsSummary },
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
