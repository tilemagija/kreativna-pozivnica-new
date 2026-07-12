// Kraft package illustration (§11a: real material feel, hand-made). Wrapped paper
// tied with gold twine + a little knot; alternating variants carry a paper tag.
// Tokenized colors (var(--c-*)); used for the "falling packages" social-proof pile.
export default function PackageIllustration({
  withTag = false,
  className,
}: {
  withTag?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 92" className={className} role="img" aria-hidden="true">
      {/* paper body */}
      <rect x="6" y="12" width="108" height="72" rx="7" fill="var(--c-kraft)" />
      {/* top highlight + bottom shade for a little depth */}
      <rect x="6" y="12" width="108" height="12" rx="7" fill="#ffffff" opacity="0.14" />
      <rect x="6" y="70" width="108" height="14" fill="var(--c-ink)" opacity="0.07" />
      {/* soft fold line */}
      <line x1="6" y1="40" x2="114" y2="40" stroke="var(--c-ink)" strokeWidth="0.6" opacity="0.08" />

      {/* gold twine, tied diagonally */}
      <g
        fill="none"
        stroke="var(--c-gold-deep)"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M20 14 L100 82" />
        <path d="M100 14 L20 82" />
        {/* little bow loops at the knot */}
        <path d="M60 48 C 52 40, 48 52, 58 50" />
        <path d="M60 48 C 68 40, 72 52, 62 50" />
      </g>
      <circle cx="60" cy="48" r="3.4" fill="var(--c-gold-deep)" />

      {/* paper tag on alternating packages */}
      {withTag && (
        <g transform="rotate(-14 95 20)">
          <line x1="78" y1="30" x2="95" y2="18" stroke="var(--c-gold-deep)" strokeWidth="1.4" />
          <rect x="90" y="12" width="22" height="15" rx="2.5" fill="var(--c-cream)" stroke="var(--c-line)" strokeWidth="0.8" />
          <circle cx="93.5" cy="15.5" r="1.1" fill="var(--c-gold-deep)" />
          <line x1="95" y1="18" x2="108" y2="18" stroke="var(--c-ink-muted)" strokeWidth="0.7" opacity="0.5" />
          <line x1="95" y1="22" x2="106" y2="22" stroke="var(--c-ink-muted)" strokeWidth="0.7" opacity="0.5" />
        </g>
      )}
    </svg>
  );
}
