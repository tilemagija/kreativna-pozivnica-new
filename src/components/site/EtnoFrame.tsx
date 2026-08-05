// Reusable etno "framed textile" wrapper for the inner pages (World B kit: pozivnice,
// umetnost). Composition mirrors the landing's pozadina3 idea but from composable
// pieces: a calm linen FIELD in the middle so artwork/gallery images breathe, and
// vertical vez COLUMNS down the left/right edges. The columns are desktop-only — on
// phones/tablets there isn't room, so content takes the full width (mobile-first, no
// side crowding). Ornament frames the edges; the center stays quiet ("bogato ≠
// prenatrpano", §4). The vez band is opaque (its own linen backing), tonally matched to
// the field, so it reads as one continuous cloth. (Horizontal top band removed per owner.)
const LINEN = {
  backgroundImage: "url(/pozadinaB.jpg)",
  backgroundSize: "600px",
  backgroundRepeat: "repeat" as const,
};
const COLUMN = {
  backgroundImage: "url(/vertikalnaB-tile.jpg)",
  backgroundSize: "100% auto",
};

export default function EtnoFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-h-screen bg-paper ${className}`} style={LINEN}>
      {/* vertical vez columns hugging both edges — desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[92px] bg-repeat-y lg:block xl:w-[112px]"
        style={COLUMN}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[92px] bg-repeat-y lg:block xl:w-[112px]"
        style={COLUMN}
      />

      {/* content breathes in the center, cleared of the side columns on desktop.
          pt clears the fixed navbar (no top band anymore). */}
      <div className="relative z-10 pt-20 md:pt-28 lg:px-[112px] xl:px-[132px]">
        {children}
      </div>
    </div>
  );
}
