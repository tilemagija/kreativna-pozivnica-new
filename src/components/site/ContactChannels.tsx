import { whatsappUrl, viberUrl } from "@/lib/contactChannels";

// Direct-contact pills (Instagram · WhatsApp · Viber · email). Server-rendered, no
// client JS — just real links. Each channel is skipped when its value is missing, so
// the row only ever shows what the owner actually configured in the Studio.
// Styled as on-brand gold-outline pills (deliberately NOT the green/purple brand
// colors) so the row stays part of the site's warm editorial look (§11a).

type Props = {
  instagramUrl?: string;
  whatsappNumber?: string;
  viberNumber?: string;
  email?: string;
  className?: string;
};

const pill =
  "inline-flex items-center gap-2 rounded-full border border-gold px-4 py-2 font-sans text-xs uppercase tracking-wider text-gold-deep transition-colors hover:bg-gold hover:text-cream";

export default function ContactChannels({
  instagramUrl,
  whatsappNumber,
  viberNumber,
  email,
  className,
}: Props) {
  const wa = whatsappUrl(whatsappNumber);
  const vb = viberUrl(viberNumber);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className || ""}`}>
      {instagramUrl && (
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={pill}>
          <IconInstagram />
          Instagram
        </a>
      )}
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={pill}>
          <IconWhatsApp />
          WhatsApp
        </a>
      )}
      {vb && (
        <a href={vb} className={pill}>
          <IconViber />
          Viber
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} className={pill}>
          <IconMail />
          {email}
        </a>
      )}
    </div>
  );
}

const ico = "h-4 w-4";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={ico} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={ico} aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.45 1.32 4.95L2 22l5.2-1.36A9.94 9.94 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.86 14.13c-.25.7-1.44 1.34-1.98 1.39-.53.05-1.02.24-3.43-.72-2.9-1.14-4.73-4.12-4.87-4.31-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08.99-2.37.25-.28.55-.35.73-.35h.53c.17 0 .4-.06.62.48.25.6.85 2.08.92 2.23.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.37-.42.49-.14.14-.28.29-.12.57.17.28.74 1.22 1.59 1.98 1.1.98 2.02 1.28 2.3 1.42.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.66-.18 1.35Z" />
    </svg>
  );
}

function IconViber() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={ico} aria-hidden="true">
      <path d="M12 2C7 2 3 5.6 3 10.4c0 2.1.9 4 2.5 5.4v3.6l3-1.9c1.1.4 2.3.6 3.5.6 5 0 9-3.6 9-8.3S17 2 12 2Zm4.9 11.6c-.2.5-1 1-1.4 1-.4.05-.7.2-2.4-.5-2-.8-3.3-2.9-3.4-3-.1-.15-.8-1.1-.8-2.05s.5-1.45.7-1.65c.17-.2.38-.24.5-.24h.37c.12 0 .28-.04.43.34.17.42.6 1.46.65 1.56.05.1.08.22.02.35-.07.14-.1.22-.2.34l-.3.35c-.1.1-.2.2-.08.4.12.2.52.86 1.12 1.4.77.68 1.42.9 1.62 1 .2.1.32.08.43-.05.12-.13.5-.57.63-.77.13-.2.26-.16.43-.1.18.07 1.12.53 1.31.63.2.1.32.14.37.22.05.09.05.47-.15.97Z" />
      <path d="M12.5 5.2a.5.5 0 0 0 0 1c2.4 0 4.3 1.9 4.3 4.3a.5.5 0 0 0 1 0c0-2.9-2.4-5.3-5.3-5.3Zm.1 1.9a.5.5 0 0 0 0 1c1.2 0 2.2 1 2.2 2.2a.5.5 0 0 0 1 0c0-1.8-1.4-3.2-3.2-3.2Z" fillOpacity="0.6" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={ico} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
