"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { GalleryTemplate, GalleryCategory, GalleryType } from "@/sanity/queries";
import { pick, pickPlain } from "@/sanity/locale";

// Design catalog (owner's sketch): tabs Штампане / Дигиталне on top, filters on the left,
// a grid of designs on the right (~4/row). EVERY design can be ordered both printed and
// digital, so the tab is just the customer's CHOICE — both tabs show all designs, and the
// tab (mode) is carried into the design's page. Sidebar filters (both CMS-managed): ТИП
// (shape/dimension) + КАТЕГОРИЈА (occasion). Single/double-sided is a per-template pricing
// option, not a filter.
type Tab = "stampana" | "digitalna";

export default function Gallery({
  templates,
  categories,
  types,
  locale,
}: {
  templates: GalleryTemplate[];
  categories: GalleryCategory[];
  types: GalleryType[];
  locale: string;
}) {
  const t = useTranslations("Catalog");
  const [tab, setTab] = useState<Tab>("stampana");
  const [type, setType] = useState<string | "all">("all");
  const [cat, setCat] = useState<string | "all">("all");

  // Only show filter values that actually have designs (keeps the sidebar honest).
  const presentCategories = useMemo(() => {
    const present = new Set<string>();
    for (const x of templates) for (const s of x.categorySlugs ?? []) present.add(s);
    return categories.filter((c) => c.slug && present.has(c.slug));
  }, [templates, categories]);

  const presentTypes = useMemo(() => {
    const present = new Set<string>();
    for (const x of templates) for (const s of x.typeSlugs ?? []) present.add(s);
    return types.filter((ty) => ty.slug && present.has(ty.slug));
  }, [templates, types]);

  // Two independent filters: TIP (shape/dimension) + category — both from CMS.
  const shown = useMemo(
    () =>
      templates.filter((x) => {
        const typeOk = type === "all" || (x.typeSlugs ?? []).includes(type);
        const catOk = cat === "all" || (x.categorySlugs ?? []).includes(cat);
        return typeOk && catOk;
      }),
    [templates, type, cat],
  );

  const tabBtn = (value: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(value)}
      aria-pressed={tab === value}
      className={`rounded-sm px-6 py-2 font-sans text-sm uppercase tracking-wider transition-colors ${
        tab === value ? "bg-gold text-cream" : "border border-line text-ink hover:border-gold"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-3">
        {tabBtn("stampana", t("stampane"))}
        {tabBtn("digitalna", t("digitalne"))}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[260px_1fr] md:gap-12">
        {/* Filters: ТИП (shape/dimension) then КАТЕГОРИЈА — framed "window" panel, kept
            calm/light so the designs stay the focus. Sticky on desktop while the grid scrolls. */}
        <aside className="flex flex-col gap-6 self-start rounded-lg border border-line bg-cream/80 p-5 shadow-sm md:sticky md:top-28">
          {presentTypes.length > 0 && (
            <div>
              <h2 className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
                {t("tip")}
              </h2>
              <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
                <li><CatButton active={type === "all"} onClick={() => setType("all")}>{t("all")}</CatButton></li>
                {presentTypes.map((ty) => (
                  <li key={ty.slug}>
                    <CatButton active={type === ty.slug} onClick={() => setType(ty.slug!)}>
                      {pick(ty.name, locale)}
                    </CatButton>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
              {t("categories")}
            </h2>
            <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
              <li>
                <CatButton active={cat === "all"} onClick={() => setCat("all")}>{t("all")}</CatButton>
              </li>
              {presentCategories.map((c) => (
                <li key={c.slug}>
                  <CatButton active={cat === c.slug} onClick={() => setCat(c.slug!)}>
                    {pick(c.name, locale)}
                  </CatButton>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        {shown.length ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {shown.map((d) => (
              <Link
                key={d._id}
                href={`/napravite-svoju/${d._id}?tip=${tab}`}
                className="group flex flex-col overflow-hidden rounded-sm border border-line bg-cream transition-colors hover:border-gold"
              >
                <span className="relative block aspect-[0.71] w-full bg-greige">
                  {d.imageUrl && (
                    <Image
                      src={d.imageUrl}
                      alt={pickPlain(d.name, locale)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                      className="object-cover"
                    />
                  )}
                  {d.doubleSided && (
                    <span className="absolute right-2 top-2 rounded-sm bg-ink/70 px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-cream">
                      {t("doubleSided")}
                    </span>
                  )}
                </span>
                <span className="p-3 font-serif text-lg text-ink group-hover:text-gold-deep">
                  {pickPlain(d.name, locale)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="font-body text-ink-muted">{t("empty")}</p>
        )}
      </div>
    </div>
  );
}

function CatButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-sm px-3 py-1.5 text-left font-body text-sm transition-colors ${
        active ? "bg-greige text-ink" : "text-ink-muted hover:text-gold-deep"
      }`}
    >
      {children}
    </button>
  );
}
