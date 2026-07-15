import TemplateFieldEditor from "@/components/admin/TemplateFieldEditor";
import { getTemplatesForToolServer } from "@/sanity/serverQueries";

export const dynamic = "force-dynamic";

// Internal tool: visually place a template's text fields (drag on the design), then save
// back to Sanity. Guarded write endpoint (/api/template-fields). In production it needs
// the TEMPLATE_TOOL_KEY secret entered in the browser; in local dev it works freely.
export default async function TemplateToolPage() {
  const templates = await getTemplatesForToolServer();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-2 font-serif text-3xl text-ink">Распоред поља на позивници</h1>
      <p className="mb-8 max-w-2xl font-body text-ink-muted">
        Изаберите шаблон, превуците поља на место и подесите фонт/величину/боју, па сачувајте.
        Ово је исти распоред који купац види у конфигуратору.
      </p>
      {templates.length ? (
        <TemplateFieldEditor templates={templates} />
      ) : (
        <p className="font-body text-ink-muted">Нема шаблона. Прво их додајте у Studiju (слика шаблона).</p>
      )}
    </div>
  );
}
