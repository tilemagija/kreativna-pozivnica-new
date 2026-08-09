"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  sr: "ЋИР",
  "sr-Latn": "LAT",
  en: "EN",
};

export default function LocaleSwitcher() {
  const pathname = usePathname();

  return (
    <nav aria-label="Језик" className="flex gap-3 text-sm">
      {routing.locales.map((loc) => (
        <Link key={loc} href={pathname} locale={loc} className="underline">
          {LABELS[loc] ?? loc}
        </Link>
      ))}
    </nav>
  );
}
