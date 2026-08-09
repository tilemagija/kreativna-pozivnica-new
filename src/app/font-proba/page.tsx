import { PT_Serif, Old_Standard_TT, Alegreya, Literata, Lora } from "next/font/google";

// Internal font-picking page (not linked anywhere, not in the sitemap). Shows the owner's
// real „О нама" text in each candidate so the choice is made on actual Cyrillic, at the
// actual body size — not on a specimen of Latin letters. Delete once a font is picked.
const lora = Lora({ subsets: ["latin", "cyrillic"], weight: ["400"], display: "swap" });
const ptSerif = PT_Serif({ subsets: ["latin", "cyrillic"], weight: ["400"], display: "swap" });
const oldStandard = Old_Standard_TT({ subsets: ["latin", "cyrillic"], weight: ["400"], display: "swap" });
const alegreya = Alegreya({ subsets: ["latin", "cyrillic"], weight: ["400"], display: "swap" });
const literata = Literata({ subsets: ["latin", "cyrillic"], weight: ["400"], display: "swap" });

const STORY = `Креативна позивница није настала као велики план или пословна идеја.

Настала је након рођења нашег сина, у периоду када сам остала без посла и тражила нови почетак. За његов први рођендан направила сам позивницу онако како сам је замишљала и поделила је на Инстаграму, не слутећи да ће баш тај мали корак променити наш живот.

Од прве позивнице до данас много тога се променило, али једно је остало исто – сваком раду приступамо са истом љубављу и пажњом са којом је настала она прва позивница за наше дете.`;

// The letters that separate a real Cyrillic font from a half-done one.
const TRICKY = "Ђ ђ · Љ љ · Њ њ · Ћ ћ · Џ џ · Ж ж · Ч ч · Ш ш · Б б · Д д";

const CANDIDATES = [
  {
    key: "lora",
    name: "Lora",
    tag: "САДА НА САЈТУ",
    note: "Тренутни фонт — овде је само да имаш са чим да поредиш.",
    cls: lora.className,
    current: true,
  },
  {
    key: "ptserif",
    name: "PT Serif",
    tag: "препорука",
    note:
      "Радила га руска ливница ParaType, и то ћирилицу ПРВО, латиницу после — обрнуто од већине. Зато ћирилична слова не изгледају као превод, него као да су ту рођена. Топао, чврст, лак за читање у дугом тексту.",
    cls: ptSerif.className,
  },
  {
    key: "oldstandard",
    name: "Old Standard TT",
    tag: "најтрадиционалнији",
    note:
      "Обнова словенске књижне типографије с почетка 20. века — оно што видиш у старим црквеним и школским књигама. Најближе „нашем\" осећају, али је тањи и оштрији: диван за причу, напорнији за велике количине текста.",
    cls: oldStandard.className,
  },
  {
    key: "alegreya",
    name: "Alegreya",
    tag: "најтоплији",
    note:
      "Књижевни фонт, са благим траговима руке у словима — најдаље од „писаће машине\". Мање је словенски по пореклу, али је најпитомији за читање дуже приче.",
    cls: alegreya.className,
  },
  {
    key: "literata",
    name: "Literata",
    tag: "резерва",
    note:
      "Прављен за читање књига на екрану. Чврст и модеран, добра ћирилица — најсигурнији избор ако ти прва три делују превише „старински\".",
    cls: literata.className,
  },
];

export default function FontProbaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-3xl text-ink">Проба фонтова — „О нама“</h1>
      <p className="mt-3 font-body text-ink-muted">
        Исти твој текст, иста величина као на сајту. Гледај ћирилицу, не латиницу — и обрати
        пажњу на ред са тешким словима (Ђ, Љ, Њ, Ћ, Џ).
      </p>

      <div className="mt-10 flex flex-col gap-12">
        {CANDIDATES.map((f) => (
          <section
            key={f.key}
            className={`rounded-md border p-6 ${
              f.current ? "border-line bg-greige/30" : "border-gold/40 bg-cream"
            }`}
          >
            <div className="mb-1 flex flex-wrap items-baseline gap-3">
              <h2 className="font-serif text-2xl text-forest">{f.name}</h2>
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-sage-deep">
                {f.tag}
              </span>
            </div>
            <p className="mb-5 font-body text-sm text-ink-muted">{f.note}</p>

            <div className={f.cls}>
              <p className="mb-4 text-2xl text-forest">Наша прича</p>
              <p className="whitespace-pre-line leading-relaxed text-ink-muted">{STORY}</p>
              <p className="mt-5 border-t border-line pt-4 text-lg text-ink">{TRICKY}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
