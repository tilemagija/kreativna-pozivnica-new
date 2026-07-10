import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on all paths except API, Next internals, /studio (Sanity later), and files with a dot.
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
