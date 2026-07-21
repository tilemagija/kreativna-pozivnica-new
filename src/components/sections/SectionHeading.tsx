import Reveal from "@/components/motion/Reveal";
import Lotus from "@/components/brand/Lotus";

// Shared section header: small tracked kicker → serif heading → gold lotus divider.
// The one heading pattern reused across every landing section (consistency, §11a).
// `as` lets a standalone page render this as its single <h1> (SEO §13); landing
// sections keep the default <h2> since the Hero already owns the page <h1>.
export default function SectionHeading({
  kicker,
  heading,
  tone = "dark",
  as: Tag = "h2",
}: {
  kicker?: string;
  heading: string;
  tone?: "dark" | "light";
  as?: "h1" | "h2";
}) {
  const light = tone === "light";
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {kicker && (
        <Reveal>
          <span
            className={`font-sans text-xs uppercase tracking-[0.3em] ${
              light ? "text-sage" : "text-sage-deep"
            }`}
          >
            {kicker}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <Tag
          className={`max-w-2xl font-serif text-3xl leading-tight sm:text-4xl md:text-5xl ${
            light ? "text-cream" : "text-ink"
          }`}
        >
          {heading}
        </Tag>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="flex items-center gap-3 pt-1 text-gold">
          <span className="h-px w-10 bg-gold/40" />
          <Lotus className="h-6 w-9" />
          <span className="h-px w-10 bg-gold/40" />
        </div>
      </Reveal>
    </div>
  );
}
