import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getContact } from "@/sanity/queries";
import ContactChannels from "./ContactChannels";
import TrakaDivider from "./TrakaDivider";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const data = await getContact();
  const year = new Date().getFullYear();

  const handle = (data?.instagramHandle || "kreativna_pozivnica").replace(/^@/, "");
  const instagramUrl = data?.instagramUrl || `https://instagram.com/${handle}`;

  // Footer content, reused: overlaid on the illustration (desktop) or below it (mobile).
  const info = (
    <>
      <p className="font-serif text-base font-medium uppercase tracking-[0.15em] text-gold">
        Креативна позивница
      </p>
      <p className="font-script text-lg text-sage-deep">{t("tagline")}</p>
      <ContactChannels
        className="mt-1"
        instagramUrl={instagramUrl}
        whatsappNumber={data?.whatsappNumber}
        viberNumber={data?.viberNumber}
        email={data?.email}
      />
      <p className="mt-1.5 text-xs text-ink-muted">
        © {year} · {t("rights")}
      </p>
    </>
  );

  return (
    <footer className="bg-greige">
      <TrakaDivider src="/traka5-tile.png" heightClass="h-11 md:h-14" />

      {/* The whole watercolour is shown edge-to-edge in its own proportions (never
          cropped). On desktop the text overlays the empty left half over a warm veil;
          on mobile the illustration is too short to overlay, so the text sits below it. */}
      <div className="relative">
        <Image
          src="/footer.jpg"
          alt="Млади пар пред сеоском црквом — акварел"
          width={2172}
          height={724}
          sizes="100vw"
          className="block h-auto w-full"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-greige/85 via-greige/25 to-transparent lg:block"
        />
        <div className="absolute inset-0 hidden items-center lg:flex">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-1.5 px-6 text-left">
            {info}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 px-6 py-6 text-center lg:hidden">
        {info}
      </div>
    </footer>
  );
}
