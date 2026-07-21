import { getTranslations } from "next-intl/server";
import { getContact } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "./SectionHeading";
import Reveal from "@/components/motion/Reveal";
import SmartInquiry from "@/components/SmartInquiry";
import ContactChannels from "@/components/site/ContactChannels";

// Contact section. Real inquiry form arrives in Phase 1.3 — for now real direct
// contact links (Instagram, email) so nothing is fake (CLAUDE.md §6).
export default async function Contact({ locale }: { locale: string }) {
  const data = await getContact();
  const t = await getTranslations("Contact");

  const kicker = pick(data?.contactKicker, locale) || t("kicker");
  const heading = pick(data?.contactHeading, locale) || t("heading");
  const text = pick(data?.contactText, locale) || t("text");

  const handle = (data?.instagramHandle || "kreativna_pozivnica").replace(/^@/, "");
  const instagramUrl = data?.instagramUrl || `https://instagram.com/${handle}`;
  const email = data?.email;

  return (
    <section id="kontakt" className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
      <SectionHeading kicker={kicker} heading={heading} />
      <Reveal delay={0.1}>
        <p className="mx-auto mt-4 max-w-xl font-body leading-relaxed text-ink-muted">
          {text}
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-10">
          <SmartInquiry context="Контакт (почетна)" instagramUrl={instagramUrl} />
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-8">
          <p className="mb-4 font-body text-sm text-ink-muted">{t("orDirect")}</p>
          <ContactChannels
            instagramUrl={instagramUrl}
            whatsappNumber={data?.whatsappNumber}
            viberNumber={data?.viberNumber}
            email={email}
          />
        </div>
      </Reveal>
    </section>
  );
}
