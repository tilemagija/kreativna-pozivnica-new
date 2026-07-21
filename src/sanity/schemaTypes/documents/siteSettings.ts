import { defineType, defineField } from "sanity";

// Global settings — one document. Contact email + Instagram used from Phase 1.3 on.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Подешавања сајта",
  type: "document",
  fields: [
    defineField({
      name: "instagramHandle",
      title: "Instagram корисничко име",
      type: "string",
      description: "Нпр. kreativna_pozivnica (без @).",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram линк",
      type: "url",
      description: "Пуна адреса профила, нпр. https://instagram.com/kreativna_pozivnica",
    }),
    defineField({
      name: "contactEmail",
      title: "Мејл за упите",
      type: "string",
      description: "Овде ће стизати упити послати са сајта (користи се од касније фазе).",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp број",
      type: "string",
      description:
        "Број у међународном формату, без + и без размака. Нпр. 3816XXXXXXXX (381 = Србија, па број без прве нуле). Оставите празно ако не желите WhatsApp дугме.",
    }),
    defineField({
      name: "viberNumber",
      title: "Viber број",
      type: "string",
      description:
        "Исти међународни формат, без + и без размака. Нпр. 3816XXXXXXXX. Оставите празно ако не желите Viber дугме.",
    }),
    defineField({
      name: "footerNote",
      title: "Текст у футеру",
      type: "localeText",
    }),

    // Bank transfer (Faza 5) — shown to the customer at checkout + used for the IPS QR.
    defineField({ name: "bankRecipient", title: "Прималац (назив)", type: "string", fieldset: "bank" }),
    defineField({
      name: "bankAccount",
      title: "Број рачуна",
      type: "string",
      description: "Нпр. 160-0000000000000-00 (18 цифара; цртице су ок).",
      fieldset: "bank",
    }),
    defineField({ name: "bankName", title: "Банка", type: "string", fieldset: "bank" }),
    defineField({
      name: "bankModel",
      title: "Модел позива на број",
      type: "string",
      initialValue: "00",
      description: "Обично 00 (без контролне цифре).",
      fieldset: "bank",
    }),
    defineField({
      name: "bankPaymentCode",
      title: "Шифра плаћања",
      type: "string",
      initialValue: "289",
      description: "3 цифре. 289 = уплата по фактури/услуга.",
      fieldset: "bank",
    }),
    defineField({
      name: "bankPurpose",
      title: "Сврха уплате",
      type: "string",
      initialValue: "Депозит за позивнице",
      fieldset: "bank",
    }),
  ],
  fieldsets: [{ name: "bank", title: "Уплата на рачун (депозит)", options: { collapsible: true } }],
  preview: { prepare: () => ({ title: "Подешавања сајта" }) },
});
