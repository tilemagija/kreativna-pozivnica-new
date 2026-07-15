import { defineType, defineField } from "sanity";
import { TEMPLATE_FONT_OPTIONS } from "@/lib/templateFonts";

// One editable text field on an invitation template (konfigurator §3.1). Reused for the
// FRONT (textFields) and the BACK (backTextFields) of double-sided designs. Every position
// / size is a % of the preview width, so the live overlay stays 1:1 on any screen. The
// owner sets these visually via the /template-tool editor (or by hand here).
export const templateTextField = defineType({
  name: "templateTextField",
  title: "Текст-поље",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Кључ (интерни ид)",
      type: "string",
      description: "Кратко, латиница, без размака: нпр. imena, datum, mesto.",
      validation: (r) => r.required().regex(/^[a-z0-9_]+$/, { name: "мала латиница/бројеви/доња црта" }),
    }),
    defineField({ name: "label", title: "Назив (шта купац види)", type: "localeString" }),
    defineField({ name: "defaultText", title: "Подразумевани текст (пример у прегледу)", type: "string" }),
    defineField({
      name: "fontKey",
      title: "Фонт (из палете)",
      type: "string",
      options: { list: TEMPLATE_FONT_OPTIONS },
      initialValue: TEMPLATE_FONT_OPTIONS[0]?.value,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fontSizePct",
      title: "Величина фонта (% ширине)",
      type: "number",
      validation: (r) => r.required().min(0.5).max(40),
    }),
    defineField({ name: "color", title: "Боја (hex)", type: "string", initialValue: "#3D352A" }),
    defineField({
      name: "align",
      title: "Поравнање",
      type: "string",
      options: { list: [
        { title: "Лево", value: "left" },
        { title: "Центар", value: "center" },
        { title: "Десно", value: "right" },
      ] },
      initialValue: "center",
    }),
    defineField({ name: "xPct", title: "X — лева ивица (% ширине)", type: "number", validation: (r) => r.required().min(0).max(100) }),
    defineField({ name: "yPct", title: "Y — горња ивица (% висине)", type: "number", validation: (r) => r.required().min(0).max(100) }),
    defineField({ name: "widthPct", title: "Ширина боксa (% ширине)", type: "number", initialValue: 60, validation: (r) => r.required().min(1).max(100) }),
    defineField({ name: "lineHeight", title: "Проред", type: "number", initialValue: 1.2 }),
    defineField({ name: "multiline", title: "Више редова", type: "boolean", initialValue: false }),
    defineField({ name: "maxLength", title: "Макс. броја знакова", type: "number", initialValue: 60, validation: (r) => r.min(1).max(500) }),
  ],
  preview: {
    select: { title: "label.sr", subtitle: "defaultText" },
    prepare: ({ title, subtitle }) => ({ title: title || "Текст-поље", subtitle }),
  },
});
