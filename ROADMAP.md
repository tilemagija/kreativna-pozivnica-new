# ROADMAP — Kreativna Pozivnica

Build kroz leto → **launch januar.** Temeljno, ne beskonačno.
Puna istorija + fazni plan: `docs/ROADMAP-archive.md` · Specifikacija: `docs/SPEC.md` · Izgled: `DESIGN.md`

---

## ▶ TRENUTNO STANJE — čitaj OVO prvo posle /clear

**Faza sada: KOMPLETAN ETNO-VINTAGE OVERHAUL IZGLEDA** (vlasnikov mokap = master dizajn).
→ **Sav rad na izgledu vodi `DESIGN.md`** — tamo je „TRENUTNO STANJE ESTETIKE" sa: paletom (papirus + zelena `#204022` + zlato), šta je urađeno (Hero+Ink Bleed, navbar+vez, dva vez razdelnika, sekcija **Наше услуге** sa hover-om), **SLEDEĆE sekcije: „Узори који остају" (mozaik) → footer → pa etno ton na starim sekcijama** (Зашто баш ми / О нама / утисци / контакт), asseti koje vlasnik dostavlja, i tehničkim zamkama (`.next` keš, snimci/animacije ne rade u alatu — headless tab). **Pročitaj DESIGN.md pre bilo kakvog rada na izgledu.**
Funkcionalnost je kompletna (dole); dira se „poneka usput" → tada pročitaj `docs/SPEC.md`.
_Zadnja sesija (26.07): Hero = vlasnikova slika + ink-bleed reveal; navbar redizajniran (bez loga, centrirani linkovi, transparentan→cream+vez na skrol); commit `4cc2e93` push-ovan._
_Sesija (27.07) — Зашто баш ми: sekcija redizajnirana u etno ton (pun-ekran sepija akvarel para pred crkvom kao pozadina, tekst desno/dole na papirus prelivu, 3 razloga kao elegantna lista sa zlatnom linijom). Slika `public/crkva.jpg` (vlasnikova „pozadina druga" 2.5MB → 162KB JPG, preimenovana zbog SEO). Detalji u DESIGN.md. Čeka commit + vlasnikova vizuelna potvrda na localhost._
_Sesija (27.07): (1) navbar skrol ojačan (nativni listener + IO). (2) dva vez razdelnika (`TrakaDivider`, prima `src`: `traka-razdelnik-tile` posle Hero-a, `traka2-tile` posle Наше услуге). (3) „guzvani papir" izbačen → pozadina `pozadina.jpg` SAMO na sekciji Наше услуге (laneno platno + ušiveni vez, `bg-size 100% 100%`). (4) sekcija **Наше услуге** (album kartice: iscepane ivice, nakrivljene, rukopis; **hover = kartica izraste u panel preko sve 3 + razbacane slike**, svaka svoj izvor: Позивнице←галерија, Слике←уметност, Детаљи←додаци). (5) galerija premeštena na `/pozivnice`; galerija u CMS-u sad **niz slika (multi-upload)** umesto pojedinačnih dokumenata. (6) **cover slike kartica editabilne u Sanity** (`homePage` → „2б · Наше услуге"). Sve push-ovano (poslednji `ced6e87`+). Vlasnik uneo 8 slika u galeriju. ⚠️ Animacije/pikseli se NE vide kroz preview alat → vlasnik potvrđuje na `localhost:3000`._

**Šta radi (funkcionalno kompletno i push-ovano):**
- Landing (hero, galerija, „zašto baš mi", utisci, kontakt + Viber/WhatsApp/IG pilule).
- Konfigurator fizičke: galerija → izbor teksta (živi editor) → papir/omot/pečat/dodaci → živa cena → checkout → uplata na račun + IPS QR.
- Digitalni tok: dizajn → živi tekst → cena → checkout 100% → evidencija+mejlovi (**PDF ostaje** — čeka hi-res dizajne + fontove + PDF paket).
- Svet B (`/umetnost`) showcase + strana po radu (SEO). Strane `/dodaci`, `/prilagodite`. Custom 404. Vercel Analytics.
- Sve dvojezično (sr+en), SEO baseline, mobilni, order evidencija u Sanity + Google Sheet + mejlovi.

**⚠️ Vlasnikove obaveze (ne aktiviraju se same) → pun spisak `docs/vlasnik-todo.md`:**
pravi podaci banke · Resend nalog (mejlovi) · upali Vercel Analytics · unesi Viber/WhatsApp broj · prava digitalna cena (sad 3000) · obriši test podatke (test-*) · rotiraj Sanity token · žena unosi sadržaj (šabloni hi-res + pečat + svotčevi + strane).

**★ SLEDEĆE (vlasnik bira):**
- **Estetika** (glavni fokus sada) — vidi `DESIGN.md`; veliki vizuelni pass sa ženom.
- World B estetika (`data-world="b"` hook postavljen).
- Faza 4 **PDF** — čim stignu hi-res dizajni + fontovi (+ odobriti PDF paket).
- Bulletproof pass · AI FAQ chatbot (čeka FAQ + Anthropic nalog) · font-library.

---

## Ključne info

- **Projekat na disku:** `C:\Users\Tile\kreativna-pozivnica` (pokreni Claude Code IZ ovog foldera → CLAUDE.md se učita sam).
- **GitHub:** https://github.com/tilemagija/kreativna-pozivnica-new · **Vercel:** kreativna-pozivnica-new.vercel.app
- **Sanity:** projectId `oil2tj3x`, dataset `production`, Studio na `/studio`.
- **Stack:** Next.js 16 + TS + Tailwind v4 + App Router + next-intl + Sanity + framer-motion + lenis.
- **Odobreni paketi:** `qrcode` (IPS QR), `@vercel/analytics`.
- **Preview:** `mcp__Claude_Browser__preview_start {name:"kreativna-dev"}` (launch.json u `C:\Users\Tile\.claude`), port 3000. Ako npm/node nisu na PATH-u u shell-u, osveži: `export PATH="$PATH:/c/Program Files/nodejs"`.
- **Test podaci za brisanje pre launcha:** `test-template`/`test-double`/`test-digital`, `test-dodaci-*`, `test-art-*`, placeholder banka, placeholder digitalna cena.
