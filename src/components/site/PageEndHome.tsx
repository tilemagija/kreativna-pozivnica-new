import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Lotus from "@/components/brand/Lotus";

// Closing element for the gallery pages (pozivnice, umetnost): these pages drop the global
// footer and instead end with a quiet "back to home" link under a gold lotus flourish, so
// the infinite-scroll gallery has a clear, intentional bottom.
export default async function PageEndHome() {
  const t = await getTranslations("Common");
  return (
    <div className="flex flex-col items-center gap-5 px-6 pb-24 pt-12 text-center">
      <div className="flex items-center gap-3 text-gold">
        <span className="h-px w-12 bg-gold/40" />
        <Lotus className="h-6 w-9" />
        <span className="h-px w-12 bg-gold/40" />
      </div>
      <Link
        href="/"
        className="font-serif text-xl italic text-forest underline-offset-4 transition-colors hover:text-gold hover:underline"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
