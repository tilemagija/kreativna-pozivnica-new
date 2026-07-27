// Serbian embroidery (vez) band used as a horizontal section divider — the same
// signature motif as the header's top strip, but wider/taller here so the woven
// pattern reads as its own segment break. The image is a seamless tile (one full
// pattern repeat, cream edges), so it repeats across any width with no visible seam.
// Purely decorative → hidden from screen readers.
const TRAKA = "url(/traka-razdelnik-tile.png)";

export default function TrakaDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-14 w-full bg-center bg-repeat-x md:h-20 ${className}`}
      style={{ backgroundImage: TRAKA, backgroundSize: "auto 100%" }}
    />
  );
}
