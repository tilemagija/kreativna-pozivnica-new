import { useEffect, useRef } from "react";
import { set, unset, useFormValue, type SlugInputProps } from "sanity";
import { slugifyCyrillic } from "../lib/cyrillicSlug";

// Auto-generates the slug from `name.sr` as the owner types — no "Generate" button, and
// nothing that can block Publish. Renders read-only: this field is not something the owner
// edits, so give it nothing to click. Only recomputes while the slug looks auto-generated
// (matches the previous name); if a slug was ever hand-edited (shouldn't happen via this UI,
// but covers migrated/legacy docs) it's left alone rather than silently overwritten.
export function AutoSlugInput(props: SlugInputProps) {
  const sourceValue = useFormValue(["name", "sr"]) as string | undefined;
  const lastAutoSlug = useRef<string | undefined>(props.value?.current);

  useEffect(() => {
    const next = sourceValue ? slugifyCyrillic(sourceValue) : "";
    const current = props.value?.current;
    const isUntouchedOrAuto = !current || current === lastAutoSlug.current;
    if (!isUntouchedOrAuto || next === current) return;

    lastAutoSlug.current = next;
    props.onChange(next ? set({ _type: "slug", current: next }) : unset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceValue]);

  return (
    <div style={{ padding: "8px 0", color: "var(--card-muted-fg-color, #6e6e6e)", fontSize: "0.9em" }}>
      {props.value?.current || "— генерише се аутоматски из имена —"}
    </div>
  );
}
