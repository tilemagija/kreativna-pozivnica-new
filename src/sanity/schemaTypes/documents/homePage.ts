import { defineType, defineField, defineArrayMember } from "sanity";

// The whole landing page copy — one document, split into clearly-named sections
// so a non-technical editor fills each part in one place. Gallery items and
// testimonials live as their own lists (galleryItem / testimonial).
export const homePage = defineType({
  name: "homePage",
  title: "Почетна страна",
  type: "document",
  fieldsets: [
    { name: "hero", title: "1 · Hero (врх стране)", options: { collapsible: true } },
    { name: "gallery", title: "2 · Галерија (наслов секције)", options: { collapsible: true, collapsed: true } },
    { name: "why", title: "3 · Зашто баш ми", options: { collapsible: true, collapsed: true } },
    { name: "social", title: "4 · Постаните део приче (друштвени доказ)", options: { collapsible: true, collapsed: true } },
    { name: "contact", title: "5 · Контакт (наслов секције)", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // 1 · HERO
    defineField({ name: "heroKicker", title: "Надтекст (ситно, изнад наслова)", type: "localeString", fieldset: "hero" }),
    defineField({ name: "heroHeading", title: "Главни наслов", type: "localeString", fieldset: "hero" }),
    defineField({ name: "heroSubheading", title: "Поднаслов", type: "localeText", fieldset: "hero" }),
    defineField({ name: "heroPrimaryCta", title: "Дугме 1 (текст)", type: "localeString", fieldset: "hero" }),
    defineField({ name: "heroSecondaryCta", title: "Дугме 2 (текст)", type: "localeString", fieldset: "hero" }),
    defineField({
      name: "heroImages",
      title: "Слике за carousel (смењују се)",
      type: "array",
      fieldset: "hero",
      description: "Додај више слика — смењиваће се. Ред одређује редослед приказа.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Опис слике (за приступачност/SEO)", type: "localeString" }],
        }),
      ],
    }),
    defineField({
      name: "heroCarouselSeconds",
      title: "Брзина смене (секунде)",
      type: "number",
      fieldset: "hero",
      initialValue: 5,
      validation: (r) => r.min(2).max(30),
    }),

    // 2 · GALLERY heading
    defineField({ name: "galleryKicker", title: "Надтекст", type: "localeString", fieldset: "gallery" }),
    defineField({ name: "galleryHeading", title: "Наслов", type: "localeString", fieldset: "gallery" }),
    defineField({ name: "gallerySubheading", title: "Кратак опис", type: "localeText", fieldset: "gallery" }),

    // 3 · WHY US
    defineField({ name: "whyKicker", title: "Надтекст", type: "localeString", fieldset: "why" }),
    defineField({ name: "whyHeading", title: "Наслов", type: "localeString", fieldset: "why" }),
    defineField({
      name: "whyReasons",
      title: "Разлози (3–4)",
      type: "array",
      fieldset: "why",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", title: "Икона (назив, нпр. brush, fingerprint, diamond)", type: "string" },
            { name: "title", title: "Наслов разлога", type: "localeString" },
            { name: "text", title: "Опис", type: "localeText" },
          ],
          preview: { select: { title: "title.sr" } },
        }),
      ],
    }),

    // 4 · SOCIAL PROOF ("Постаните део приче")
    defineField({ name: "socialKicker", title: "Надтекст", type: "localeString", fieldset: "social" }),
    defineField({ name: "socialHeading", title: "Наслов (нпр. Постаните део приче)", type: "localeString", fieldset: "social" }),
    defineField({
      name: "counterTarget",
      title: "Бројач — циљни број (нпр. 2000)",
      type: "number",
      fieldset: "social",
      initialValue: 2000,
      validation: (r) => r.min(0),
    }),
    defineField({ name: "counterSuffix", title: "Бројач — наставак (нпр. +)", type: "string", fieldset: "social", initialValue: "+" }),
    defineField({ name: "counterLabel", title: "Бројач — текст испод (нпр. породица у нашој причи)", type: "localeString", fieldset: "social" }),
    defineField({
      name: "instagramImages",
      title: "Слике за Instagram мрежу (у телефону)",
      type: "array",
      fieldset: "social",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({ name: "testimonialsHeading", title: "Наслов за утиске (нпр. Утисци)", type: "localeString", fieldset: "social" }),

    // 5 · CONTACT heading
    defineField({ name: "contactKicker", title: "Надтекст", type: "localeString", fieldset: "contact" }),
    defineField({ name: "contactHeading", title: "Наслов", type: "localeString", fieldset: "contact" }),
    defineField({ name: "contactText", title: "Кратак текст изнад форме", type: "localeText", fieldset: "contact" }),
  ],
  preview: { prepare: () => ({ title: "Почетна страна" }) },
});
