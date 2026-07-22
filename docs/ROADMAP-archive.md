# ROADMAP ARHIVA — Kreativna Pozivnica

> Istorijski dnevnik (šta je urađeno kad) + originalni fazni plan. NE čita se na startu —
> samo kad zatreba prošlost/kontekst neke odluke. Aktuelno stanje → `ROADMAP.md`.

---

## DNEVNIK URAĐENOG (najnovije prvo)

### 21.07 — analitika, kontakt kanali, custom strana, 404, digitalni tok, SEO h1
- **Vercel Analytics** (`dd60131`) — `<Analytics/>` u root layout, bez cookie banera. ⚠️ vlasnik pali u Vercel dashboard-u.
- **Viber + WhatsApp kanali** (`5082fb1`) — polja u Studiju (Подешавања → WhatsApp/Viber број, format 3816XXXXXXXX) + pilule Instagram·WhatsApp·Viber·мејл u kontakt sekciji + footeru; kanal se preskače dok broj nije unet. `lib/contactChannels.ts`, `components/site/ContactChannels.tsx`.
- **Strana „Прилагодите баш вама"** (`a46522c`) — `/prilagodite` (custom dizajn, savijene, u flašici) = tekst + mozaik + dugme → Instagram (ne Smart Inquiry). CMS: `prilagoditePage` + `prilagoditeItem`. Nav (sr+en), sitemap, poruke. `SectionHeading` dobio `as="h1"`.
- **Custom 404** (`307ec11`) — brendirana dvojezična, unutar `[locale]` layout-a, `[...rest]` catch-all; pravi 404 status.
- **FAZA 4 digitalni tok** (`7405eb1`), BEZ PDF-a — `?tip=digitalna` stub → pun tok: dizajn → živi editor teksta → fiksna cena → checkout 100% → evidencija+mejlovi. CMS: `pricing.digitalPrice`, `order.kind` (physical|digital). `DigitalConfigurator`+`DigitalCheckout` (mejl OBAVEZAN). `/api/order` digitalna grana (rani return, cena sa servera). `email.ts` `digital` flag. PDF čeka hi-res dizajne + fontove + PDF paket.
- **SEO h1** (`bf85d37`) — sve samostalne strane imaju tačno jedan `<h1>`; landing zadržava h2.

### 15.07 — mejl kupcu, Google Sheet, World B, Додаци
- **Mejl potvrde kupcu** (`1d0b2dc`): posle narudžbe kupac dobija mejl (broj + iznos/depozit + podaci za uplatu). `lib/email.ts::sendCustomerOrderEmail` (reply-to = vlasnikov contactEmail; skip ako nema Resend ključa ILI kupac bez mejla).
- **Google Sheet evidencija**: svaka narudžba se upisuje u vlasnikov Sheet (materijali + SUMIF) preko Apps Script webhook-a, bez novog paketa, NON-BLOCKING. `lib/googleSheet.ts::appendOrderToSheet` (env-gated `GOOGLE_SHEET_WEBHOOK_URL` + `GOOGLE_SHEET_SECRET`, 8s timeout). Uputstvo: `docs/google-sheet-setup.md`.
- **World B („Уметност") nadogradnja**: `/umetnost` = galerija sa okvirnom cenom („од X дин") → lightbox u strani (dimenzije/ramovi/cena) + „Проверите доступност" → čist Instagram + „Цела страна →". **Strana po radu `/umetnost/[slug]`** (SEO magnet): jedinstven title/description, canonical, og:image, schema.org CreativeWork + cena „од", generateStaticParams, sitemap. CMS: `artwork` (slug, priceFrom, dimensions, frames, gallery). `components/worldb/ArtGallery.tsx` (client lightbox, a11y). Seed `scripts/seed-artworks.mjs` (test-art-1..3 — obrisati pre launcha). Estetika odložena (`data-world="b"` hook).
- **„Додаци" strana**: `/dodaci` (zahvalnice, pokloni za goste, table, kitke) = tekst + mozaik + „Јавите нам се" → Instagram. CMS: `dodaciPage` + `dodaciItem`. Seed `scripts/seed-dodaci.mjs` (test-dodaci-1..4 — obrisati pre launcha).

### 14.07 — konfigurator, checkout, plaćanje, vizuelni editor
- **Galerija + dvostrane**: „Дизајнирајте сами" → GALERIJA (`/napravite-svoju`) → klik dizajn → konfigurator (`/napravite-svoju/[slug]`). Tabovi Штампане/Дигиталне (kupčev izbor, `?tip=`), sidebar ТИП (Све/Једнострана/Двострана po `doubleSided`) + КАТЕГОРИЈЕ (Венчање/Крштење/Дечије). `templateTextField` izdvojen; `invitationTemplate` dobio slug/categories/doubleSided/backImage/backTextFields; `category` dokument. Dvostrane = +20/kom auto (sa šablona server-strane), 2 preview-a. Seed `scripts/seed-gallery.mjs` (test-double/test-digital — obrisati pre launcha).
- **Korak 4 (kontrole + živa cena)**: `lib/configuratorPricing.ts` (čist price-calc, klijent+server), `OptionControls.tsx` (količina, papir svotčevi, omot bez/paus/koverat→koverta, dodaci torn/gold/rounded, pečat 4 tipa + motiv/boja), `PriceSummary.tsx`. **INFRA BUG:** `paperOption/envelopeOption/sealMotif/sealColor` NISU u javnom read grant-u → konfigurator čita opcije SERVERSKI (`getConfiguratorOptionsServer` preko `writeClient`).
- **Korak 6+7 (checkout)**: `Checkout.tsx` (3 koraka: preview → forma ime/telefon/mejl/adresa/datum → uspeh; Escape/backdrop; a11y `role=dialog`+fokus). `/api/order`: rate-limit `order:ip` 5/min, honeypot, validacija+sanitizacija, **cena RECOMPUTED na serveru** iz Sanity, snima `order` (pending_payment), `sendOrderEmail` vlasniku.
- **Faza 5 — plaćanje (uplata na račun)**: checkout → order (pending_payment) + `orderNumber` (poziv na broj, `lib/payment.ts::generateOrderNumber`, 16 cifara) → success ekran s računom/iznosom(depozit 50%)/pozivom na broj/svrhom. siteSettings fieldset „Уплата на рачун" (bankRecipient/Account/Name/Model[00]/PaymentCode[289]/Purpose — PLACEHOLDER „160-0000000123456-78" Banca Intesa, ZAMENITI). **IPS QR** (`lib/payment.ts::buildIpsQrString`, NBS format) render-ovan preko paketa `qrcode` (odobren).
- **Vizuelni editor polja** (`/template-tool`): izbor šablona → PREVLAČENJE polja po slici (xPct/yPct) → panel (font/veličina/širina/boja/poravnanje/multiline/dodaj-obriši) → „Сачувајте". `FieldPlacementCanvas.tsx`, `TemplateFieldEditor.tsx`, `/api/template-fields` (GUARDED: dev otvoren, PROD traži `TEMPLATE_TOOL_KEY` u `x-admin-key`). Zadnja strana: prekidač Предња/Задња za doubleSided. Middleware isključuje `/template-tool` (kao `/studio`).
- **Bulletproof (u toku)**: količina — polje se može obrisati pri kucanju (lokalni buffer, snap na blur ≥1); checkout a11y (fokus u ime, vraćanje fokusa).

### Ranije (Faza 0–2, landing, konfigurator temelji)
- **Faza 0**: skela (Next 16 + TS + Tailwind), i18n (sr ćirilica na `/`, en na `/en`), brend u kod (tokeni + Cormorant/Lora/Marck), Sanity (Studio na /studio, CORS + Vercel env), kostur (semantic nav/main/footer + Reveal/SmoothScroll).
- **Faza 1**: intro „otvaranje" overlay (video, SSR ispod), landing sekcije iz Sanity (Hero/carousel, Galerija/mozaik, Zašto baš mi, O nama, Postanite deo priče/brojač, Kontakt), Smart Inquiry v1 (forma→Sanity+email), security na formu (rate-limit 5/min/IP, validacija, honeypot, token server-only), SEO baseline (sitemap/robots/OG/hreflang).
- **Faza 2**: `/umetnost` showcase + `InquiryDialog` popup + generateMetadata SEO.
- **/nastanak** (spojen Proces+Radionica, YouTube), **/akcija** (CMS akcije, %, auto-expiry).
- **Cenovnik u Sanity**: `paperOption`/`envelopeOption` liste + `pricing` singleton (seed iz `docs/cenovnik.md`).
- **Konfigurator Korak 1–3**: CMS (`invitationTemplate`+`templateTextField`, `sealMotif`, `sealColor`, `order`), font paleta `templateFonts.ts`, test šablon, živi preview + izmena teksta. **PIVOT:** inline `contentEditable` je bio KRHAK (tekst se resetovao) → prešli na tekst KONTROLISAN iz React state-a (jedan izvor istine), izmena kroz panel „Уредите текст", klik na tekst fokusira polje. Fajlovi: `TemplatePreview.tsx`, `TextEditPanel.tsx`, `Configurator.tsx`.

---

## FONT STRATEGIJA (pivot 14.07, detalji)

Fiksna 8-paleta NIJE dovoljna: vlasnik koristi 100+ fontova, 4/pozivnici, neki bez ćirilice (ručno sklapa Љ), neki ručno crtani. **REŠENJE = princip:** pozadinska SLIKA nosi svu umetnost (ukrasi, ručno crtana slova, fiksni tekst); sajt živim tekstom ispisuje SAMO editabilna polja. Zato ne treba 100+ fontova — samo fontovi editabilnih polja za ~20–30 kuriranih šablona (ostatak = „na upit"). Fontovi: (a) Google Fonts, (b) vlasnikovi custom fajlovi (⚠️ treba fajl + licenca za web/PDF; Canva često ne da fajl). Ideja za ručne stilove: Calligraphr (rukopis→.ttf). **TODO (uz font podršku):** `fontOption` CMS dokument (naziv + opcioni upload + family/source), `fontKey` referenca (zameniti fiksni `templateFonts.ts` 8-set).

## PDF ZA ŠTAMPU (vlasnikov ključni zahtev)

Kad kupac plati, vlasnik dobija PDF tačno te pozivnice za štampu. Izvodljivo jer je raspored deterministički (% pozicije + fontovi) → render iste slike+teksta u HIGH-RES PDF. **= deo Faze 4.** ⚠️ ZAVISNOST: vlasnik kači ŠABLONE U VISOKOJ REZOLUCIJI (Canva ~300dpi), NE web-sličice; fontovi editabilnih polja se embeduju. Trenutni test-šablon je placeholder (500px) — samo za demo.

## AI FAQ CHATBOT (odobreno za kasnije, pun spec)

Chat prozorčić koji odgovara iz vlasnikovog FAQ-a (rok, proces, okvirne cene). Služi glavnom cilju (manje DM-ova ženi). **Kako:** `/api/chat` → Claude API (HTTP, bez teškog paketa) + FAQ u Sanity + chat UI. Model: Haiku. **BEZBEDNOST:** (1) strog rate-limit po IP, (2) max dužina/broj poruka, (3) mesečni budžet-plafon na Anthropic nalogu, (4) odgovara SAMO iz FAQ-a → kad ne zna „pitajte na Instagramu", (5) bot samo ispisuje tekst. **VLASNIK MORA:** (a) Anthropic API nalog (platform.claude.com + ključ + kredit — NIJE claude.ai Pro), (b) FAQ sadržaj. claude.ai Pro/Max je LIČNA pretplata (ne daje API ključ za javni sajt); sajtu treba Claude API (developer, pay-as-you-go).

---

## ORIGINALNI FAZNI PLAN

### PHASE 0 — TEMELJI 🟢 ✅ KOMPLETNA
Prazan, tematizovan, dvojezičan shell. Batches: 0.1 scaffold, 0.2 i18n, 0.3 Sanity, 0.4 layout shell, 0.5 brand tokeni.

### PHASE 1 — LANDING + POVERENJE 🟢 ✅
Single-scroll landing + prva „vrata" (kontakt forma). Batches: 1.0 intro overlay, 1.1 landing sekcije, 1.2 galerija, 1.3 Smart Inquiry, 1.4 security, 1.5 „nastanak", 1.6 SEO baseline.

### PHASE 2 — SVET B (showcase) 🟢 ✅
Magnet organskog dometa. Showcase → upit. Batches: 2.1 galerija, 2.2 upit po stavci, 2.3 SEO.

### PHASE 3 — KONFIGURATOR: Fizička 🟡 ✅
Vođeni builder sa živom cenom. Batches: 3.1 koraci, 3.2 swatch vizuali, 3.3 živa cena, 3.4 upsell (urađeno kao „нешто посебно → Instagram"), 3.5 order snapshot.

### PHASE 4 — KONFIGURATOR: Digitalna + PDF 🟡 (tok GOTOV, PDF ostaje)
Live text editor + personalizovan PDF. Batches: 4.1 model + editor ✅, 4.2 PDF generisanje (ostaje — čeka hi-res + fontove + paket), 4.3 evidencija ✅.

### PHASE 5 — PLAĆANJE 🟡 ✅ (uplata na račun)
Batches: 5.1 odluka (uplata na račun, ne gateway), 5.2 digital 100%, 5.3 fizička 50% depozit, 5.4 security pass, 5.5 mejlovi.

### PHASE 6 — POLIRANJE + PRED-LANSIRANJE 🟢 (predstoji, pred januar)
Batches: 6.1 motion polish, 6.2 SEO + Core Web Vitals + mobilni, 6.3 pred-launch čeklista (nema placeholder/test, sve iz CMS-a, oba jezika), 6.4 pun bezbednosni pregled svih „vrata". Feature-freeze.

---

## INTERNI CHECKPOINT-I

| CP | Rok | Faze |
|---|---|---|
| CP1 | kraj 1. meseca | Faza 0 + 1 |
| CP2 | sred leta | Faza 2 + 3 |
| CP3 | kasno leto | Faza 4 |
| CP4 | jesen | Faza 5 |
| CP5 | pred januar | Faza 6 |
| LAUNCH | januar | slava linija |

## OTVORENE ODLUKE (istorijski)

0. **Nav = SAMO linkovi ka posebnim stranama** (rešeno). Nav: Акција · Настанак · Уметност · Додаци · Прилагодите · Дизајнирајте сами.
1. **Payment gateway** → rešeno: uplata na račun.
2. **Smart Inquiry vs Instagram** → za jedinstvene komade izabran čist Instagram.
3. **Final brand tokeni** → starter iz loga; redizajn sa ženom u estetskoj fazi (vidi `DESIGN.md`).
