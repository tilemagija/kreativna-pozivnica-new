"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const pathname = usePathname();

  return (
    <nav aria-label="Jezik" className="flex gap-3 text-sm">
      {routing.locales.map((loc) => (
        <Link key={loc} href={pathname} locale={loc} className="underline">
          {loc === "sr" ? "СР" : "EN"}
        </Link>
      ))}
    </nav>
  );
}
