# DESIGN.md — izgled sajta (radni fajl za estetsku fazu)

> Ovo je JEDINI fajl koji treba za rad na izgledu. Tokeni + pravac + motion + backlog
> sitnica. Za funkcionalnost/proizvod → `docs/SPEC.md`. Gde smo → `ROADMAP.md`.
> Pravilo (CLAUDE.md §4): funkcija pre kozmetike; ali sad SMO u estetskoj fazi, pa je ovo fokus.

---

## ▶ TRENUTNO STANJE ESTETIKE — čitaj OVO prvo (26.07)

**Radimo KOMPLETAN etno-vintage overhaul po vlasnikovom mokapu** (topli papirus + duboka zelena + zlato, srpski vez trake, sepija fotografije). Mokap = master dizajn, ceo sajt ga prati. Vlasnik zadržava sekcije „О нама" i kontakt-sa-paketima; sve ostalo se redizajnira.

**PALETA ZAKLJUČANA (tokeni u `src/app/globals.css`):** papirus `--c-paper #E7D8B6` (pozadina + tekstura) · **duboka zelena `--c-forest #204022`** (naslovi/dugmad/akcenti) · zlato `--c-gold #B08D57` (lotos/linije) · telo teksta topla braon `--c-ink #3B3227`. Fontovi: Cormorant (naslovi) / Lora (telo) / Marck (script) — za sad ostaju.

**URAĐENO (Hero + Navbar, pass 1) — commit `4cc2e93`:**
- **Hero = vlasnikova slika** `public/hero.jpg` (pun ekran, `object-cover`), sa **„Ink Bleed Reveal"** na učitavanju (mastilo se upija ~3s pa se očisti; `components/motion/InkReveal.tsx` + `.ink-reveal` u globals.css; poštuje reduced-motion).
- **Navbar:** BEZ loga, **centrirani linkovi** (Акција·Настанак·Уметност и поклони·Додаци·Прилагодите), СР/EN + „Дизајнирајте сами" desno. **Transparentan preko Hero-a**, na skrol → cream pozadina + **gornja vez traka** (`public/traka-tile.png` — seamless, isečen jedan čist deo šare). Navbar je **IZNAD** slike (ne preklapa). Skrol se detektuje **duplo osigurano**: nativni `scroll` listener (Lenis je u default/window modu → native scroll evente OKIDA) **+** IntersectionObserver sentinel kao fallback. ✅ **Logika potvrđena** (27.07): na scroll event navbar dobija `bg-cream/95` + traka `h-10 opacity-100`, na povratak na vrh se vraća `bg-transparent` — klase se menjaju ispravno u oba smera. NB: finalni PIKSELI (boja/visina) se ne mogu videti kroz preview alat jer skriveni/headless tab **zamrzava CSS tranzicije i snimke** — to je granica alata, ne bug; vlasnik potvrdi vizuelno na `localhost:3000` (2 sek skrola).
- Intro overlay „**отварање коверте**" **vraćen** (`page.tsx`, video `otvaranje.mp4`, z-[60]). ✅ **Sekvenca sređena:** ink-bleed reveal se okida TEK kad se intro zatvori (intro dispatch-uje `intro:done` + `window.__introDone`; InkReveal drži sliku maskiranu `.ink-reveal-waiting` dok ne stigne signal; fallback 12s). Redosled: koverta se otvori → mastilo razlije sliku → slegne. Stari editorial Hero **sačuvan zakomentarisan** u `Hero.tsx` (ništa obrisano).

**URAĐENO — vez razdelnik (27.07):** ispod Hero-a ubačena **šira vez traka** kao razdelnik ka galeriji. Vlasnikova slika `public/traka-razdelnik.png` (original zadržan) isečena u bešavni tile `public/traka-razdelnik-tile.png` (period 384px, krem rub, 70KB). Komponenta `components/site/TrakaDivider.tsx` je **višekratna** (`h-14 md:h-20`, repeat-x, `bg-size auto 100%`, prima `src` → svaki razdelnik svoju šaru) — koristiti je i za ostale razdelnike sekcija + footer. Drugi razdelnik (posle „Наше услуге") = `public/traka2-tile.png` (period 348px, 82KB).

**URAĐENO — Наше услуге + pozadina (27.07):**
- **„Guzvani papir" izbačen** — strana je sad čist papirus (bez `body::before` teksture). `public/pozadina.jpg` (toplo laneno platno sa **vez ornamentima UŠIVENIM** levo/desno — vlasnikova `pozadina 3`, 324KB) je pozadina **SAMO sekcije Наше услуге** (odluka vlasnika+supruge: kao pozadina cele strane bila je previše „zumirana", trake se gube; treba da uokviri baš taj segment od vrha do dna). Primenjeno na `<section>` sa `background-size:100% 100%` (trake idu punom visinom). Zasebne overlay bočne trake **napuštene** (ornament je u samoj slici). Ako se kasnije opet zatreba full-page — slika ostaje.
- **Sekcija `components/sections/NaseUsluge.tsx`** (ispod TrakaDivider): naslov НАШЕ УСЛУГЕ + script „стварамо успомене" + 3 kartice (Позивнице/Слике/Посебни детаљи) sa placeholder slikama („ФОТОГРАФИЈА УСКОРО"). Krstići-razdelnici = `components/brand/CrossDivider.tsx` (SVG). Sadržaj `max-w-5xl` centriran (da ne prelazi ornamente). Tekst u `messages/*.json` → `Usluge`.
- **Linkovi kartica:** Позивнице → `/pozivnice`, Слике → `/umetnost`, Посебни детаљи → `/dodaci`.
- **Stil kartica = „АЛБУМ"** (vlasnikov izbor, protiv „AI grida"): 3 kartice **istih veličina**, ali kao stare fotografije — beli krem okvir sa **iscepanim ivicama** (SVG `feDisplacement` filter na `::before` krem sloju + `drop-shadow` POSLE `url()` → senka prati iscepanu konturu = deluje kao pravi podignut komad), **blago nakrivljene** (`--tilt` po kartici, na hover se isprave+podignu), **rukom pisan** naslov (Marck script). Opis ispod = **sans** (čitljiviji), 16px, ink. CSS klase `.album-print*` u `globals.css`. NE mešati sa savetom za GALERIJU (velike/asimetrične/preklapanje — čuva se za `/pozivnice` mozaik).
- **Hover „израстање + лепеза" (`components/sections/UslugeCards.tsx`, client):** na hover (samo pointer: `(hover:hover) and (pointer:fine)`) **sama kartica izraste iz svoje pozicije** u veliki panel koji pokriva ceo red 3 kartica, i unutra se **razbacaju slike** (framer stagger, scatter+rotacija). Kako: meri se `from` (rect kartice) + red; panel je `inset-0` (pokriva red), a raste **`scale`-om** (framer pouzdano animira transform; NE `width/height` — to ne tweenuje) sa `transform-origin` na centru baš te kartice. Originalna kartica se **sakrije** (`opacity:0`) dok panel gori → deluje kao da ona raste. Panel ima **iste iscepane ivice** (`.usluga-panel::before` + `#torn-edge-panel` filter, veći scale za veliku površinu). **Svaka kartica svoj izvor:** Позивнице←`getGallery`, Слике←`getArtworks`, Детаљи←`getDodaciItems` (prvih 8). `pointer-events-none` na lepezi → klik vodi na stranu. Touch/reduced-motion/prazan izvor → nema panela, tap vodi. Thumbs Sanity CDN `?w=280&h=350&fit=crop`. ⚠️ Animacija se NE vidi kroz preview alat (headless tab zamrzava framer rAF, kao navbar) — vlasnik gleda na `localhost`.
- **Galerija premeštena** sa početne na novu stranu `/pozivnice` (`src/app/[locale]/pozivnice/page.tsx`, reuse `Gallery`). Stara inline Gallery sekcija sklonjena sa `page.tsx`.
- ✅ **Slike kartica = CMS-povezane** (Sanity): `homePage` fieldset „2б · Наше услуге" → polja `uslugePozivniceImage/uslugeSlikeImage/uslugeDetaljiImage`. Query `getUsluge()`, komponenta renderuje CMS sliku ako postoji, inače placeholder („ФОТОГРАФИЈА УСКОРО"). Vlasnik uploaduje na `/studio` → Почетна страна → Наше услуге. (Tekst kartica i dalje u `messages/*.json`, ne u CMS-u.)

**★ SLEDEĆE (po mokapu, odozgo nadole):** „**Узори који остају**" (mozaik 5 slika) → **footer** (sa vez trakom) → pa preliti ton na „О нама" + kontakt/paketi. (Наше услуге ✅ gotovo gore.)

**⚠️ VLASNIK DOSTAVLJA (u `public/`, javi ime) — bez ovoga ne liči na mokap:**
- **Lotos SAMO, transparentno** (PNG/SVG) — trenutni `logo.png` ima „kutiju"; svakako nije u navbaru sad.
- **Hi-res hero** ≥1920px (sad 1280×731 = mekano na velikim ekranima).
- **~8 fotki proizvoda** (pozivnice, ilustracija/crkva, poklon, buket sa vezom, vez tekstil) za „услуге" kartice + „Узори" mozaik.
- Finalni tekstovi + odluka o nav nazivima (mokap: ПОЧЕТНА/ПОЗИВНИЦЕ/СЛИКЕ/О МЕНИ/КОНТАКТ; mi za sad zadržali naše).

**⚠️ TEHNIČKE ZAMKE (bitno za rad):**
- **DEV KEŠ:** izmene `globals.css` se ČESTO zaglave u `.next` kešu (servira stari CSS). Rešenje: `preview_stop` → `rm -rf .next` → `preview_start`. (Dešavalo se stalno ovu sesiju.)
- **Snimci ekrana app-a NE rade** (Lenis/renderer zapinje) → verifikuj preko computed styles (`javascript_tool`) ili vlasnik gleda `localhost:3000`.
- **Slike optimizovati** pre upotrebe (`sharp`): hero/traka/logo su smanjeni (paper 2.9MB→141KB, traka isečena+tile). Novi asseti isto.
- Push često prvi put padne (DNS) → probaj 2×.

---

## ★ VELIKI VIZUELNI PASS — vlasnikova žena (signal, 14.07)
> **Žena (oko za estetiku brenda — organski domet 200k) videla sajt i rekla da joj se NE sviđa: boje, fontovi, „kao da je dete crtalo".** Vredan signal — poklapa se sa anti-template upozorenjem dole. Ovo NIJE sitna korekcija nego **ozbiljan redizajn:**
> - [ ] Sesija sa ženom: uzeti KONKRETNO šta smeta (koje boje, fontovi, sekcije) + njene reference/želje — ona vodi estetiku.
> - [ ] Preispitati paletu (tokeni dole su „starter" iz loga/kartice — mogu se menjati) i tipografiju.
> - [ ] Pobeći od „template" osećaja: editorial/asimetrija, mozaik galerija, tekstura papira/akvarela, zlatni-lotos detalji — trenutna verzija to NE postiže.

---

## DIZAJN TOKENI  (starter iz loga + kartice — hex se sme menjati)

Estetika: **toplo, prozračno, editorial. Cream beline, antik-zlatna + sage akcenti, sepija-braon tekst (nikad čisto crna), zlatni lotos kao potpis.** Blagi akvarel/stari-papir osećaj sa brend kartice, umereno.

**Boje (starter tokeni — iz loga & kartice):**
| Token | Hex | Upotreba |
|---|---|---|
| `--c-cream` | `#F5EEE0` | primarna pozadina (topla slonovača) |
| `--c-greige` | `#E7E0D0` | alternativna pozadina sekcije (pozadina loga) |
| `--c-kraft` | `#E8D6BB` | vintage/stari akcenat (kartica), umereno |
| `--c-gold` | `#B7995A` | primarni akcenat — obris lotosa, logotip, ključne linije |
| `--c-gold-deep` | `#927741` | zlatna hover / borderi |
| `--c-sage` | `#9B9E76` | sekundarni akcenat — botanika, latice lotosa |
| `--c-sage-deep` | `#797B54` | sage hover / tamnija botanika |
| `--c-terracotta` | `#C08A6A` | topli tercijarni akcenat, vrlo umereno (akvarel prelivi) |
| `--c-ink` | `#3D352A` | telo teksta — topla duboka braon, NIJE crna |
| `--c-ink-muted` | `#6C6049` | sekundarni tekst |
| `--c-line` | `#DCD1BB` | razdvajači / meki borderi |

**Tipografija (sve mora imati punu ćirilicu):**
- **Naslovi/display:** `Cormorant Garamond` — elegantan roman serif kao logotip. Razmaknuti caps za naslove.
- **Telo/UI:** `Lora` — topao, čitljiv serif sa ćirilicom. (Opcioni čist sans `Inter`/`Manrope` za sitne UI labele.)
- **Script akcenat:** `Marck Script` — elegantna spojena kurziva sa **punom ćirilicom** (kao rukom pisana linija na kartici). Koristiti **umereno, samo ukrasno** (kratki tagline-ovi, flourishevi sekcija), nikad za telo teksta. Logotip ostaje brend slika.

**Motiv:** zlatno-obrisan **lotos** je potpis. Za: logo, razdvajače sekcija, favicon, suptilni watermark, seal-akcente. Retko i premium — nikad prenatrpano.

**Pravila:** puno cream beline; zlatna + sage kao *akcenti/linije*, ne velike površine; tekst je topla braon; akvarel/kraft teksture samo kao povremeni akcenti.

> Stvarno u kodu sad: Cormorant / Lora / Marck (ćirilica), tokeni u `src/tokens` (ili styles). Nema inline stilova — tokeni od prvog dana.

---

## PRAVAC & DIFERENCIJACIJA  (toplo-bogato, anti-template)

**Ukupno: TOPLO & BOGATO, ne minimalizam** (vlasnikova odluka). Tekstura, ornament, slojevit detalj — sajt kao ručno rađen artefakt (papir, akvarel, zlato), ne čist SaaS. Toplina preko sparne praznine. (Bogato ≠ prenatrpano — §4 kvalitet i dalje važi.)

**Bežimo od „default AI-generated" izgleda:**
- ❌ **Izbegavati:** generički sans (Inter/system); sve centrirano; uniformne zaobljene kartice u urednoj 3-kolonskoj mreži (#1 znak); ravne pune pozadine; default dugmad + generički drop shadow.
- ✅ **Raditi:** editorial / **asimetrični** raspored (odmaknut tekst, slike koje izlaze van ivice, varirani ritam); **galerija kao mozaik** (razne veličine/preklapanje), ne uniformna mreža; prava **materijalna tekstura** (papir/akvarel/kraft, suptilni grain) na toploj cream osnovi; **bespoke detalji** (zlatno-lotos razdvajači, zlatni listići, ručno-pocepane ivice, potpisni intro „otvaranje" overlay, možda custom kursor); **tipografija-vođena** hijerarhija (veliki serif + script akcenti, ćirilica-prvo — naš najveći aduт) sa velikodušnom, nepravilnom belinom.

> Test za svaku sekciju: *„Da li je ovo mogao da napravi nasumičan AI template?"* Ako da, dodaj zanat dok odgovor ne bude ne.

---

## MOTION / INTERAKCIJA  (jedan obrazac)

Jedan dosledan, **suptilan, premium** obrazac (framer-motion + lenis): nežni fade/rise sekcija pri skrolu, uzdržano. Bez blještavih efekata. Definisan jednom (`Reveal`, `SmoothScroll` — oba poštuju `prefers-reduced-motion`), primenjen svuda.

**Intro overlay „отварање позивнице" (potpisna interakcija):** na učitavanju sajt otvara full-screen cover kao *zatvorena pozivnica* (zlatni lotos + kratak poziv). Klik → cover se animira → hero. Koristi vlasnikov video `public/intro/otvaranje.mp4`. Pravila: pravi sadržaj ostaje SSR ispod (SEO), reduced-motion/Escape/Preskoči, jednom po sesiji.

**Pre bilo kog polish/animacija efekta** test: *„Da li pomaže sadržaju / radi dobro na mobilnom?"* Ako ne — preskoči.

---

## BACKLOG SITNICA (UX/UI dorada — batch kad se estetika slegne)

**Nav / Header**
- [ ] Finalni font i veličine stavki
- [ ] Boje — nijansa „Акција" preliva, hover boje ostalih linkova
- [ ] Hover efekti — „festive" na Акција doterati
- [ ] Pozicija / razmaci, ponašanje pri skrolu
- [ ] **Pravi logo kao slika** umesto teksta (čeka brend asset)

**Intro (otvaranje)**
- [ ] HQ izvoz videa umesto WhatsApp verzije (299KB)
- [ ] Desktop: eventualno landscape verzija videa (opciono)
- [ ] Sitni tweakovi po vlasnikovoj želji

**SEO/share**
- [ ] OG share slika (og.png/dinamička) — sad nema slike pri deljenju na FB/IG/Viber
- [ ] Puni per-page hreflang (sad baseline)

**World B (Уметност) estetika**
- [ ] Redizajn izgleda verske/slava linije (`data-world="b"` hook postavljen; struktura/logika finalne)

**Hero / Zašto baš mi / ostalo**
- [ ] (dodati kad se primeti)
