# ROADMAP — Kreativna Pozivnica

Build through summer → **launch in January.** Thorough, not endless. Each phase has a clear
**"NE radimo (yet)"** and **"Gotovo kad..."** so no session drifts into scope creep.

Legend: 🟢 known territory (done it in Budva) · 🟡 new territory (extra care + plain explanations)

---

## ▶ TRENUTNO STANJE — pročitaj OVO prvo posle /clear

**Gde smo:** ✅ FAZA 0. ✅ 1.0 intro (video). ✅ 1.1 + 1.2 KOSTUR LANDINGA KOMPLETAN — sve sekcije rade iz Sanity (Hero/carousel, Galerija/mozaik, Zašto baš mi, O nama, Postanite deo priče/brojač+paketi-ilustracija, Kontakt) + nav (fiksni, Akcija festive). ✅ 1.3 Smart Inquiry (forma → Sanity + email preko Resend — CEO ceo lanac verifikovan uživo). ✅ FAZA 2 (Svet B): /umetnost showcase + Smart Inquiry popup (InquiryDialog) + SEO metadata. Sledeće: preostale nav strane — **/proces (Kako se pravi, YouTube = 1.5)**, **/akcija**, **/radionica** (+ potvrditi da li Akcija/Radionica uopšte postoje), pa **1.6 SEO baseline** (sitemap/robots/OG), pa **Faza 3 (konfigurator /napravite-svoju)** — velika. Žena puni sadržaj kroz Studio (sad i „Уметност и поклони (радови)" + „Страница: Уметност и поклони").
**Env/setup:** SANITY_API_WRITE_TOKEN postavljen (Vercel Production + .env.local) — ⚠️ rotirati (bio u chatu). RESEND: napraviti nalog + RESEND_API_KEY (Vercel + .env.local); primalac mejla = „Мејл за упите" u Sanity Podešavanjima. Email „from" u test modu (onboarding@resend.dev) šalje samo na tvoj Resend nalog dok ne verifikuješ domen.
**Projekat na disku:** `C:\Users\Tile\kreativna-pozivnica` (pokreni Claude Code IZ ovog foldera → CLAUDE.md se učita sam).
**GitHub:** https://github.com/tilemagija/kreativna-pozivnica-new · **Vercel:** kreativna-pozivnica-new.vercel.app
**Sanity:** projectId `oil2tj3x`, dataset `production`. Studio na `/studio`. CORS: localhost:3000 + vercel domen dodati. Vercel env vars (3x NEXT_PUBLIC_SANITY_*) postavljeni.
**Okruženje:** Node v24.18.0, npm 11.16.0, git 2.55 — sve instalirano i radi.
**Stack stvarno:** Next.js 16 + TS + Tailwind v4 + App Router + src/ + next-intl + brend + Sanity + framer-motion + lenis. Kostur: Header/nav + main + Footer, `Reveal` (motion pattern), `SmoothScroll` (oba poštuju reduced-motion).
**Sledeća akcija:** 1.1 korak 2 — render sekcija iz Sanity: (a) galerija-mozaik iz `galleryItem`; (b) „zašto baš mi" iz `homePage.whyReasons`; (c) DRUŠTVENI DOKAZ „Postanite deo priče": brojač raste do `counterTarget`+`counterSuffix` za 2-3s (reduced-motion → odmah), UPOREDO „padaju" paketi (vlasnik šalje skicu paketa — ČEKA SE), telefon sa IG mrežom (`instagramImages`), „Utisci" iz `testimonial`; (d) kontakt sekcija (forma tek u 1.3). Niša rečenica ispod brojača: preporuka „2.000+ porodica u našoj priči" (uredivo u Sanity `counterLabel`).

**Sanity model (gotov, 1.1 k1):** `localeString`/`localeText` (dvojezično sr+en), singletoni `siteSettings` + `homePage` (fieldsetovi po sekcijama), liste `galleryItem` + `testimonial`. Studio desk: `src/sanity/structure.ts`. Čitanje: `src/sanity/queries.ts` + `pick()` iz `src/sanity/locale.ts`. Hero: `src/components/sections/Hero.tsx` + `HeroCarousel.tsx` (next/image cross-fade). Slike sa `cdn.sanity.io` (next.config).
**Intro (1.0):** `src/components/intro/IntroOverlay.tsx` — koristi VLASNIKOV RENDEROVANI VIDEO `public/intro/otvaranje.mp4` (otvaranje koverte: pečat se podiže + flap se otvara + bloom → hero). Klik za puštanje, jednom po sesiji, SSR hero ispod (SEO), reduced-motion/Escape/Preskoči. ⏳ TODO: zameniti WhatsApp verziju (299KB) HQ izvozom kad vlasnik pošalje.
**Placeholder linkovi (znati):** nav vodi na /napravite-svoju, /kako-se-pravi, /umetnost, /kontakt — te strane još NE postoje (404 dok ih ne napravimo po fazama).
**Napomena za dev/preview:** `node`/`npm` NISU na PATH-u u tool-shell-ovima; osveži PATH pre npm komandi:
`$env:Path=[Environment]::GetEnvironmentVariable("Path","Machine")+";"+[Environment]::GetEnvironmentVariable("Path","User")`. Preview MCP alat ne radi (pokreće iz home, ne iz projekta) — verifikuj preko background `npm run dev` + Invoke-WebRequest.

### Napredak (Faza 0)
- [x] 0.1 Skela (Next.js 16 + TS + Tailwind) — commit, push, deploy ✅
- [x] 0.2 Dva jezika (next-intl: sr=ćirilica na `/`, en na `/en`) — verifikovano uživo ✅
- [x] 0.3 Brend u kod (§11 tokeni + Cormorant/Lora/Marck, ćirilica) — verifikovano ✅
- [x] 0.4 Sanity povezan (Studio na /studio, prazne šeme, CORS + Vercel env) ✅
- [x] 0.5 Kostur strane (semantic nav/main/footer + Reveal/SmoothScroll motion) — verifikovano ✅

**▶ FAZA 0 (TEMELJI) KOMPLETNA.**

### Napredak (Faza 1)
- [x] 1.0 Intro „otvaranje" overlay → hero reveal (§12) — build prošao, SSR-ispod verifikovan ✅
- [x] 1.1 Landing sekcije iz Sanity — SVE sekcije rade (Hero, Galerija, Zašto baš mi, O nama, Postanite deo priče, Kontakt) ✅
- [x] 1.2 Galerija-mozaik iz Sanity (CSS columns, placeholder dok prazno) ✅
- [x] 1.3 Smart Inquiry v1 — forma čuva u Sanity (token postavljen), email preko Resend (čeka RESEND_API_KEY) ✅
- [x] 1.4 Security na formu: rate-limit 5/min/IP, validacija+sanitizacija, honeypot, token samo na serveru — verifikovano ✅ (kasnije: shared rate-limit store + verifikovan domen za mejl)
- [ ] 1.2 Galerija iz Sanity
- [ ] 1.3 Smart Inquiry v1 (Sanity + email) 🟡
- [ ] 1.4 Security pass na formu (rate limit + validacija + sanitizacija + honeypot) 🟡
- [ ] 1.5 „Kako se pravi" (YouTube embeds)
- [ ] 1.6 SEO baseline (metadata iz Sanity, heading hijerarhija, hreflang)

> Posle /clear: otvori Claude Code u folderu projekta i reci „pročitaj ROADMAP.md, nastavljamo".

---

## PHASE 0 — TEMELJI (Foundation)  🟢
Set up the empty, themed, bilingual shell — the ground everything stands on.

**Batches:**
- 0.1 Project scaffold: Next.js + TS + Tailwind + tokens, deploy to Vercel.
- 0.2 i18n (next-intl): sr-Cyrl default + en, language switch.
- 0.3 Sanity connected + Studio reachable; empty schemas skeleton.
- 0.4 Layout shell: semantic `<nav>/<main>/<footer>`, the one motion pattern, mobile-first.
- 0.5 Brand session → lock design tokens (colors/fonts from real brand photos).

**NE radimo:** any product, any payment, any real content.
**Gotovo kad:** an empty, on-brand site deploys to Vercel in BOTH languages, Sanity Studio opens.

---

## PHASE 1 — LANDING + POVERENJE (Content & trust)  🟢 (+🟡 first form)
The single-scroll landing + the first real "door" (contact form).

**Batches:**
- 1.0 Intro „otvaranje" overlay → hero reveal (on-brand cover: gold lotus + „kliknite"). Content SSR underneath (SEO), reduced-motion fallback. See CLAUDE.md §12.
- 1.1 Landing sections from Sanity: hero → gallery → "zašto baš mi" → **testimonijali / društveni dokaz** → kontakt. Direction: **toplo-bogato, editorial/asimetrično, anti-template** — vidi CLAUDE.md §11a. Testimonijali: Sanity-editable; pozicija/izgled po vlasnikovoj zamisli.
- 1.2 Gallery driven by Sanity (the moat — real custom invitations).
- 1.3 **Smart Inquiry v1** (the reusable component): saves to Sanity + emails owner. 🟡
- 1.4 Security pass on the form: rate limit + validation + sanitize + honeypot. 🟡
- 1.5 "Kako se pravi" page with YouTube embeds.
- 1.6 SEO baseline: metadata from Sanity, heading hierarchy, hreflang.

**NE radimo:** configurator, payment, World B.
**Gotovo kad:** a visitor can learn about you, browse the gallery, and send an inquiry that lands
in Sanity + email — in both languages, and the form is guarded.

---

## PHASE 2 — SVET B: Umetnost & pokloni (Showcase)  🟢
The organic-reach magnet. Showcase → Smart Inquiry. (Aligns with the January slava launch.)

**Batches:**
- 2.1 World B section/tab: illustrations, slava gifts, frames — showcase gallery from Sanity.
- 2.2 Smart Inquiry on each item ("zanima me TA slika" + image, saved + emailed). Reuses Phase 1.3.
- 2.3 Strong SEO for World B (this is where organic traffic lands).

**NE radimo:** online buying of World B items, prices on World B.
**Gotovo kad:** World B is browsable and every item triggers a product-specific saved inquiry.

**✅ FAZA 2 GOTOVA:** `/umetnost` (artwork lista + artPage singleton iz Sanity), `InquiryDialog` popup po stavci (reuse SmartInquiry), `generateMetadata` SEO. Preostaje: kad žena unese radove — proveriti izgled.

---

## PHASE 3 — KONFIGURATOR: Fizička pozivnica (no payment yet)  🟡
The guided physical-invitation builder with live price. Payment gets wired in Phase 5.

**Batches:**
- 3.1 Configurator steps: model → paper → wrapper (koverta/paus/bez) → seal (bez/otisak+boja) → gold leaf → torn edges.
- 3.2 Option visuals: hover popups / dropdowns with swatch images (heavy one-time asset setup, easy after).
- 3.3 **Live price** from Sanity pricing config (translated from the Excel). 🟡
- 3.4 Upsell popup at the end → Smart Inquiry for extras (manual discount by business).
- 3.5 Order summary captured (ends in "pending payment" — real charge added in Phase 5).

**NE radimo:** charging money yet, automatic discounts, text-position/font editing.
**Gotovo kad:** a customer builds a physical invitation and sees the correct live price; config is captured.

---

## PHASE 4 — KONFIGURATOR: Digitalna pozivnica + PDF  🟡
Live text editor + personalized PDF.

**Batches:**
- 4.1 Model pick + live text editor (text only; font/position fixed) → live preview.
- 4.2 PDF generation from template + customer text (test mode). 🟡
- 4.3 Evidence record in Sanity (not an "active order").

**NE radimo:** charging money yet (Phase 5), design freedom beyond text.
**Gotovo kad:** a customer personalizes a digital invite, previews it, and a correct PDF is generated (test).

---

## PHASE 5 — PLAĆANJE (Payment)  🟡🟡  — biggest new-territory phase
Wire real money in, securely, for both flows.

**Batches:**
- 5.1 **Decision + setup: Serbian payment gateway** (WSPay / Monri / AllSecure / bank) — needs your merchant account.
- 5.2 Digital: pay 100% → on success email the PDF + save evidence.
- 5.3 Physical: pay 50% deposit → save order + email; remainder is cash-on-delivery.
- 5.4 Security hard pass: rate limit, server-side secrets, **recompute price on server**, verify webhook. 🟡
- 5.5 Customer + owner emails (confirmation, PDF delivery).

**NE radimo:** mixing digital + physical in one payment; subscriptions.
**Gotovo kad:** a real test transaction completes end-to-end for BOTH digital and physical,
with evidence saved + emails sent + every payment door guarded.

---

## PHASE 6 — POLIRANJE + PRED-LANSIRANJE (Polish & pre-launch)  🟢
Only now — per CLAUDE.md, polish comes after functionality is solid.

**Batches:**
- 6.1 Motion/interaction polish (the one pattern, refined).
- 6.2 SEO tightening + Core Web Vitals + full mobile pass.
- 6.3 **Pre-launch checklist:** no placeholder/fake functionality; all content from CMS; both languages complete.
- 6.4 Full security review over every door (Phase 1–5 inputs).

**NE radimo:** new features. Feature-freeze — polish + verify only.
**Gotovo kad:** the pre-launch checklist passes and the site is ready, held for the January launch.

---

## INTERNAL CHECKPOINTS (so "far deadline" ≠ "no deadline")
Rough guide across the summer→January runway (adjust as we go):

| Checkpoint | Target | Phases |
|---|---|---|
| CP1 | end of first build month | Phase 0 + 1 (shell + landing + inquiry) |
| CP2 | mid-summer | Phase 2 + 3 (World B + physical configurator) |
| CP3 | late summer | Phase 4 (digital + PDF) |
| CP4 | autumn | Phase 5 (payment) — the hard one |
| CP5 | pre-January | Phase 6 (polish, security review, pre-launch checklist) |
| LAUNCH | January | slava line goes live |

---

## OPEN DECISIONS (flagged, not blocking)
0. **Nav = SAMO linkovi ka posebnim stranicama** (vlasnikovo pravilo). Nav: Акција · Процес · Радионица · Уметност и поклони · Дизајнирајте сами. Landing scroll-sekcije (О нама, Галерија, Контакт, друштвени доказ) NISU u navu — grade se kao sekcije na landingu (CMS). Rute za napraviti (trenutno 404): /akcija, /proces, /radionica, /umetnost, /napravite-svoju.

1. **Payment gateway choice** (Phase 5.1) — you'll confirm your bank/merchant setup.
2. **Smart Inquiry vs pure Instagram DM** — recommendation is Smart Inquiry (saves the lead, as you asked). Veto if you disagree.
3. **Final brand tokens** (Phase 0.5) — colors/fonts from your photos.
