// Serbian embroidery (vez) band used as a horizontal section divider — the same
// signature motif as the header's top strip, but wider/taller here so the woven
// pattern reads as its own segment break. Each image is a seamless tile (one full
// pattern repeat), so it repeats across any width with no visible seam. `src` lets each
// segment break use a different vez band. Purely decorative → hidden from screen readers.
export default function TrakaDivider({
  className = "",
  src = "/traka-razdelnik-tile.png",
  heightClass = "h-14 md:h-20",
}: {
  className?: string;
  src?: string;
  heightClass?: string;
}) {
  return (
    <div
      aria-hidden
      className={`w-full bg-center bg-repeat-x ${heightClass} ${className}`}
      style={{ backgroundImage: `url(${src})`, backgroundSize: "auto 100%" }}
    />
  );
}
