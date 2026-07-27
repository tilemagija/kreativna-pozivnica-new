// Small ethno cross ornament (owner mockup): a diamond center with four short arms
// ending in dots — used as a delicate divider above section headings and between cards.
// Inherits color via `currentColor` (use text-gold). Purely decorative.
export default function CrossDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <rect x="8.5" y="8.5" width="7" height="7" transform="rotate(45 12 12)" fill="currentColor" opacity="0.85" stroke="none" />
      <line x1="12" y1="2.5" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21.5" y2="12" />
      <circle cx="12" cy="2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="22" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="2" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="22" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
