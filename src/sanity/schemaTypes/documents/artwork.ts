import { defineType, defineField, defineArrayMember } from "sanity";
import { AutoSlugInput } from "../../components/AutoSlugInput";

// A World B showcase item (art, slava gift, frame, religious). Showcase → Instagram
// ("Проверите доступност"), NOT purchasable online (§14). Owner/wife adds these in Studio.
// Price is a starting ("од") guide; dimensions + frames are informative options only.
// Each has a slug so it gets its own indexable page (/umetnost/[slug]) — World B is the
// organic-SEO magnet (§13).
export const artwork = defineType({
  name: "artwork",
  title: "Рад (уметност/поклон)",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Фотографија",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [{ name: "alt", title: "Опис слике (приступачност/SEO)", type: "localeString" }],
    }),
    defineField({ name: "name", title: "Назив", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (адреса)",
      type: "slug",
      options: { source: "name.sr", maxLength: 70 },
      validation: (r) => r.required(),
      components: { input: AutoSlugInput },
    }),
    defineField({
      name: "category",
      title: "Категорија",
      type: "string",
      options: {
        list: [
          { title: "Славски поклони", value: "slava" },
          { title: "Уметност (илустрације)", value: "art" },
          { title: "Уоквирено", value: "frame" },
          { title: "Религијско", value: "religious" },
          { title: "Остало", value: "other" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "description", title: "Опис", type: "localeText" }),
    defineField({
      name: "priceFrom",
      title: "Оквирна цена од (дин)",
      type: "number",
      description: "Приказује се као „од X дин“. Оставите празно ако не желите цену.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "dimensions",
      title: "Понуђене димензије",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Нпр. „30×40 cm“, „50×70 cm“. Само информативно.",
    }),
    defineField({
      name: "frames",
      title: "Понуђени рамови",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "frame",
          fields: [
            { name: "name", title: "Назив рама", type: "localeString", validation: (r) => r.required() },
            { name: "swatch", title: "Слика рама (опционо)", type: "image", options: { hotspot: true } },
          ],
          preview: { select: { title: "name.sr", media: "swatch" } },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Додатне фотографије (детаљи/углови)",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({ name: "order", title: "Редослед (мањи број = раније)", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Редослед", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.sr", subtitle: "category", media: "image" } },
});
