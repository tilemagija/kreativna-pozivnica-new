import { PT_Serif, Philosopher, Oswald, Russo_One, Alegreya } from "next/font/google";
import Confetti from "./Confetti";

// Internal navbar-picking page (not linked, not indexed). Three full-width bars over the
// real hero image, so weight/size/spread can be judged against the watercolour the nav
// actually sits on — not against white. Delete once a variant is chosen.
const ptSerif = PT_Serif({ subsets: ["latin", "cyrillic"], weight: ["700"], display: "swap" });
const philosopher = Philosopher({ subsets: ["latin", "cyrillic"], weight: ["700"], display: "swap" });
const oswald = Oswald({ subsets: ["latin", "cyrillic"], weight: ["700"], display: "swap" });
const russo = Russo_One({ subsets: ["latin", "cyrillic"], weight: ["400"], display: "swap" });
const alegreyaBold = Alegreya({ subsets: ["latin", "cyrillic"], weight: ["700"], display: "swap" });

// „Почетна" is omitted on purpose in every variant: owner's ask #4 — on the landing page the
// link points at the page you are already on, so it only takes space.
const ITEMS = ["Настанак", "Уметност и поклони", "Додаци", "Прилагодите"];

type Variant = {
  key: string;
  name: string;
  idea: string;
  navClass: string;
  navSize: string;
  hoverClass: string;
  akcijaClass: string;
  akcijaWrap?: string;
};

const VARIANTS: Variant[] = [
  {
    key: "kamen",
    name: "A · Камен",
    idea:
      "Најмирнија и најчвршћа. PT Serif Bold верзалом — фонт чија је ћирилица матерња, па делује као уклесан. Hover: пуни правоугаоник у боји пергамента са златном линијом на дну. Акција: Oswald — узак, гласан, потпуно другог карактера.",
    navClass: `${ptSerif.className} uppercase tracking-[0.08em]`,
    navSize: "text-[15px]",
    hoverClass:
      "rounded-sm px-4 py-2.5 transition-colors duration-200 hover:bg-greige hover:shadow-[inset_0_-2px_0_var(--c-gold)]",
    akcijaClass: `${oswald.className} uppercase tracking-[0.06em] text-[19px] text-terracotta`,
  },
  {
    key: "pecat",
    name: "B · Печат",
    idea:
      "Најјачи контраст. Philosopher Bold — геометријска, помало словенска форма. Hover: правоугаоник се пуни тамнозеленом, слова постају крем — изгледа као да се дугме притиска. Акција: Russo One у златној плочици.",
    navClass: `${philosopher.className} uppercase tracking-[0.12em]`,
    navSize: "text-[15px]",
    hoverClass:
      "rounded-sm px-4 py-2.5 transition-colors duration-200 hover:bg-forest hover:text-cream",
    akcijaClass: `${russo.className} uppercase tracking-[0.04em] text-[17px] text-cream`,
    akcijaWrap: "rounded-sm bg-gold px-4 py-2 shadow-[0_2px_10px_rgba(176,141,87,0.5)]",
  },
  {
    key: "toplo",
    name: "C · Топло",
    idea:
      "Најближа садашњем осећају сајта. Alegreya Bold (исти род као текст, само дебео), без верзала — топлије и читљивије. Hover: крем правоугаоник са утиснутом ивицом, као стварно дугме. Акција: Oswald у црвеној плочици која пулсира.",
    navClass: `${alegreyaBold.className} tracking-[0.01em]`,
    navSize: "text-[19px]",
    hoverClass:
      "rounded-md px-4 py-2 transition-all duration-200 hover:bg-cream hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_6px_rgba(59,50,39,0.18)]",
    akcijaClass: `${oswald.className} uppercase tracking-[0.06em] text-[18px] text-cream`,
    akcijaWrap: "akcija-pulse rounded-sm bg-terracotta px-4 py-2",
  },
];

export default function NavbarProbaPage() {
  return (
    <div className="pb-32">
      <div className="mx-auto max-w-4xl px-6 pb-8 pt-12">
        <h1 className="font-serif text-3xl text-ink">Проба навигације — 3 варијанте</h1>
        <p className="mt-3 font-body text-ink-muted">
          Сваку пробај мишем: пређи преко обичних линкова (правоугаоник), па преко{" "}
          <b>АКЦИЈА</b> (конфете). Траке су преко праве позадине, не преко белог — да се види
          како стварно легне.
        </p>
        <p className="mt-2 font-body text-sm text-ink-muted">
          У све три: веће, подебљано, развучено по целој ширини, без „Почетна" (на почетној
          страни не треба).
        </p>
      </div>

      <div className="flex flex-col gap-16">
        {VARIANTS.map((v) => (
          <section key={v.key}>
            <div className="mx-auto max-w-4xl px-6 pb-3">
              <h2 className="font-serif text-2xl text-forest">{v.name}</h2>
              <p className="mt-1 max-w-3xl font-body text-sm text-ink-muted">{v.idea}</p>
            </div>

            {/* Bar over the real hero watercolour */}
            <div
              className="relative w-full bg-cover bg-center"
              style={{ backgroundImage: "url(/crkva.jpg)" }}
            >
              <div className="bg-cream/95 backdrop-blur">
                <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-2 px-6 py-3 md:px-10">
                  <ul className={`flex flex-1 items-center justify-between gap-1 text-ink ${v.navSize}`}>
                    <li>
                      <Confetti>
                        <a
                          href="#"
                          className={`inline-block whitespace-nowrap ${v.akcijaWrap ?? ""} ${v.akcijaClass}`}
                        >
                          АКЦИЈА
                        </a>
                      </Confetti>
                    </li>
                    {ITEMS.map((label) => (
                      <li key={label}>
                        <a
                          href="#"
                          className={`inline-block whitespace-nowrap ${v.navClass} ${v.hoverClass}`}
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#"
                    className="ml-6 whitespace-nowrap rounded-sm bg-gold px-6 py-2.5 font-serif text-base italic text-cream transition-colors hover:bg-gold-deep"
                  >
                    Дизајнирајте сами
                  </a>
                </nav>
              </div>
              <div className="h-40" />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
