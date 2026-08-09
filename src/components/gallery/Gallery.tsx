"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { GalleryTemplate, GalleryCategory, GalleryType } from "@/sanity/queries";
import { pick, pickPlain } from "@/sanity/locale";
import CrossDivider from "@/components/brand/CrossDivider";

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

  // Etno tone: the chosen mode is a solid deep-green plaque, the other a quiet cream label on
  // the linen. Both carry a border so switching doesn't shift them by a pixel.
  const tabBtn = (value: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(value)}
      aria-pressed={tab === value}
      className={`rounded-sm border px-6 py-2.5 font-sans text-[13px] uppercase tracking-[0.16em] transition-colors ${
        tab === value
          ? "border-forest bg-forest text-cream shadow-[0_5px_16px_rgba(32,64,34,0.25)]"
          : "border-line bg-cream/70 text-ink hover:border-gold hover:text-gold-deep"
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
        <aside className="flex flex-col gap-5 self-start rounded-sm border border-line bg-cream/85 p-5 shadow-[0_8px_22px_rgba(59,50,39,0.14)] md:sticky md:top-28">
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

          {/* gold cross ornament separates the two filter groups (same signature as the
              section headings) — only when both groups are actually on screen */}
          {presentTypes.length > 0 && (
            <div aria-hidden className="flex items-center gap-3 text-gold">
              <span className="h-px flex-1 bg-line" />
              <CrossDivider className="h-3.5 w-3.5" />
              <span className="h-px flex-1 bg-line" />
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

        {/* Grid — deliberately a GRID, not the mosaic used on the showcase galleries: these are
            products the customer compares side by side, so equal sizes help. The etno language
            comes from the framing instead — each design is matted like a photograph on the linen
            (cream passe-partout + soft shadow) and lifts on hover.
            Column count is tuned so a design is never too small to judge — two things eat width
            here that a plain gallery doesn't have: the 260px sidebar (from `md`) and EtnoFrame's
            vez columns (224px+, from `lg`). So the grid drops back to 2 at `md` and only climbs
            again once there is real room (3 at `xl`, 4 at `2xl`); measured ~190-290px per card
            across breakpoints instead of the ~120px a naive lg:grid-cols-4 gave. */}
        {shown.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-2 lg:gap-8 xl:grid-cols-3 2xl:grid-cols-4">
            {shown.map((d) => (
              <Link key={d._id} href={`/napravite-svoju/${d._id}?tip=${tab}`} className="group block">
                <figure className="rounded-sm border border-line bg-cream p-1.5 shadow-[0_8px_22px_rgba(59,50,39,0.18)] transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="relative block aspect-[0.71] w-full overflow-hidden rounded-[2px] bg-greige">
                    {d.imageUrl && (
                      <Image
                        src={d.imageUrl}
                        alt={pickPlain(d.name, locale)}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                        className="object-cover"
                      />
                    )}
                    {d.doubleSided && (
                      <span className="absolute right-2 top-2 rounded-sm bg-ink/70 px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-cream">
                        {t("doubleSided")}
                      </span>
                    )}
                  </span>
                  <figcaption className="px-1 pb-0.5 pt-2.5 text-center font-serif text-lg leading-snug text-ink transition-colors group-hover:text-gold-deep">
                    {pickPlain(d.name, locale)}
                  </figcaption>
                </figure>
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
      // roomier tap target on phones (filters are wrap-around chips there); tighter in the
      // desktop sidebar list, where they're a vertical menu and cursor-precise
      className={`w-full rounded-sm px-3.5 py-2.5 text-left font-body text-sm transition-colors md:px-3 md:py-1.5 ${
        active ? "bg-greige text-ink" : "text-ink-muted hover:text-gold-deep"
      }`}
    >
      {children}
    </button>
  );
}
