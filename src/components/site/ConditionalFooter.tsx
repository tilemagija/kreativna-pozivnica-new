"use client";

import { usePathname } from "@/i18n/navigation";

// The gallery pages (pozivnice, umetnost) end with their own "back to home" link and
// deliberately have NO global footer (owner's call). Every other page keeps it.
// IMPORTANT: this gate takes the already server-rendered <Footer/> as `children` rather
// than importing Footer itself — importing a server component (Footer uses getTranslations)
// into a client module would drag it into the client bundle and break the build. usePathname
// from the i18n navigation returns the locale-stripped path (e.g. "/pozivnice").
const HIDE_FOOTER = ["/pozivnice", "/umetnost"];

export default function ConditionalFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (HIDE_FOOTER.includes(pathname)) return null;
  return <>{children}</>;
}
