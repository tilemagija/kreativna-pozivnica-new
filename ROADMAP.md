# ROADMAP — Kreativna Pozivnica

Build kroz leto → **launch januar.** Temeljno, ne beskonačno.
Puna istorija + fazni plan: `docs/ROADMAP-archive.md` · Specifikacija: `docs/SPEC.md` · Izgled: `DESIGN.md`

---

## ▶ TRENUTNO STANJE — čitaj OVO prvo posle /clear

**Faza sada: ESTETIKA/IZGLED** (vlasnikova odluka 21.07 — prelazak sa funkcija na izgled).
Za rad na izgledu → radi iz **`DESIGN.md`** (tokeni + pravac + backlog). Funkcionalnost dolazi „poneka usput"; kad je dira → pročitaj relevantni deo `docs/SPEC.md`.

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
