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
    { name: "usluge", title: "2б · Наше услуге (слике картица)", options: { collapsible: true, collapsed: true } },
    { name: "why", title: "3 · Зашто баш ми", options: { collapsible: true, collapsed: true } },
    { name: "about", title: "4 · О нама", options: { collapsible: true, collapsed: true } },
    { name: "social", title: "5 · Постаните део приче (друштвени доказ)", options: { collapsible: true, collapsed: true } },
    { name: "contact", title: "6 · Контакт (наслов секције)", options: { collapsible: true, collapsed: true } },
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

    // 2б · НАШЕ УСЛУГЕ — cover image per card (text stays in the app; only the photo is editable here)
    defineField({
      name: "uslugePozivniceImage",
      title: "Слика за картицу: Позивнице",
      type: "image",
      fieldset: "usluge",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Опис слике (за приступачност/SEO)", type: "localeString" }],
    }),
    defineField({
      name: "uslugeSlikeImage",
      title: "Слика за картицу: Слике",
      type: "image",
      fieldset: "usluge",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Опис слике (за приступачност/SEO)", type: "localeString" }],
    }),
    defineField({
      name: "uslugeDetaljiImage",
      title: "Слика за картицу: Посебни детаљи",
      type: "image",
      fieldset: "usluge",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Опис слике (за приступачност/SEO)", type: "localeString" }],
    }),

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

    // 4 · ABOUT ("О нама")
    defineField({ name: "aboutKicker", title: "Надтекст", type: "localeString", fieldset: "about" }),
    defineField({ name: "aboutHeading", title: "Наслов", type: "localeString", fieldset: "about" }),
    defineField({ name: "aboutText", title: "Текст (прича о вама)", type: "localeText", fieldset: "about" }),
    defineField({
      name: "aboutImage",
      title: "Слика",
      type: "image",
      fieldset: "about",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Опис слике", type: "localeString" }],
    }),

    // 5 · SOCIAL PROOF ("Постаните део приче")
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
    defineField({ name: "counterLabel", title: "Бројач — текст испод (нпр. задовољних породица)", type: "localeString", fieldset: "social" }),
    defineField({ name: "counterTagline", title: "Бројач — слоган испод (нпр. Свако упаковано са пажњом и срцем)", type: "localeString", fieldset: "social" }),
    defineField({
      name: "packageImages",
      title: "Слике пакета (падају док расте бројач)",
      type: "array",
      fieldset: "social",
      description: "Праве фотографије упакованих поруџбина. Препоручено 5–8.",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({
      name: "instagramImages",
      title: "Слике за Instagram мрежу (у телефону)",
      type: "array",
      fieldset: "social",
      description: "6 слика за мрежу у телефону.",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({ name: "testimonialsKicker", title: "Надтекст за утиске (нпр. ВАШЕ РЕЧИ)", type: "localeString", fieldset: "social" }),
    defineField({ name: "testimonialsHeading", title: "Наслов за утиске (нпр. Утисци)", type: "localeString", fieldset: "social" }),

    // 5 · CONTACT heading
    defineField({ name: "contactKicker", title: "Надтекст", type: "localeString", fieldset: "contact" }),
    defineField({ name: "contactHeading", title: "Наслов", type: "localeString", fieldset: "contact" }),
    defineField({ name: "contactText", title: "Кратак текст изнад форме", type: "localeText", fieldset: "contact" }),
  ],
  preview: { prepare: () => ({ title: "Почетна страна" }) },
});
