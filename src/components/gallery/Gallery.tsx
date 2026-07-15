"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { GalleryTemplate, GalleryCategory } from "@/sanity/queries";
import { pick } from "@/sanity/locale";

// Design catalog (owner's sketch): tabs Штампане / Дигиталне on top, categories on the
// left, a grid of designs on the right (~4/row). EVERY design can be ordered both printed
// and digital, so the tab is just the customer's CHOICE — both tabs show all designs, and
// the tab (mode) is carried into the design's page. No sorting (small catalog).
type Tab = "stampana" | "digitalna";

export default function Gallery({
  templates,
  categories,
  locale,
}: {
  templates: GalleryTemplate[];
  categories: GalleryCategory[];
  locale: string;
}) {
  const t = useTranslations("Catalog");
  const [tab, setTab] = useState<Tab>("stampana");
  const [sided, setSided] = useState<"all" | "single" | "double">("all");
  const [cat, setCat] = useState<string | "all">("all");

  // Categories that actually have designs (keeps the sidebar honest). Same for both tabs.
  const presentCategories = useMemo(() => {
    const present = new Set<string>();
    for (const x of templates) for (const s of x.categorySlugs ?? []) present.add(s);
    return categories.filter((c) => c.slug && present.has(c.slug));
  }, [templates, categories]);

  // Two independent filters: TIP (single/double, from the doubleSided flag) + category.
  const shown = useMemo(
    () =>
      templates.filter((x) => {
        const sidedOk = sided === "all" || (sided === "double" ? !!x.doubleSided : !x.doubleSided);
        const catOk = cat === "all" || (x.categorySlugs ?? []).includes(cat);
        return sidedOk && catOk;
      }),
    [templates, sided, cat],
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
    <div className="mt-10">
      {/* Tabs */}
      <div className="flex justify-center gap-3">
        {tabBtn("stampana", t("stampane"))}
        {tabBtn("digitalna", t("digitalne"))}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[200px_1fr] md:gap-10">
        {/* Filters: TIP (single/double) then categories */}
        <aside className="flex flex-col gap-6">
          <div>
            <h2 className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-sage-deep">
              {t("tip")}
            </h2>
            <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
              <li><CatButton active={sided === "all"} onClick={() => setSided("all")}>{t("all")}</CatButton></li>
              <li><CatButton active={sided === "single"} onClick={() => setSided("single")}>{t("single")}</CatButton></li>
              <li><CatButton active={sided === "double"} onClick={() => setSided("double")}>{t("double")}</CatButton></li>
            </ul>
          </div>

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
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((d) => (
              <Link
                key={d._id}
                href={`/napravite-svoju/${d.slug}?tip=${tab}`}
                className="group flex flex-col overflow-hidden rounded-sm border border-line bg-cream transition-colors hover:border-gold"
              >
                <span className="relative block aspect-[0.71] w-full bg-greige">
                  {d.imageUrl && (
                    <Image
                      src={d.imageUrl}
                      alt={pick(d.name, locale)}
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
                  {pick(d.name, locale)}
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
