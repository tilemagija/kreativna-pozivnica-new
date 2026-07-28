import Image from "next/image";

type Tile = { url: string; alt: string } | null;

// A phone frame. When the owner uploads an Instagram-profile screenshot it fills the
// screen (looks like the profile is open); otherwise it falls back to a 2-col grid of
// Instagram images, or soft brand swatches when even those are empty. The whole phone
// links to the Instagram profile when a URL is given.
const SWATCHES = ["bg-sage", "bg-gold", "bg-kraft", "bg-greige", "bg-cream", "bg-terracotta"];

export default function PhoneMockup({
  tiles,
  handle,
  screenshot,
  href,
}: {
  tiles: Tile[];
  handle?: string;
  screenshot?: string;
  href?: string;
}) {
  const cells = Array.from({ length: 6 }, (_, i) => tiles[i] ?? null);
  const cleanHandle = (handle || "kreativna_pozivnica").replace(/^@/, "");

  const screen = screenshot ? (
    <div className="relative aspect-[9/16] w-full">
      <Image
        src={screenshot}
        alt={`Instagram профил @${cleanHandle}`}
        fill
        sizes="224px"
        className="object-cover object-top"
      />
    </div>
  ) : (
    <>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage font-serif text-sm text-cream">
          М
        </div>
        <span className="font-sans text-xs text-ink">{cleanHandle}</span>
      </div>
      <div className="grid grid-cols-2 gap-0.5">
        {cells.map((tile, i) => (
          <div key={i} className="relative aspect-square">
            {tile ? (
              <Image src={tile.url} alt={tile.alt} fill sizes="120px" className="object-cover" />
            ) : (
              <div className={`h-full w-full ${SWATCHES[i % SWATCHES.length]}`} />
            )}
          </div>
        ))}
      </div>
    </>
  );

  const phone = (
    <div className="w-56 rounded-[2rem] border border-forest/15 bg-forest/5 p-2 shadow-2xl shadow-forest/25 transition group-hover/phone:-translate-y-1 group-hover/phone:shadow-forest/35">
      <div className="overflow-hidden rounded-[1.6rem] bg-cream">{screen}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-3">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Отвори Instagram профил @${cleanHandle}`}
          className="group/phone block"
        >
          {phone}
        </a>
      ) : (
        phone
      )}
      <span className="font-sans text-xs uppercase tracking-[0.25em] text-sage-deep">
        @{cleanHandle}
      </span>
    </div>
  );
}
