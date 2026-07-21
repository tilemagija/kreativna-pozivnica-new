import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Catch-all for any unknown path under a valid locale (e.g. /en/nepostojece).
// It sets the request locale (so the branded not-found renders with the right
// language) and then triggers the not-found boundary at [locale]/not-found.tsx.
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
