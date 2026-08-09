import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on all paths except API, Next internals, /studio, and the internal tools
  // (/template-tool, /font-proba, /navbar-proba) — those are single-language and must not be
  // locale-prefixed. Files with a dot are skipped too.
  matcher: ["/((?!api|_next|_vercel|studio|template-tool|font-proba|navbar-proba|.*\\..*).*)"],
};
