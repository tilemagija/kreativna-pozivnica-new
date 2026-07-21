import { defineType, defineField } from "sanity";

// Global pricing rules + per-piece add-ons + seal prices for the configurator (§17).
// One document. The final charge is ALWAYS recomputed server-side from these (§7).
export const pricing = defineType({
  name: "pricing",
  title: "Ценовник (правила и додаци)",
  type: "document",
  fieldsets: [
    { name: "rules", title: "Правила количине", options: { collapsible: true } },
    { name: "wrapper", title: "Омот", options: { collapsible: true } },
    { name: "addons", title: "Додаци на позивницу (по комаду)", options: { collapsible: true } },
    { name: "seal", title: "Печат, тракице, нитне (по комаду)", options: { collapsible: true } },
    { name: "digital", title: "Дигитална позивница", options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: "digitalPrice",
      title: "Цена дигиталне позивнице (фиксно)",
      type: "number",
      initialValue: 3000,
      description:
        "Јединствена цена за дигиталну позивницу (PDF на мејл), иста за једнострану и двострану. Плаћа се 100%.",
      fieldset: "digital",
    }),
    defineField({ name: "minQuantity", title: "Минимална количина", type: "number", initialValue: 50, fieldset: "rules" }),
    defineField({
      name: "setupFee",
      title: "Припрема за штампу (доплата испод мин. количине)",
      type: "number",
      initialValue: 4000,
      fieldset: "rules",
    }),
    defineField({
      name: "quantityDiscountNote",
      title: "Количински попуст (белешка — за касније)",
      type: "text",
      rows: 2,
      description: "За сад ручно. Овде уписати договор ако затреба.",
      fieldset: "rules",
    }),

    defineField({
      name: "pausOmotPrice",
      title: "Паус омот (по комаду)",
      type: "number",
      initialValue: 40,
      description: "Цена ако купац изабере паус омот (уместо коверте).",
      fieldset: "wrapper",
    }),

    defineField({ name: "addonDoubleSided", title: "Двострана штампа", type: "number", initialValue: 20, fieldset: "addons" }),
    defineField({ name: "addonTornEdges", title: "Ручно цепкане ивице", type: "number", initialValue: 20, fieldset: "addons" }),
    defineField({ name: "addonRoundedEdges", title: "Заобљене ивице", type: "number", initialValue: 10, fieldset: "addons" }),
    defineField({
      name: "addonGoldEdges",
      title: "Златне ивице (златни листићи на ивицама)",
      type: "number",
      initialValue: 30,
      description: "Цена по комаду. Промени на тачну вредност.",
      fieldset: "addons",
    }),

    defineField({ name: "sealBase", title: "Печат", type: "number", initialValue: 40, fieldset: "seal" }),
    defineField({ name: "sealGoldLeaf", title: "Печат + златни листићи", type: "number", initialValue: 50, fieldset: "seal" }),
    defineField({ name: "sealTatarika", title: "Печат + гранчица татарике", type: "number", initialValue: 70, fieldset: "seal" }),
    defineField({ name: "satinRibbon", title: "Сатенска тракица", type: "number", initialValue: 40, fieldset: "seal" }),
    defineField({ name: "pausMuslinRibbon", title: "Паус + муслин тракица", type: "number", initialValue: 80, fieldset: "seal" }),
    defineField({ name: "nitne", title: "Нитне", type: "number", initialValue: 10, fieldset: "seal" }),
    defineField({
      name: "sealColors",
      title: "Боје воска (печат)",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["тамно златна", "шампањац", "розе златна", "бела", "бордо", "црна"],
      fieldset: "seal",
    }),
  ],
  preview: { prepare: () => ({ title: "Ценовник (правила и додаци)" }) },
});
