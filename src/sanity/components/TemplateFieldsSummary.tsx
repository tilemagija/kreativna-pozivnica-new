import type { ArrayOfObjectsInputProps } from "sanity";

// Text-field layout is authored VISUALLY in /template-tool (drag on the design), never by
// typing x/y/size percentages into Studio — that form was unusable. The data still lives on
// the document (the configurator and the PDF read it), so the field stays; only its editor
// is replaced by this read-only summary plus a link to the real tool.
export function TemplateFieldsSummary(props: ArrayOfObjectsInputProps) {
  const count = Array.isArray(props.value) ? props.value.length : 0;
  const labels = (props.value ?? [])
    .map((f) => {
      const item = f as { label?: { sr?: string }; key?: string };
      return item.label?.sr || item.key;
    })
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      style={{
        border: "1px solid var(--card-border-color, #e3e4e8)",
        borderRadius: 4,
        padding: "12px 14px",
        fontSize: "0.9em",
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontWeight: 600 }}>
        {count > 0 ? `Постављено ${count} текст-поља` : "Још нема текст-поља"}
      </div>
      {labels && (
        <div style={{ color: "var(--card-muted-fg-color, #6e6e6e)", marginTop: 2 }}>{labels}</div>
      )}
      <div style={{ marginTop: 8 }}>
        <a
          href="/template-tool"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--card-link-fg-color, #2276fc)" }}
        >
          Отвори алат за распоред текста →
        </a>
      </div>
      <div style={{ color: "var(--card-muted-fg-color, #6e6e6e)", marginTop: 6 }}>
        Текст се поставља превлачењем по слици, не уносом бројева овде.
      </div>
    </div>
  );
}
