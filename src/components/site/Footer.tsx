import { getTranslations } from "next-intl/server";
import { getContact } from "@/sanity/queries";
import ContactChannels from "./ContactChannels";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const data = await getContact();
  const year = new Date().getFullYear();

  const handle = (data?.instagramHandle || "kreativna_pozivnica").replace(/^@/, "");
  const instagramUrl = data?.instagramUrl || `https://instagram.com/${handle}`;

  return (
    <footer className="border-t border-line bg-greige">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center">
        <p className="font-serif text-lg font-medium uppercase tracking-[0.15em] text-gold">
          Креативна позивница
        </p>
        <p className="font-script text-2xl text-sage">{t("tagline")}</p>

        <ContactChannels
          className="mt-2"
          instagramUrl={instagramUrl}
          whatsappNumber={data?.whatsappNumber}
          viberNumber={data?.viberNumber}
          email={data?.email}
        />

        <p className="mt-3 text-xs text-ink-muted">
          © {year} · {t("rights")}
        </p>
      </div>
    </footer>
  );
}
