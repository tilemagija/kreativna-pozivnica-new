import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on all paths except API, Next internals, /studio, and /template-tool (internal tool)
  // — that one is single-language and must not be locale-prefixed. Files with a dot are
  // skipped too. NB: any future page outside `[locale]` must be added here, or next-intl
  // tries to prefix it with a language and it 404s.
  matcher: ["/((?!api|_next|_vercel|studio|template-tool|.*\\..*).*)"],
};
