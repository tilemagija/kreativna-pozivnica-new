import Reveal from "@/components/motion/Reveal";
import Lotus from "@/components/brand/Lotus";

// Shared section header: small tracked kicker → serif heading → gold lotus divider.
// The one heading pattern reused across every landing section (consistency, §11a).
export default function SectionHeading({
  kicker,
  heading,
  tone = "dark",
}: {
  kicker?: string;
  heading: string;
  tone?: "dark" | "light";
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
        <h2
          className={`max-w-2xl font-serif text-3xl leading-tight sm:text-4xl md:text-5xl ${
            light ? "text-cream" : "text-ink"
          }`}
        >
          {heading}
        </h2>
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
