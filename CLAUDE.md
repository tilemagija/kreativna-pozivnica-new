# CLAUDE.md — Kreativna Pozivnica (radna pravila)

> **Kako čitati na startu (posle /clear):** ovaj fajl (pravila) + `ROADMAP.md` „TRENUTNO STANJE"
> (gde smo) + `DESIGN.md` (izgled — trenutna faza). Puna specifikacija proizvoda/flow-ova je u
> `docs/SPEC.md` (čitaj PO POTREBI, kad se dira funkcionalnost). Istorija: `docs/ROADMAP-archive.md`.
> Vlasnikove obaveze: `docs/vlasnik-todo.md`.
>
> Vlasnik je **no-code developer** — objašnjavaj prostim jezikom, ne samo žargonom.

---

## 1. KO SAM / KAKO RADIM
- Radim u **„CEO modu"**: definišem **ŠTA** gradimo. Ti predlažeš i implementiraš **KAKO**.
- Ne volim natezanje. Daj jasan plan pa izvrši. Ne traži od mene tehničke mikro-odluke — preporuči, i flag-uj samo odluke koje stvarno traže mene.
- Nisam tehnički. Objasni *zašto* prosto; uz bitan tehnički termin dodaj jednu liniju objašnjenja.

## 2. RADNI PROCES (tvrda pravila)
- **Plan pre akcije** na svemu što dira **3+ fajla**. Izloži plan, sačekaj odobrenje, pa implementiraj.
- **Build mora da prođe pre svakog push-a.** Bez izuzetka.
- **Jedan task = jedan commit** sa jasnom porukom.
- **Ne instaliraj nove pakete/zavisnosti bez izričitog odobrenja.** Predloži, reci zašto, sačekaj.
- **Veličina komponente:** ako pređe **~200 linija**, to je signal da se deli. Flag-uj.
- **Disciplina obima:** svaki radni komad dobija eksplicitno **„šta NE radimo"** i **„gotovo kad..."** unapred.
- **Potpuno responsive po defaultu (mobile-first) — neupitno.** SVAKA sekcija/komponenta/strana mora da radi i izgleda dobro na **telefonu, tabletu, desktopu** — provereno kao deo „gotovo", nikad odloženo. Dizajniraj mobile-first (~360px pa naviše). Bez horizontalnog skrola, bez odsečenog teksta, tap-mete dovoljno velike. Većina publike dolazi sa telefona (Instagram).
- **Ne istražuj dobро-dokumentovane, poznate alate** (Next.js, Sanity, standardne biblioteke) — samo ih koristi.

## 3. BEZBEDNOST — NAJVAŽNIJI DEO ⚠️
Ja NE znam kako izgleda ranjivost. To je TVOJ posao da isplivaš, ne moj da pamtim.
Bezbednost nije feature koji se „doda" — to je **odsustvo otvorenih vrata** u onome što gradimo.

**Tvrdo pravilo — ISPLIVAJ RUPE:** za svaki deo koji uzima input **iz spoljnog sveta** (forma, API ruta, CMS, upload, webhook, plaćanje), PRE nego što kažeš gotovo:
1. Nabroj načine napada/zloupotrebe, **prostim jezikom**.
2. Reci koju zaštitu/limit postavljaš za svaki.
3. Ako je nešto ostalo nezaštićeno, reci to eksplicitno.

**Standardna pravila (iz stvarnog incidenta — nezaštićen input koštao klijenta $50.000):**
- **Rate limiting:** svaki input koji se može zvati mnogo puta (forme, API rute, webhook-ovi) MORA imati limit.
- **Tajni ključevi / tokeni / API ključevi NIKAD u client-side kodu** (što ide u browser). Samo server-side.
- **Validiraj i sanitizuj** sve što dolazi od korisnika pre upotrebe/čuvanja.
- Duboku pažnju usmeri na **prava vrata** (spoljni inputi). Komponenta koja samo *prikazuje* sadržaj nije vrata — ne pretvaraj svaki unutrašnji zid u bezbednosni audit.

## 4. HIJERARHIJA KVALITETA
„Dobar kod" = **inženjerski kvalitet**, ne kozmetika:
- Zdrava, razumna arhitektura. Dobra bezbednost. Čist, održiv kod koji bi senior developer pogledao i rekao *„solidna osnova, ovde je uloženo vreme."*
- Kozmetika (hover efekti, animacije) **NIJE** ono što meni znači kvalitet. To je sekundarno.

**Redosled prioriteta, uvek:** 1. Funkcionalnost koja rešava pravi problem (uključuje zdravu arhitekturu + bezbednost + čist kod). 2. Kozmetika **tek posle** što funkcija radi.
**Pre BILO kog polish/animacije** test: *„Da li pomaže sadržaju / radi dobro na mobilnom?"* Ako ne — preskoči.

## 5. TEHNIČKI OBRASCI (principi)
- **Styling od prvog dana:** design-token / utility sistem od starta. Nikad razbacani inline stilovi „popraviću kasnije".
- **Jedan ponovljiv interakcijski obrazac:** definiši jednom (motion) i primeni svuda.
- **Sadržaj koji vlasnik menja ide kroz CMS/config SAMO. Nikad hardkodovati** sadržaj koji vlasnik treba sam da menja.

## 6. LAUNCH DISCIPLINA
- **Nikad ne deploy-uj lažnu funkcionalnost.** Forma/integracija koja izgleda da radi a ne radi ništa (npr. samo `console.log`) ne sme u produkciju.
- **Pred-launch čeklista obavezna:** pre launcha proveri da nema placeholder/demo sadržaja u produkciji.

## 7. NAUČENE LEKCIJE (dopunjavaj — jedna linija po grešci)
- **Nikad ne veruj ceni iz browsera.** Uvek preračunaj finalni iznos na serveru pre naplate.
- **Ne obećavaj ponašanje platforme koje ne možemo da proverimo.** (Npr. Instagram ne može pre-puniti DM tekst+slika linkom — Meta blokira.)
- **Live text-over-image editor: tekst KONTROLISAN iz jednog React state-a (jedan izvor istine).** NE mešati `contentEditable` + upisivanje state-a nazad — tekst se resetuje/bori sa karetom (to je srušilo prvi pokušaj konfiguratora). Izmena kroz prava input polja (mobilno pouzdano); klik na tekst na slici samo fokusira polje. Verifikuj uživo u browseru, ne samo SSR/build.

---

## PROJEKAT — ukratko (detalji u `docs/SPEC.md`)
Premium ručno rađene svadbene pozivnice + custom umetnost/pokloni. **Dva sveta:** A = pozivnice (shop logika: konfiguriši→cena→kupi), B = umetnost & slava pokloni (showcase→upit). **Cilj:** smanjiti DM opterećenje + pretvoriti posetu u narudžbu. **Stack:** Next.js + TS + Tailwind + Sanity + next-intl (sr-Cyrl default + en) + framer-motion/lenis, Vercel. **Plaćanje:** uplata na račun (poziv na broj + IPS QR). Launch: **januar**.

→ Izgled/tokeni: `DESIGN.md` · Proizvodi/flow/cene/bezbednost: `docs/SPEC.md` · Gde smo: `ROADMAP.md` · Vlasnik TODO: `docs/vlasnik-todo.md`
