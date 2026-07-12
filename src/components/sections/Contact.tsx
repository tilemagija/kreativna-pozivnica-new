import { getTranslations } from "next-intl/server";
import { getContact } from "@/sanity/queries";
import { pick } from "@/sanity/locale";
import SectionHeading from "./SectionHeading";
import Reveal from "@/components/motion/Reveal";

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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream transition-colors hover:bg-gold-deep"
          >
            {t("instagramCta")}
          </a>
          {email && (
            <a
              href={`mailto:${email}`}
              className="rounded-sm border border-gold px-6 py-3 font-sans text-sm uppercase tracking-wider text-gold-deep transition-colors hover:bg-gold hover:text-cream"
            >
              {email}
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}
