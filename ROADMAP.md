# ROADMAP — Kreativna Pozivnica

Build kroz leto → **launch januar.** Temeljno, ne beskonačno.
Puna istorija + fazni plan: `docs/ROADMAP-archive.md` · Specifikacija: `docs/SPEC.md` · Izgled: `DESIGN.md`

---

## ▶ TRENUTNO STANJE — čitaj OVO prvo posle /clear

**Faza sada: ETNO — UNUTRAŠNJE STRANE (`/pozivnice` + `/umetnost`) — ✅ ZAOKRUŽENO.** Početna je ranije zaokružena (Hero→footer, sve u etno tonu; detalji u `DESIGN.md`). Sada su i galerijske strane u istom svetu: **EtnoFrame** (laneno polje `pozadinaB` + bočne vez kolone `vertikalnaB` na desktopu) · slike „uramljene" (krem paspartu + senka) · **infinite scroll** (učitava po grupama na skrol, bez stranica 1-2-3) · **editorijalni mozaik** (kolone nejednakih širina + vertikalni stagger) · **bez footera** (strana se završava „Почетна страна" + lotos). Horizontalna traka `HorizontB` napravljena pa izbačena s vrha (čeka World A). Vlasnikov komplet: `HorizontB`/`vertikalnaB`/`pozadinaB` (originali u `_source-assets/`, van deploya).
**SLEDEĆE (vlasnik bira):** World A traka (`HorizontB`) kao razdelnik na pozivnicama · utišati crvenu u vezu (terakota) ako zasmeta · `/prilagodite` u etno · **revamp „Дизајнирајте сами" (konfigurator) — U TOKU** · sitni polish batch (`POLISH.md`) · Faza 4 PDF (čeka hi-res).
_Sesija: `/dodaci` uklopljen u etno svet kao `/pozivnice` (EtnoFrame + infinite scroll). **Konfigurator „Дизајнирајте сами" — vizuelni revamp KRENUO:** filteri levo u uokvirenom svetlijem panelu (sticky) · širi kontejner (`w-full max-w-[1600px]` — rešen bug praznog prostora: flex+`mx-auto` je gušio rastezanje) · veće kartice · izbačen naslov (ostao `sr-only` h1). **Novo: CMS „Тип позивнице" (облик/димензија)** — dokument `invitationType` (kao `category`) + polje `types` na šablonu; „Тип" filter u katalogu sad CMS-vođen (jednострана/двострана ostala samo kao opcija cene, ne filter). Filter se pojavi tek kad postoji bar 1 tip dodeljen šablonu. **Audit „20 vibe-coded tell-ova" → `POLISH.md`.**_
**⚠️ VLASNIK CMS (da sekcije zažive):** Studio → Почетна → „5 · Постаните део приче" → uploaduj **Утисци (slike)** + **Скриншот Instagram профила** (bez toga stoje placeholderi). Puna lista obaveza dole.
**Tehničke zamke:** headless preview NE prikazuje framer/Lenis animacije ni lazy slike (vlasnik potvrđuje na `localhost`) · `.next` keš zna da se zaglavi (stop→`rm -rf .next`→start) · push često padne 1. put (DNS) → retry 2× · **stage-uj KONKRETNE fajlove, NE `git add -A`** (jednom pokupio lične PDF-ove iz `public/`) · originali velikih slika u `public/` se brišu posle optimizacije (drži samo `-tile`/`.jpg`).
Funkcionalnost je kompletna (dole); dira se „poneka usput" → tada pročitaj `docs/SPEC.md`.
_Poslednji commit: `691d1dd` (О нама porodična fotka). Etno overhaul početne gotov; radni direktorijum čist._
_Sesija (28.07) — footer: skraćen ~duplo (sadržaj 247→163px) + vez traka na vrhu (`traka5-tile.png`, vlasnikova ChatGPT traka). `TrakaDivider` dobio `heightClass`. Time je etno overhaul cele početne ZAOKRUŽEN (Hero→footer). Čeka potvrdu + push._
_Sesija (28.07) — „Постаните део приче" nadogradnja: (1) zamena mesta — Утисци levo, telefon desno. (2) Утисци = **skrolabilan** grid slika (2 u redu, uspravne), hover blago uveća, **klik → slika naraste (framer shared-layout) u centar ekrana ~45% + zamagljena pozadina; klik van → smanji nazad**. BEZ galerije/stranice. Novi CMS `utisci` (multi-upload slika, bez opisa) + komponenta `UtisciGrid` (skrol ima `data-lenis-prevent`). (3) telefon prikazuje screenshot IG profila (novi CMS `instagramScreenshot`) i klik vodi na Instagram. **VLASNIK: uploaduj u Studio → Почетна → „5 · Постаните део приче": Утисци (slike) + Скриншот Instagram профила** — bez toga stoje placeholderi. Čeka potvrdu + push._
_Sesija (28.07) — traka4 + „Постаните део приче": (1) razdelnik traka4 (vlasnikova „traka finale") posle „О нама" — bešavni tile, celi krstovi. (2) poslednja sekcija (SocialProof) više nije zelena — dobila suptilan wash vlasnikovog akvarela `pozadina4.jpg` (par ka crkvi) + sav tekst pretonjen u tamno. Detalji u DESIGN.md. Čeka vlasnikovu potvrdu + push. NB: `git add -A` ranije slučajno pokupio lične PDF-ove iz public/ (sklonjeni, u `_public-stray`) — ubuduće stage-ovati konkretne fajlove._
_Sesija (27.07) — traka3 + О нама + КОНТАКТ: (1) razdelnik traka3 (mirror-tile) posle „Зашто баш ми". (2) „О нама" dobila pozadinu `pozadina3.jpg` (laneno platno + vez uz ivice) + etno ton; portret te sekcije se uploaduje u Studio → Почетна страна → „4 · О нама" → Слика. (3) КОНТАКТ sekcija uklonjena sa početne (forma + naslov; dugmad ostaju u footeru) — početna se sad završava na „Постаните део приче". Detalji u DESIGN.md. Čeka vlasnikovu vizuelnu potvrdu + push._
_Sesija (27.07) — Зашто баш ми: sekcija redizajnirana u etno ton (pun-ekran sepija akvarel para pred crkvom kao pozadina, tekst desno/dole na papirus prelivu, 3 razloga kao elegantna lista sa zlatnom linijom). Slika `public/crkva.jpg` (vlasnikova „pozadina druga" 2.5MB → 162KB JPG, preimenovana zbog SEO). Detalji u DESIGN.md. Vlasnik potvrdio izgled; push-ovano (`6d65fa5`). NB: tekst i font ove sekcije se menjaju KASNIJE (sadržaj/font još nedefinisan) — ne dirati sad._
_Sesija (27.07): (1) navbar skrol ojačan (nativni listener + IO). (2) dva vez razdelnika (`TrakaDivider`, prima `src`: `traka-razdelnik-tile` posle Hero-a, `traka2-tile` posle Наше услуге). (3) „guzvani papir" izbačen → pozadina `pozadina.jpg` SAMO na sekciji Наше услуге (laneno platno + ušiveni vez, `bg-size 100% 100%`). (4) sekcija **Наше услуге** (album kartice: iscepane ivice, nakrivljene, rukopis; **hover = kartica izraste u panel preko sve 3 + razbacane slike**, svaka svoj izvor: Позивнице←галерија, Слике←уметност, Детаљи←додаци). (5) galerija premeštena na `/pozivnice`; galerija u CMS-u sad **niz slika (multi-upload)** umesto pojedinačnih dokumenata. (6) **cover slike kartica editabilne u Sanity** (`homePage` → „2б · Наше услуге"). Sve push-ovano (poslednji `ced6e87`+). Vlasnik uneo 8 slika u galeriju. ⚠️ Animacije/pikseli se NE vide kroz preview alat → vlasnik potvrđuje na `localhost:3000`._

**Šta radi (funkcionalno kompletno i push-ovano):**
- Landing (hero, galerija, „zašto baš mi", utisci, kontakt + Viber/WhatsApp/IG pilule).
- Konfigurator fizičke: galerija → izbor teksta (živi editor) → papir/omot/pečat/dodaci → živa cena → checkout → uplata na račun + IPS QR.
- Digitalni tok: dizajn → živi tekst → cena → checkout 100% → evidencija+mejlovi (**PDF ostaje** — čeka hi-res dizajne + fontove + PDF paket).
- Svet B (`/umetnost`) showcase + strana po radu (SEO). Strane `/dodaci`, `/prilagodite`. Custom 404. Vercel Analytics.
- Sve dvojezično (sr+en), SEO baseline, mobilni, order evidencija u Sanity + Google Sheet + mejlovi.

**⚠️ Vlasnikove obaveze (ne aktiviraju se same) → pun spisak `docs/vlasnik-todo.md`:**
pravi podaci banke · Resend nalog (mejlovi) · upali Vercel Analytics · unesi Viber/WhatsApp broj · prava digitalna cena (sad 3000) · obriši test podatke (test-*) · rotiraj Sanity token · žena unosi sadržaj (šabloni hi-res + pečat + svotčevi + strane) · **dodaj „Типове позивница" (облик/димензија) у Studio + додели шаблонима** (без тога је „Тип" филтер сакривен).

**★ SLEDEĆE (vlasnik bira):**
- **Estetika** (glavni fokus sada) — vidi `DESIGN.md`; veliki vizuelni pass sa ženom.
- World B estetika (`data-world="b"` hook postavljen).
- Faza 4 **PDF** — čim stignu hi-res dizajni + fontovi (+ odobriti PDF paket).
- Bulletproof pass · font-library.
- **Ozbiljan SEO — POSLE celog stacka** (sad je samo baseline): meta kampanje preko Claude Code + skilovi koje vlasnik ubaci; + OG share slika, pun hreflang. **Ključne reči + pravila pisanja: `docs/SEO.md`** (vlasnikova analiza: #1 „pozivnice za venčanje", niša „ručno rađene pozivnice za venčanje", + informativne fraze koje traže vodič/blog kog NEMA — najveća neiskorišćena prilika). Otvoreno: ćirilica vs latinica u pretrazi (nemereno), grad za lokalni SEO.
- **Instagram: Claude odgovara mušterijama preko MCP-a** — ZAMENA za raniji „AI FAQ chatbot na sajtu" (odustali). Eksperiment; čeka Anthropic nalog + MCP setup + guardrails (ljudsko odobrenje pre slanja, limiti).
- Pun konsolidovan redosled preostalog: `docs/PLAN.md`.

---

## Ključne info

- **Projekat na disku:** `C:\Users\Tile\kreativna-pozivnica` (pokreni Claude Code IZ ovog foldera → CLAUDE.md se učita sam).
- **GitHub:** https://github.com/tilemagija/kreativna-pozivnica-new · **Vercel:** kreativna-pozivnica-new.vercel.app
- **Sanity:** projectId `oil2tj3x`, dataset `production`, Studio na `/studio`.
- **Stack:** Next.js 16 + TS + Tailwind v4 + App Router + next-intl + Sanity + framer-motion + lenis.
- **Odobreni paketi:** `qrcode` (IPS QR), `@vercel/analytics`.
- **Preview:** `mcp__Claude_Browser__preview_start {name:"kreativna-dev"}` (launch.json u `C:\Users\Tile\.claude`), port 3000. Ako npm/node nisu na PATH-u u shell-u, osveži: `export PATH="$PATH:/c/Program Files/nodejs"`.
- **Test podaci za brisanje pre launcha:** `test-template`/`test-double`/`test-digital`, `test-dodaci-*`, `test-art-*`, placeholder banka, placeholder digitalna cena.
