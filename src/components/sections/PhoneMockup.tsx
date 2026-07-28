import Image from "next/image";

type Tile = { url: string; alt: string } | null;

// A phone frame showing a 2×3 Instagram grid. Real images from Sanity; when empty,
// soft brand-color swatches stand in (so it looks intentional, like the reference).
const SWATCHES = [
  "bg-sage",
  "bg-gold",
  "bg-kraft",
  "bg-greige",
  "bg-cream",
  "bg-terracotta",
];

export default function PhoneMockup({
  tiles,
  handle,
}: {
  tiles: Tile[];
  handle?: string;
}) {
  const cells = Array.from({ length: 6 }, (_, i) => tiles[i] ?? null);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-56 rounded-[2rem] border border-forest/15 bg-forest/5 p-2 shadow-2xl shadow-forest/25">
        <div className="overflow-hidden rounded-[1.6rem] bg-cream">
          {/* header */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage font-serif text-sm text-cream">
              М
            </div>
            <span className="font-sans text-xs text-ink">
              {handle || "kreativna_pozivnica"}
            </span>
          </div>
          {/* grid */}
          <div className="grid grid-cols-2 gap-0.5">
            {cells.map((tile, i) => (
              <div key={i} className="relative aspect-square">
                {tile ? (
                  <Image
                    src={tile.url}
                    alt={tile.alt}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div className={`h-full w-full ${SWATCHES[i % SWATCHES.length]}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="font-sans text-xs uppercase tracking-[0.25em] text-sage-deep">
        @{(handle || "kreativna_pozivnica").replace(/^@/, "")}
      </span>
    </div>
  );
}
