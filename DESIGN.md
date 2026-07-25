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
- **Navbar:** BEZ loga, **centrirani linkovi** (Акција·Настанак·Уметност и поклони·Додаци·Прилагодите), СР/EN + „Дизајнирајте сами" desno. **Transparentan preko Hero-a**, na skrol → cream pozadina + **gornja vez traka** (`public/traka-tile.png` — seamless, isečen jedan čist deo šare). Navbar je **IZNAD** slike (ne preklapa). Skrol se detektuje preko **IntersectionObserver** sentinela (Lenis guši scroll evente). ⚠️ **transparent→cream na skrol NIJE potvrđen uživo** — proveriti pravim skrolom; ako ne radi, IO sentinel je već postavljen, samo debug.
- Intro overlay „**отварање коверте**" **vraćen** (`page.tsx`, video `otvaranje.mp4`, z-[60] iznad svega). ⚠️ Napomena: ink-bleed reveal Hero-a se sad odigra IZA intro cover-a (na load), pa ga korisnik ne vidi kad klikne intro — refinement za kasnije: okinuti ink-reveal TEK kad se intro zatvori. Stari editorial Hero **sačuvan zakomentarisan** u `Hero.tsx` (ništa obrisano).

**★ SLEDEĆE (po mokapu, odozgo nadole):** sekcija „**Наше услуге**" (3 kartice: Позивнице/Слике/Посебни детаљи) → „**Узори који остају**" (mozaik 5 slika) → **footer** (sa vez trakom) → pa preliti ton na „О нама" + kontakt/paketi. Bočni vertikalni vez ornamenti + sitni krstići-razdelnici (radim kao SVG).

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
