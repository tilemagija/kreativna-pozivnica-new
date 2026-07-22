# DESIGN.md — izgled sajta (radni fajl za estetsku fazu)

> Ovo je JEDINI fajl koji treba za rad na izgledu. Tokeni + pravac + motion + backlog
> sitnica. Za funkcionalnost/proizvod → `docs/SPEC.md`. Gde smo → `ROADMAP.md`.
> Pravilo (CLAUDE.md §4): funkcija pre kozmetike; ali sad SMO u estetskoj fazi, pa je ovo fokus.

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
