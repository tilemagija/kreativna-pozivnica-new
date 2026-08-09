// Serbian Cyrillic → Latin. This is what lets the site offer a Latin version without the
// owner ever writing anything twice: content is authored once in Cyrillic (CMS + messages)
// and the `sr-Latn` locale renders it through here.
//
// The direction matters. Cyrillic → Latin is a clean 1:1 mapping, so it is safe to automate.
// The reverse is NOT (Latin "nj" could be њ or н+ј), which is why Cyrillic stays the source.
const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "đ", е: "e", ж: "ž", з: "z",
  и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o",
  п: "p", р: "r", с: "s", т: "t", ћ: "ć", у: "u", ф: "f", х: "h", ц: "c",
  ч: "č", џ: "dž", ш: "š",
};

// Digraphs (Љ Њ Џ) are the only tricky part: „ЉУБАВ" must give „LJUBAV" but „Љубав" must
// give „Ljubav" — so the case of the NEXT letter decides, not the letter itself.
const DIGRAPHS = new Set(["љ", "њ", "џ"]);

const isUpperCyrillic = (ch: string | undefined): boolean =>
  !!ch && ch !== ch.toLowerCase() && ch === ch.toUpperCase();

export function toLatin(input: string): string {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const lower = ch.toLowerCase();
    const mapped = MAP[lower];

    if (!mapped) {
      out += ch; // punctuation, digits, Latin, spaces — untouched
      continue;
    }

    if (ch === lower) {
      out += mapped; // already lowercase
      continue;
    }

    // Uppercase Cyrillic letter.
    if (DIGRAPHS.has(lower)) {
      out += isUpperCyrillic(input[i + 1])
        ? mapped.toUpperCase() // ЉУБАВ → LJUBAV
        : mapped[0].toUpperCase() + mapped.slice(1); // Љубав → Ljubav
    } else {
      out += mapped.toUpperCase();
    }
  }
  return out;
}

// Walks a loaded messages object and transliterates every string, leaving the shape intact.
// Used to build the whole `sr-Latn` message catalogue from `sr.json` at request time — there
// is no sr-Latn.json to keep in sync.
export function toLatinDeep<T>(value: T): T {
  if (typeof value === "string") return toLatin(value) as unknown as T;
  if (Array.isArray(value)) return value.map(toLatinDeep) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = toLatinDeep(v);
    return out as T;
  }
  return value;
}
