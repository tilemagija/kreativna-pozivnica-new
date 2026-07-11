// The signature gold lotus (CLAUDE.md §11 motif). Outline only, uses currentColor
// so callers set the tone via text-* utilities (e.g. text-gold). Reused across the
// site: intro cover, section dividers, favicon, watermark.
export default function Lotus({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* center petal */}
        <path d="M60 10 C 52 30, 52 50, 60 68 C 68 50, 68 30, 60 10 Z" />
        {/* inner side petals */}
        <path d="M60 68 C 45 55, 39 36, 41 21 C 53 30, 58 50, 60 68 Z" />
        <path d="M60 68 C 75 55, 81 36, 79 21 C 67 30, 62 50, 60 68 Z" />
        {/* outer side petals */}
        <path d="M60 68 C 41 63, 25 51, 21 34 C 37 36, 50 53, 60 68 Z" />
        <path d="M60 68 C 79 63, 95 51, 99 34 C 83 36, 70 53, 60 68 Z" />
      </g>
    </svg>
  );
}
