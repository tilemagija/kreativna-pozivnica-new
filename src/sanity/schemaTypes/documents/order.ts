import { defineType, defineField } from "sanity";

// A captured physical-invitation order (konfigurator §3.3). Written server-side by
// /api/order after the price is RECOMPUTED on the server (§7) — never trusted from the
// browser. Snapshot fields are read-only evidence; the owner drives it via `status`.
// Real deposit charging arrives in Phase 5; until then orders sit at "pending_payment".
export const order = defineType({
  name: "order",
  title: "Наруџбина",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Статус",
      type: "string",
      options: {
        list: [
          { title: "Чека уплату депозита", value: "pending_payment" },
          { title: "Депозит плаћен", value: "deposit_paid" },
          { title: "Обрађено", value: "handled" },
        ],
        layout: "radio",
      },
      initialValue: "pending_payment",
    }),
    defineField({
      name: "orderNumber",
      title: "Број наруџбине (позив на број)",
      type: "string",
      readOnly: true,
      description: "Купац га уписује при уплати депозита — тако спајаш уплату с наруџбином.",
    }),
    defineField({ name: "templateName", title: "Шаблон", type: "string", readOnly: true }),
    defineField({
      name: "templateRef",
      title: "Референца шаблона",
      type: "reference",
      to: [{ type: "invitationTemplate" }],
      readOnly: true,
    }),
    defineField({
      name: "textValues",
      title: "Купчев текст",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Поље", type: "string" },
            { name: "value", title: "Текст", type: "text" },
          ],
          preview: {
            select: { title: "key", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "paper",
      title: "Папир",
      type: "object",
      readOnly: true,
      fields: [
        { name: "name", title: "Назив", type: "string" },
        { name: "pricePerPiece", title: "Цена/ком", type: "number" },
      ],
    }),
    defineField({
      name: "wrapper",
      title: "Омот",
      type: "string",
      readOnly: true,
      description: "koverat / paus / bez",
    }),
    defineField({
      name: "envelope",
      title: "Коверта (ако омот = коверат)",
      type: "object",
      readOnly: true,
      fields: [
        { name: "name", title: "Назив", type: "string" },
        { name: "pricePerPiece", title: "Цена/ком", type: "number" },
      ],
    }),
    defineField({
      name: "seal",
      title: "Печат",
      type: "object",
      readOnly: true,
      fields: [
        { name: "motif", title: "Мотив", type: "string" },
        { name: "color", title: "Боја воска", type: "string" },
      ],
    }),
    defineField({
      name: "sealAddon",
      title: "Додатак печата",
      type: "string",
      readOnly: true,
      description: "none / goldLeaf / tatarika",
    }),
    defineField({
      name: "addons",
      title: "Додаци",
      type: "object",
      readOnly: true,
      fields: [
        { name: "tornEdges", title: "Ручно цепкане ивице", type: "boolean" },
        { name: "goldEdges", title: "Златне ивице", type: "boolean" },
        { name: "roundedCorners", title: "Заобљене ивице", type: "boolean" },
      ],
    }),
    defineField({ name: "doubleSided", title: "Двострана штампа", type: "boolean", readOnly: true }),
    defineField({ name: "quantity", title: "Количина", type: "number", readOnly: true }),
    defineField({ name: "computedTotal", title: "Укупно (серверски)", type: "number", readOnly: true }),
    defineField({ name: "deposit", title: "Депозит 50%", type: "number", readOnly: true }),
    defineField({
      name: "customer",
      title: "Купац",
      type: "object",
      readOnly: true,
      fields: [
        { name: "name", title: "Име", type: "string" },
        { name: "phone", title: "Телефон", type: "string" },
        { name: "email", title: "Мејл", type: "string" },
        { name: "address", title: "Адреса (поузеће)", type: "text" },
        { name: "eventDate", title: "Датум догађаја", type: "string" },
      ],
    }),
    defineField({ name: "createdAt", title: "Стигло", type: "datetime", readOnly: true }),
    defineField({
      name: "note",
      title: "Белешка (интерно)",
      type: "text",
      description: "За твоје напомене — нпр. договорен попуст.",
    }),
  ],
  orderings: [
    { title: "Најновије", name: "newest", by: [{ field: "createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { name: "customer.name", template: "templateName", total: "computedTotal", status: "status" },
    prepare: ({ name, template, total, status }) => {
      const mark = status === "handled" ? "✓ " : status === "deposit_paid" ? "◐ " : "• ";
      return { title: `${mark}${name || "Наруџбина"}`, subtitle: `${template || ""} · ${total || 0} дин` };
    },
  },
});
