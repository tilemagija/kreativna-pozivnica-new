# ROADMAP — Kreativna Pozivnica

Build through summer → **launch in January.** Thorough, not endless. Each phase has a clear
**"NE radimo (yet)"** and **"Gotovo kad..."** so no session drifts into scope creep.

Legend: 🟢 known territory (done it in Budva) · 🟡 new territory (extra care + plain explanations)

---

## ▶ TRENUTNO STANJE — pročitaj OVO prvo posle /clear

### ▶ SESIJA 21.07 — čitaj OVO prvo
**Urađene 3 stvari (sve verifikovano uživo, build 28/28, 3 commita, NIJE push-ovano — čeka vlasnikovu reč):**
1. **Vercel Analytics** (commit `dd60131`) — `<Analytics/>` u root layout, bez cookie banera. ⚠️ **VLASNIK MORA:** upaliti Web Analytics u Vercel dashboard-u (Project → Analytics) da podaci krenu. Paket `@vercel/analytics` (odobren).
2. **Viber + WhatsApp kanali** (commit `5082fb1`) — polja u Studiju (Подешавања → WhatsApp/Viber број, međ. format bez + npr. 3816XXXXXXXX) + pilule Instagram·WhatsApp·Viber·мејл u kontakt sekciji + footeru. Kanal se PRESKAČE dok broj nije unet (sad se vide samo Instagram, jer brojevi prazni). `lib/contactChannels.ts` (wa.me / viber://), `components/site/ContactChannels.tsx`. ⚠️ **VLASNIK:** uneti WhatsApp/Viber broj u Studiju da se dugmad pojave.
3. **Strana „Прилагодите баш вама"** (commit `a46522c`) — nova nav strana `/prilagodite` (custom dizajn, savijene pozivnice, pozivnica u flašici) = tekst + mozaik + dugme → **Instagram** (vlasnikova odluka, kao World B; NE Smart Inquiry). CMS: `prilagoditePage` (singleton) + `prilagoditeItem` (lista) u Studiju. Radi s fallback tekstom dok vlasnik ne unese sadržaj. Dodato u nav (sr+en), sitemap, poruke. SEO: `SectionHeading` dobio `as="h1"` → ova strana ima pravi jedan `<h1>` (§13). ⚠️ **VLASNIK/ŽENA:** uneti primere + tekst u Studiju („Страница: Прилагодите баш вама" / „Прилагодите (примери)").
**⚠️ SITAN SEO NALAZ (nije blokada):** postojeće showcase strane `/dodaci` i `/umetnost` (index) koriste `h2` bez `h1` — isti obrazac popravljen samo na novoj strani; audit ostalih ide u Fazu 6 SEO ili brzi follow-up (task chip postavljen).
**NAPOMENA:** `components/InquiryDialog.tsx` sad definitivno neupotrebljen (i custom vitrine idu na Instagram, ne Smart Inquiry) — kandidat za brisanje.

### ▶ NASTAVAK (kraj sesije 15.07)
**Gde smo stali:** upravo završen **mejl potvrde kupcu** (commit `1d0b2dc`, push-ovan). Sesija je bila: Google Sheet evidencija → „Додаци" strana → World B nadogradnja → funkcionalni review → AI FAQ chatbot (odobren za kasnije) → mejl kupcu.
**⏳ OTVORENO (pitati vlasnika na početku):**
- (1) Odobrenje **teksta mejla kupcu** (vlasnik gледао, da potvrdi/tweak-uje reč-dve).
- (2) Odluka: **mejl obavezan u checkoutu?** (sad telefon ILI mejl; preporuka = ostaviti opciono).
**★ SLEDEĆE (vlasnik bira) — sve spремно, ništa ne blokira osim gde piše „čeka":**
- **World B estetika** (redizajn izgleda, po mogućstvu sa ženom; `data-world="b"` hook postavljen)
- ✅ ~~(B) „Прилагодите баш вама" + posebne vitrine → upit~~ **GOTOVO 21.07** (→ Instagram, ne Smart Inquiry)
- ✅ ~~Analitika~~ **GOTOVO 21.07** (Vercel Analytics; ⚠️ vlasnik pali u Vercel dashboard-u)
- ✅ ~~Kontakt kanali (Viber/WhatsApp)~~ **GOTOVO 21.07** (⚠️ vlasnik unosi brojeve u Studiju)
- **Custom 404** — sitno
- **(A) Faza 4 digitalna+PDF** — čeka vlasnikove hi-res dizajne + fontove
- **AI FAQ chatbot** — čeka FAQ sadržaj + Anthropic API nalog (spec u parkiranom bloku)
- nastavak bulletproof-a · font-library
**Vlasnik TODO pre launcha:** `docs/vlasnik-todo.md` (banka, Resend [pokreće OBA mejla], brisanje test podataka test-*, rotacija tokena).

### ★★ NAJSVEŽIJE (15.07) — čitaj prvo, detalji u blokovima ispod
**+ MEJL POTVRDE KUPCU GOTOV (15.07):** posle narudžbe kupac dobija automatski mejl (broj narudžbe + iznos/depozit + PUNI podaci za uplatu na račun/poziv na broj) da ima pisani trag i posle zatvaranja ekrana. `lib/email.ts::sendCustomerOrderEmail` (šalje na `customer.email`, reply-to = vlasnikov contactEmail; skip ako nema Resend ključa ILI kupac nije ostavio mejl — checkout dozvoljava samo-telefon). `/api/order` hoistovao `payment` blok (jedan izvor za ekran + mejl), poziva non-blocking posle mejla vlasniku. Verifikovano: typecheck + build; **živi test mejla čeka Resend nalog.** ⚠️ Opciono: ako želiš da SVAKI kupac dobije mejl → mejl u checkoutu učiniti obaveznim (sad je telefon ILI mejl).

**+ GOOGLE SHEET EVIDENCIJA GOTOVA (15.07):** svaka narudžba se automatski upisuje u vlasnikov Google Sheet (materijali po narudžbi + SUMIF za nabavku) preko Apps Script webhook-a, bez novog paketa; NON-BLOCKING (ne ruši checkout). ⚠️ vlasnik podešava Sheet po `docs/google-sheet-setup.md` (opciono, nije launch blocker) — detalji u ✅ bloku niže.

**+ WORLD B („УМЕТНОСТ") NADOGRADNJA GOTOVA (15.07), VERIFIKOVANO uživo:** `/umetnost` sad = galerija sa **okvirnom cenom** ispod slike („од X дин") → klik → **lightbox u strani** (NE novi prozor) sa opisom/dimenzijama/ramovima/cenom + dugme **„Проверите доступност" → čist Instagram** (vlasnikova odluka — svesno odstupanje od Smart Inquiry §16 za jedinstvene komade) + link „Цела страна →". **Strana po radu `/umetnost/[slug]`** (SEO magnet §13): jedinstven title/description, canonical, og:image, **schema.org CreativeWork + cena „од" (AggregateOffer.lowPrice RSD)**, generateStaticParams, u sitemap-u. CMS: `artwork` proširen (slug, priceFrom, dimensions[tags], frames[naziv+swatch], gallery). Fajlovi: `schemaTypes/documents/artwork.ts`, `components/worldb/ArtGallery.tsx` (client lightbox, a11y role=dialog/Escape/focus), `app/[locale]/umetnost/page.tsx` (koristi ArtGallery, `data-world="b"` hook za buduću estetiku), `app/[locale]/umetnost/[slug]/page.tsx`, queries (`getArtworkBySlug`/`getArtworkSlugs`, Artwork+ArtworkDetail), sitemap async, poruke ArtPage (priceFrom/currency/dimensions/frames/availability/fullPage/close sr+en). Spec: `docs/dodaci-i-umetnost.md` (B). VERIFIKOVANO: galerija+cena (sr+en), lightbox (dimenzije/ramovi/IG/full-page), strana po radu (h1/canonical/JSON-LD/IG), sitemap 3 sluga, mobilni 375px bez horiz. skrola, build SSG (6 strana po radu). Seed `scripts/seed-artworks.mjs` (test-art-1..3 — ⚠️ obrisati pre launcha). **⚠️ ESTETIKA World B-a je odložena** (struktura/logika finalne; izgled/boje/fontovi verske linije = dizajn-prolaz sa ženom, `data-world="b"` je hook). **NAPOMENA:** `components/InquiryDialog.tsx` je sad neupotrebljen (World B prešao na IG) — kandidat za brisanje (vlasnik da odluči). **SLEDEĆE: World B estetika (sa ženom) ili sledeća funkcija po izboru vlasnika.**

**+ „ДОДАЦИ" STRANA GOTOVA (15.07):** nova nav strana `/dodaci` (World A prateće stvari — zahvalnice, pokloni za goste, table dobrodošlice, kitke) = informativni tekst + mozaik galerija + dugme „Јавите нам се" → Instagram. Bez kategorija/cena/checkout-a. CMS: `dodaciPage` (singleton) + `dodaciItem` (lista) u Studiju („Страница: Додаци" / „Додаци (ставке)"). Fajlovi: `schemaTypes/documents/dodaci{Page,Item}.ts`, `app/[locale]/dodaci/page.tsx`, queries `getDodaciPage`/`getDodaciItems`, `Header` nav link, poruke `DodaciPage`+`Nav.dodaci` (sr/en), `/dodaci` u sitemap ROUTES. Spec: `docs/dodaci-i-umetnost.md` (A). VERIFIKOVANO uživo: sr+en, metadata iz CMS-a, dugme→IG (_blank/noopener), mobilni 375px bez horiz. skrola, build SSG prošao. Seed `scripts/seed-dodaci.mjs` (test-dodaci-1..4 — ⚠️ obrisati pre launcha). **SLEDEĆE: World B nadogradnja (spec B) — čist IG kontakt + strana po radu za SEO.**

**KONFIGURATOR + PLAĆANJE KOMPLETNI I VERIFIKOVANI UŽIVO.** Ceo tok radi: **galerija `/napravite-svoju` (tabovi Штампане/Дигиталне + filter ТИП jedno/dvostrana + kategorije Венчање/Крштење/Дечије) → klik dizajn → konfigurator `/napravite-svoju/[slug]?tip=…` (izbor teksta klik-na-pozivnicu/panel, papir/omot/dodaci/pečat, ŽIVA CENA) → checkout (potvrda→forma→snima order+mejl) → UPLATA NA RAČUN (ekran s računom/iznosom/pozivom na broj + IPS QR scan-to-pay).** Dvostrane = 2 strane, +20 auto. Svi dizajni idu i štampano i digitalno (digitalno = stub „ускоро", pun tok = Faza 4). Vizuelni alat `/template-tool` (drag polja, prednja+zadnja strana) radi. Cena se UVEK računa na serveru (§7).

**⚠️ VLASNIK MORA — pun checklist: `docs/vlasnik-todo.md` (obavezno pre launcha + opciono + sadržaj-žena). Sažetak:** (1) PRAVI podaci banke u Studiju → Podešavanja → „Уплата на рачун" (sad PLACEHOLDER „160-0000000123456-78"); (2) RESEND nalog + `RESEND_API_KEY` (Vercel+.env.local) da mejlovi rade; (3) obrisati TEST podatke pre launcha (šabloni test-template/test-double/test-digital, kategorije, placeholder banka); (4) rotirati SANITY_API_WRITE_TOKEN (bio u chatu). Žena: unosi prave šablone (hi-res slike bez editabilnog teksta) + pečat motive/boje + svotčeve papira/koverti.

**📋 PO PRVOBITNOM PLANU JOŠ OSTAJE (osim estetike World B / parkiranog / novih ideja) — 15.07:**
- **(A) Digitalna pozivnica + PDF (Faza 4)** — pola proizvoda: izbor dizajna → živi tekst → plaćanje 100% → PDF na mejl. Čeka vlasnikove PRAVE hi-res dizajne + fontove. Nije opcija, srce digitalnog dela. Prvo na redu čim stignu dizajni.
- **(B) „Прилагодите баш вама" + posebne vitrine → Smart Inquiry (§15)** — potpuno custom dizajn (par „hoću svoje" → upit), savijene pozivnice, pozivnica u flašici. NIJE napravljeno. Koristi zadržani `InquiryDialog` popup. Može ODMAH (ne zavisi od vlasnika).
- **(C) Faza 6 pred-lansiranje (ne-kozmetika)** — pun bezbednosni pregled svih „vrata" (§3), pred-launch čeklista (nema test/placeholder, sve iz CMS-a, oba jezika), Core Web Vitals + kompletan mobilni prolaz. Ide pred kraj (pred januar).
- _Napomena: konfiguratorski upsell (Faza 3.4) = urađeno preko „нешто посебно → Instagram" (vlasnikova odluka). Vlasnikove launch obaveze = `docs/vlasnik-todo.md`._

**⏸️ PARKIRANO / SLEDEĆE (vlasnik bira):** (A) Faza 4 digitalna+PDF (čeka dizajne+fontove) · (B) custom/posebne vitrine (može odmah) · (C) Faza 6 pred-launch · World B estetika (sa ženom) · font-library (custom upload) · nastavak bulletproof-a

💡 **DIGITALNI SAJT VENČANJA + ONLINE RSVP + UPRAVLJANJE GOSTIMA — STRATEŠKA OPCIJA (Q3–Q4, van prvobitnog plana):** vlasnik želi da se implementira; puni brief u `docs/ideja-wedding-website-rsvp.md` (namenjen da se preda spec-writeru/„ultracode" za punu spec+roadmap+faze). Ukratko: svaki par uz štampanu pozivnicu dobija privatnu digitalnu stranu venčanja (detalji+priča+galerija) + online RSVP (dolazak/broj/jelo/napomena) + živu listu gostiju za par, povezano QR-om na pozivnici. Standard u svetu (Zola/Joy/Minted; QR na pozivnici 20%→49% 2022–2024), rupa na domaćem tržištu, pogađa glavni cilj (§8 manje DM-ova). „Drugi motor" biznisa, ne feature — realni 2x. ⚠️ POSLE core launcha; novo terensko: auth para (magic-link) + prava baza za guests/RSVP (ne Sanity) + pravni sloj (podaci gostiju). Detalji + otvorena pitanja: brief fajl.

💡 **AI FAQ CHATBOT — ODOBRENO ZA KASNIJE (15.07, van prvobitnog plana):** chat prozorčić na sajtu koji odgovara na pitanja (rok isporuke, proces, okvirne cene) iz vlasnikovog FAQ-a. Direktno služi glavnom cilju (§8: manje DM-ova ženi). **Kako:** `/api/chat` ruta → Claude API (HTTP, bez novog teškog paketa, kao Resend) + FAQ sadržaj u Sanity (vlasnik unosi) + chat UI. Model: Haiku (najjeftiniji, dovoljan za FAQ) — ~pola pare po pitanju, par $/mesec, rate-limit kapira. **⚠️ BEZBEDNOST (§3 — AI endpoint košta pare po pozivu = pravo „vrata"):** (1) strogi rate-limit po IP (reuse `lib/rateLimit`), (2) max dužina poruke + max poruka/sesija, (3) mesečni budžet-plafon na Anthropic nalogu, (4) protiv izmišljanja — odgovara SAMO iz FAQ-a, kad ne zna → „pitajte na Instagramu" (bez pogrešnih rokova/cena), (5) prompt-injection: bot samo ispisuje tekst, bez akcija. **⚠️ VLASNIK MORA (kad se bude gradilo):** (a) napraviti **Anthropic API nalog** na platform.claude.com + API ključ + mali kredit — NIJE isto što i claude.ai Pro pretplata (vidi napomenu dole), (b) napisati FAQ sadržaj. **NAPOMENA — zašto ne Claude Pro nalog:** claude.ai Pro/Max je LIČNA pretplata za tebe kao čoveka u chat aplikaciji; NE daje API ključ i ne sme/ne može da se zakači na javni sajt (drugi proizvod, druga naplata). Sajtu treba Claude API (developer, pay-as-you-go). Ponašanje „limit udaren → пробајте касније" je lako napraviti i na API-ju (to je baš naš rate-limit), tako da dobiješ tačno to što želiš — samo kroz pravi tip naloga. Uraditi POSLE trenutnih stavki (čeka FAQ + nalog). (njoj se trenutni izgled ne sviđa — boje/fontovi; to je OK, gradili smo funkciju; vidi POLISH.md). Kad vlasnik pita „gde smo šuplji" → nabroji ovo.

**Novi paket (odobreno):** `qrcode` (IPS QR slika). Preview MCP: `mcp__Claude_Browser__preview_start {name:"kreativna-dev"}` (launch.json u `C:\Users\Tile\.claude`), port 3000.

---

**Gde smo:** ✅ FAZA 0. ✅ 1.0 intro (video). ✅ 1.1 + 1.2 KOSTUR LANDINGA KOMPLETAN — sve sekcije rade iz Sanity (Hero/carousel, Galerija/mozaik, Zašto baš mi, O nama, Postanite deo priče/brojač+paketi-ilustracija, Kontakt) + nav (fiksni, Akcija festive). ✅ 1.3 Smart Inquiry (forma→Sanity+email, verifikovano). ✅ FAZA 2 (/umetnost showcase + Inquiry popup). ✅ /nastanak (spojen Proces+Radionica, YouTube). ✅ /akcija (CMS akcije, %, auto-expiry). **SVE nav strane rade osim /napravite-svoju** (konfigurator, 404 do tad). ✅ 1.6 SEO baseline (sitemap/robots/OG/hreflang). ✅ 3.1 CENOVNIK u Sanity (paperOption/envelopeOption liste + pricing singleton; SEED ubačen iz docs/cenovnik.md — cene editable u Studiju). Formula potvrđena od vlasnika: `Kol × (papir + dodaci/kom + koverta + pečat) + (Kol<50 ? 4000 : 0) − popust(ručno)`; dizajn NIJE u fizičkom konfiguratoru (ide na upit/IG). **★ KONFIGURATOR U TOKU — puna spec u `docs/konfigurator.md`.** ✅ Korak 1 (CMS: `invitationTemplate`+`templateTextField`, `sealMotif`, `sealColor`, `order` šeme; `addonGoldEdges` u pricing; Studio desk „Позивнице — шаблони / Печат — мотиви/боје / Наруџбине"; font paleta `src/lib/templateFonts.ts`). ✅ Korak 2 (test šablon sidovan: doc `test-template` + placeholder slika; skripta `scripts/seed-test-template.mjs` re-runnable). ✅ Korak 3 (živi preview + editovanje teksta) — VERIFIKOVANO UŽIVO (Preview MCP radi preko `C:\Users\Tile\.claude\launch.json` → `npm --prefix ... run dev`, port 3000). **VAŽNA ODLUKA (pivot):** inline `contentEditable`+`dangerouslySetInnerHTML` je bilo KRHKO (tekst na pozivnici se resetovao na default kad se menja drugo polje — verovatno baš to je srušilo prošli pokušaj). Prešao na ROBUSTAN pristup: tekst na pozivnici je KONTROLISAN iz React state-a (jedan izvor istine → checkout podatak uvek tačan, živa promena garantovana), edituje se kroz panel „Уредите текст" (prava polja — mobilno pouzdano), a **klik na tekst na pozivnici fokusira to polje** (zadržan osećaj „kliknem na pozivnicu pa menjam"). Fajlovi: `TemplatePreview.tsx` (kontrolisan prikaz, cqw font, klik→onFieldClick), `TextEditPanel.tsx` (labeled inputi, registerRef), `Configurator.tsx` (state + focusField). Verifikovano: panel↔preview živa sinhronizacija bez reseta, klik→fokus polja, mobilni 375px BEZ horiz. skrola, font se skalira. **★ SLEDEĆE = Korak 4:** desni panel kontrola (količina, papir sa svotčevima, omot→koverat pod-meni, dodaci, pečat sa slikama) + Korak 5 živa cena (server preračun u Koraku 7 `/api/order`).
**PDF ZA ŠTAMPU (vlasnikov ključni zahtev, 14.07):** kad kupac plati, vlasnik dobija PDF tačno te pozivnice da šalje na štampu. Izvodljivo jer je raspored deterministički (% pozicije + fontovi) → render iste slike+teksta u HIGH-RES PDF. **= Faza 4** (posle konfiguratora, pre/uz plaćanje Faza 5). ⚠️ ZAVISNOST: vlasnik kači ŠABLONE U VISOKOJ REZOLUCIJI (Canva export ~300dpi), NE web-sličice; fontovi editabilnih polja se embeduju u PDF. Trenutni test-šablon je placeholder SVG (500px) — samo za demo mehanike.

**★ FONT STRATEGIJA — PIVOT posle realnih primera (14.07).** Fiksna 8-paleta NIJE dovoljna: vlasnik koristi 100+ fontova, 4/pozivnici, neki bez ćirilice (ručno sklapa Љ), neki ručno crtani inicijali. REŠENJE = princip: **pozadinska SLIKA nosi svu umetnost (ukrasi, ručno crtana slova, fiksni tekst); sajt živim tekstom ispisuje SAMO editabilna polja.** Zato ne treba 100+ fontova — samo fontovi editabilnih polja, i to za ~20–30 KURIRANIH konfigurabilnih šablona (ostatak kataloga = „na upit"). Fontovi: (a) Google Fonts (uključimo po potrebi), (b) VLASNIKOVI custom fontovi koje kači kao fajl (⚠️ mora imati fajl + licencu za web/PDF embed; Canva često ne da fajl). Slova koja ne postoje ni u jednom fontu (ručno sklopljena/crtana) = umetnost, ne tekst: ako fiksna → u slici; ako promenljiva → dizajn ide „na upit" ili mu se zameni font. Ideja za ručne stilove: Calligraphr (rukopis→.ttf, ceo ćir. alfabet jednom) → onda kupac kuca bilo šta u tom rukopisu. **TODO (uz vizuelni editor / font podršku):** `fontOption` CMS dokument (naziv + opcioni upload font fajla + family/source), `fontKey` → referenca na njega (zameniti trenutni fiksni `templateFonts.ts` 8-set kad se bude gradilo). Realni primeri od vlasnika: slika „Нина и Душан" = idealan konfigurabilan (par polja, akvarel+lotos u slici); slika iluminirana (ručno „П", kaligrafija) = tip „na upit".

✅ **KORAK 4 GOTOV (14.07) — kontrole + živa cena, VERIFIKOVANO uživo.** `lib/configuratorPricing.ts` (čist price-calc, jedan izvor za klijent+server §7), `OptionControls.tsx` (količina, papir sa svotčevima, omot bez/paus/koverat→envelope pod-meni, dodaci torn/gold/rounded, pečat 4 tipa + motiv/boja), `PriceSummary.tsx` (po komadu/ukupno/depozit 50%/ostatak pouzećem/rok 10 dana + „nešto posebno"=IG link). `pricing.pausOmotPrice` (40) dodat. Formula verifikovana klikanjem: 50×50=2500; qty 30→+4000 setup; papir 90 + torn 20 →110/kom→7300, depozit 3650. Mobilni 375px bez horiz. skrola, sr+en rade. **⚠️ INFRA BUG NAĐEN+ZAOBIĐEN:** `paperOption/envelopeOption/sealMotif/sealColor` NISU u javnom (no-token) read grant-u ovog dataseta (samo `pricing/invitationTemplate/...` jesu — potvrđeno: svež paperOption napravljen isto kao test-template NIJE javan, a template jeste). Zato konfigurator čita opcije SERVERSKI: `sanity/serverQueries.ts::getConfiguratorOptionsServer` preko `writeClient` (token server-only §3). Alternativa za kasnije: vlasnik u manage.sanity.io doda te tipove u javni read filter (pa se može javno čitati). sealMotif/sealColor još prazni (žena dodaje). **★ SLEDEĆE: vizuelni editor (dole) + checkout K6/K7.**

✅ **KORAK 6+7 GOTOV (14.07) — CHECKOUT, VERIFIKOVANO end-to-end.** `Checkout.tsx` (overlay 3 koraka: finalni read-only preview + popup potvrde „проверите…" → forma ime/telefon/mejl/adresa/datum + rezime → uspeh; Escape/backdrop zatvara). `/api/order` route: rate-limit `order:ip` 5/min, honeypot, validacija+sanitizacija, **cena RECOMPUTED na serveru** iz Sanity (pricing + paper/envelope po id-u, `computePrice`) — browser cena se ignoriše (§7), snima `order` (status pending_payment) preko `writeClient`, `sendOrderEmail` vlasniku (`lib/email.ts`, primalac = siteSettings.contactEmail; skip ako nema RESEND ключа — narudžbina ipak snimljena). Dugme „Наручите" u Configuratoru. VERIFIKOVANO: POST /api/order → total 7500/depozit 3750 tačno server-strane; order pao u Sanity sa svim snapshotima (paper/envelope/addons/textValues/customer); test order obrisan. UI: modal potvrda→forma radi. ⚠️ Za žive mejle: napraviti RESEND nalog + RESEND_API_KEY (Vercel + .env.local) — bez toga order radi ali mejl se preskače. **KONFIGURATOR CORE FLOW KOMPLETAN:** šablon → tekst → opcije → živa cena → checkout → order+mejl.

✅ **GALERIJA + DVOSTRANE — GOTOVO (14.07), VERIFIKOVANO uživo.** Novi tok: **„Дизајнирајте сами" → GALERIJA (`/napravite-svoju`) → klik na dizajn → konfigurator (`/napravite-svoju/[slug]`).** Galerija (po vlasnikovoj skici): tabovi **Штампане/Дигиталне** + kategorije levo (samo one prisutne u aktivnom tabu) + grid ~4/red, bez sortiranja. **CMS:** `templateTextField` izdvojen u zaseban object (reuse za prednju+zadnju); `invitationTemplate` dobio `slug`, `categories` (ref niz), `doubleSided` (bool), `backImage`+`backTextFields` (grupe u Studiju, back skriven dok nije doubleSided); novi `category` dokument (managed lista, Studio „Позивнице — категорије"). `order` dobio `doubleSided`. **★ ISPRAVKA (14.07): SVI dizajni mogu i štampano i digitalno — NEMA `type` polja na šablonu.** Tab Штампане/Дигиталне = kupčev IZBOR (oba taba prikazuju SVE dizajne); mod se nosi u link kao `?tip=stampana|digitalna`, `[slug]` strana ga čita iz searchParams. Digitalna = fiksna cena (ista za 1/2-stranu — „ne komplikujemo"; `digitalPrice` u pricing dodati u Fazi 4). Verifikovano: isti dizajn (test-sablon) → `?tip=stampana` = konfigurator (50/kom), `?tip=digitalna` = stub. **★ Levi sidebar (vlasnikova skica 14.07): dve sekcije — „ТИП" (Све/Једнострана/Двострана, filter po `doubleSided` flag-u; „Двострана" VIŠE NIJE kategorija) pa ispod „КАТЕГОРИЈЕ".** Kategorije (vlasnik dao): **Венчање, Крштење, Дечије** (seed-ovane; stara `category.dvostrana` obrisana). Oba filtera (tip + kategorija) se kombinuju (AND). Verifikovano uživo. **Dvostrane:** kupac NE bira (zakucano u dizajn), **+20/kom AUTOMATSKI** (`pricing.addonDoubleSided`, čita se sa ŠABLONA server-strane §7 ne iz browsera), konfigurator prikazuje 2 preview-a (prednja+zadnja), oba editabilna, checkout pokazuje obe. Digitalne = stub „ускоро + Instagram" (pun tok Faza 4/5). Fajlovi: `components/gallery/Gallery.tsx`, `napravite-svoju/page.tsx` (galerija), `napravite-svoju/[slug]/page.tsx` (konfigurator/stub), `Configurator.tsx` refaktorisan na JEDAN šablon (izbačen picker) + dvostrana, `serverQueries` (`getGalleryDataServer`/`getTemplateBySlugServer`), `queries` (CATALOG_QUERY/TEMPLATE_BY_SLUG_QUERY, tipovi CatalogData/GalleryTemplate). Poruke: novi `Catalog` namespace (PAZI: „Gallery" ns već postoji za landing — ne mešati). VERIFIKOVANO: tabovi/kategorije filtriraju tačno, dvostrani = 2 preview + 70/kom (50+20), jednostrani = 50/kom, digitalni = stub, checkout dugme radi. Seed: `scripts/seed-gallery.mjs` (3 kategorije + test-double/test-digital + tag test-template). **⚠️ pre launcha obrisati test šablone (test-template/test-double/test-digital) i test kategorije.**
✅ **Vizuelni alat — ZADNJA STRANA GOTOVA (verifikovano):** `/template-tool` sad ima prekidač Предња/Задња kad je šablon `doubleSided` (`TemplateFieldEditor` drži {front,back} po šablonu; canvas koristi back sliku/aspect; `/api/template-fields` prima i `backTextFields`, `sanitizeFields()` reuse, patch-uje oba). Verifikovano: povukao back polje „program" 15/28→35.1/59, sačuvao, u Sanity oba (front imena netaknut + back program). `getTemplatesForToolServer` vraća backImageUrl/backAspect/backTextFields/doubleSided.

✅ **FAZA 5 — PLAĆANJE (UPLATA NA RAČUN) GOTOVO + VERIFIKOVANO (14.07).** Vlasnik izabrao uplatu na račun (ne kartični gateway — bez provizija/integracije). Bez kartičnih podataka kroz sajt. Kako radi: checkout → order snima (status `pending_payment`) + generiše `orderNumber` (poziv na broj, `lib/payment.ts::generateOrderNumber`, datum+vreme+2 rand = 16 cifara) → success ekran KUPCU prikazuje: prImalac/račun/banka/iznos=depozit 50%/poziv na broj/svrha; vlasniku mejl sadrži orderNumber; vlasnik u Studiju označi „deposit_paid" kad novac stigne. **CMS:** siteSettings dobio fieldset „Уплата на рачун" (bankRecipient/bankAccount/bankName/bankModel[00]/bankPaymentCode[289]/bankPurpose) — ⚠️ VLASNIK MORA da unese PRAVE podatke (sad su PLACEHOLDER seed-ovani: „160-0000000123456-78" Banca Intesa — ZAMENITI). `order` dobio `orderNumber`. `/api/order` čita bank iz siteSettings, generiše broj, vraća `payment` blok. Verifikovano: POST vraća orderNumber+payment; UI success prikazuje račun+iznos+poziv na broj; order pao u Sanity; test orderi obrisani. **⏳ OSTAJE: IPS QR kod** (`lib/payment.ts::buildIpsQrString` VEĆ napisan, NBS format K:PR|V:01|C:1|R|N|I:RSD..,00|SF|S|RO:model+ref) — treba QR biblioteka (npr. `qrcode`, MIT) da se render-uje slika; ČEKA odobrenje paketa (§2). Slot u Checkout success ostavljen.

✅ **GOOGLE SHEET EVIDENCIJA — GOTOVO (15.07), kod verifikovan (typecheck + ruta se servira 405).** Push direktno iz `/api/order` u vlasnikov Sheet preko Google Apps Script Web App webhook-a (BEZ novog npm paketa — čist HTTP POST kao mejl). `lib/googleSheet.ts::appendOrderToSheet` (env-gated `GOOGLE_SHEET_WEBHOOK_URL`, tajna `GOOGLE_SHEET_SECRET` u payloadu, 8s abort timeout, NON-BLOCKING — order je već snimljen+mejlovan pa greška ne ruši checkout). Poziva se posle mejl bloka; `createdAt` hoistovan (jedan izvor vremena za order + red). Red nosi: datum, broj, šablon, kupac (ime/tel/mejl/adresa/datum), količina, dvostrana, papir + **Папир(ком)=količina** (za SUMIF materijala), omot/koverta + Коверта(ком), pečat, dodaci (torn/gold/rounded), ukupno, depozit. `.env.example` dopunjen. **⚠️ VLASNIK PODEŠAVA (opciono, nije launch blocker):** `docs/google-sheet-setup.md` — napravi Sheet → Apps Script (gotov skript za kopiranje, stavi svoju lozinku) → Deploy Web App → URL+SECRET u Vercel env + `.env.local`. **Kraj-do-kraj test Sheet-a čeka vlasnikov URL** (naš POST deo gotov). Ako Sheet zakaže/nije podešen → order svejedno radi. Zbirni SUMIF list = uputstvo u docs. **NBS napomena:** privatnije od parsiranja Gmaila (samo 1 Sheet), lozinka štiti upis.

⏸️ **FAZA 4 (PDF za štampu + digitalni tok) PARKIRANA (vlasnik, 14.07)** — vratiti se; čeka pravi hi-res dizajn + fontove. Prešli na FAZU 5 (plaćanje). (Podsetiti kad vlasnik pita „gde smo šuplji".)

🛡️ **BULLETPROOF (u toku, 14.07):** ✅ količina — polje se može obrisati pri kucanju (lokalni string buffer, cena zadrži poslednju validnu vrednost, na blur snap na ceo broj ≥1); ✅ checkout pristupačnost — `role="dialog"` + fokus u polje imena kad se otvori forma + vraćanje fokusa na dugme pri zatvaranju (uz Escape/backdrop što je već bilo). Ostalo (kandidati, po potrebi/vlasnikovim primedbama): još edge-case guardova, prazna stanja, dodatni a11y. NAPOMENA: teži vizuelni pass ide u Fazi 6 (žena) — sad samo logika/robustnost koja preživljava redizajn.

**⏳ VRATITI SE OBAVEZNO (vlasnik zamolio 14.07):** vlasnik NIJE stigao da napravi pravi dizajn ni da skupi fontove → kad bude imao, ODMAH testirati END-TO-END: (1) Canva → obriši editabilni tekst → export hi-res PNG → okači kao `invitationTemplate` u Studiju; (2) postavi polja (ručno % ili vizuelnim editorom); (3) potvrdi fontove/paletu; (4) proći ceo tok (tekst→opcije→cena→checkout) na PRAVOM dizajnu. Tek to je pravi dokaz da konfigurator radi za realne pozivnice.

**★ OSTAJE:** (1) VIZUELNI EDITOR polja (dole), (2) font-library/custom upload (§FONT STRATEGIJA), (3) Faza 4 PDF za štampu (hi-res + font embed), (4) Faza 5 plaćanje 50% depozita (gateway) + webhook, (5) žena unosi pravi sadržaj (šabloni hi-res, pečat motivi/boje, papiri svotčevi). Vlasnik odlučio: prvo checkout (gotov), pa vizuelni editor sledeći put.

✅ **VIZUELNI EDITOR POLJA — GOTOV (14.07), VERIFIKOVANO uživo.** Interni alat na ruti **`/template-tool`** (NE u Sanity Studiju — u našoj app-i, da je proverljivo + bez novog auth-a preko Studija). Izbor šablona → PREVLAČENJE polja po slici (postavlja xPct/yPct) → bočni panel: font (paleta), veličina (slajder), širina (slajder), boja, poravnanje, više redova, naziv/primer teksta, dodaj/obriši polje → „Сачувајте распоред". Fajlovi: `app/template-tool/{layout,page}.tsx` (izolovan root layout, noindex, bez nav/Lenis), `components/admin/FieldPlacementCanvas.tsx` (drag preko pointer eventa, % model), `components/admin/TemplateFieldEditor.tsx` (+ `FieldForm`), `sanity/serverQueries.ts::getTemplatesForToolServer` (token read svih šablona), `/api/template-fields` (GUARDED write: dev otvoren, PROD traži `TEMPLATE_TOOL_KEY` u header `x-admin-key`; sve polje validirano/klampovano server-strane; `writeClient.patch().set({textFields})`). Middleware matcher isključuje `/template-tool` (kao `/studio`). VERIFIKOVANO: povukao „imena" 15%/28%→44%/42.3%, sačuvao, potvrđeno u Sanity da je upisano (ostala polja netaknuta); test-šablon vraćen u početno stanje. **KAKO VLASNIK KORISTI:** Studio → napravi `invitationTemplate` + okači hi-res sliku (bez editabilnog teksta) → otvori `/template-tool` → izaberi taj šablon → dodaj/postavi polja → sačuvaj. ⚠️ Za PROD pristup: postaviti env `TEMPLATE_TOOL_KEY` (Vercel) i uneti ga u alat (localStorage `templateToolKey`) — dok se ne postavi, u prod-u alat ne može da snima (bezbedno po defaultu); lokalno radi slobodno. Kasnije (opciono): zaštititi i samu STRANU alata (sad je stranica dostupna, ali snimanje je gejtovano).

**★ (stari plan, sad realizovan drugačije — u app-i, ne u Studiju):** Umesto ručnog unosa % (mučno za 30 dizajna): u Studiju custom input koji prikaže sliku šablona, vlasnik klikne gde ide polje + razvuče veličinu + izabere font/boju → upisuje xPct/yPct/widthPct/fontSizePct. Workflow kačenja: Canva → dupliraj dizajn → obriši editabilni tekst → export hi-res PNG → Studio „Позивнице — шаблони" → nova → okači sliku → dodaj polje po promenljivoj (2 var=2 polja, 5=5). **Redosled sad:** Korak 4 (kontrole+cena, NE zavisi od fontova — gradi se odmah, vlasnik potvrdio) → pa vizuelni editor + font-library → pa checkout (K6/7) → Faza 4 PDF. **Odluke vlasnika (13.07):** zlatne ivice = dodatak PO KOMADU (cena uredива u Sanity, default 30); „nešto posebno" dugme = ČIST Instagram link (ne Smart Inquiry); checkout traži opcioni datum događaja. Font paleta: krenuo sa predlogom (Cormorant/EB Garamond/Playfair/Lora/Spectral/Philosopher/Marck/Caveat) — ⏳ ČEKA se vlasnikova potvrđena lista fontova za ~30 dizajna (menja se u minut, samo mapiranje). Vlasnik postavlja 20–30 šablona; žena puni sadržaj + cene/svotčeve. Pristup ZAKLJUČAN — NE lutati.
**Env/setup:** SANITY_API_WRITE_TOKEN postavljen (Vercel Production + .env.local) — ⚠️ rotirati (bio u chatu). RESEND: napraviti nalog + RESEND_API_KEY (Vercel + .env.local); primalac mejla = „Мејл за упите" u Sanity Podešavanjima. Email „from" u test modu (onboarding@resend.dev) šalje samo na tvoj Resend nalog dok ne verifikuješ domen.
**Projekat na disku:** `C:\Users\Tile\kreativna-pozivnica` (pokreni Claude Code IZ ovog foldera → CLAUDE.md se učita sam).
**GitHub:** https://github.com/tilemagija/kreativna-pozivnica-new · **Vercel:** kreativna-pozivnica-new.vercel.app
**Sanity:** projectId `oil2tj3x`, dataset `production`. Studio na `/studio`. CORS: localhost:3000 + vercel domen dodati. Vercel env vars (3x NEXT_PUBLIC_SANITY_*) postavljeni.
**Okruženje:** Node v24.18.0, npm 11.16.0, git 2.55 — sve instalirano i radi.
**Stack stvarno:** Next.js 16 + TS + Tailwind v4 + App Router + src/ + next-intl + brend + Sanity + framer-motion + lenis. Kostur: Header/nav + main + Footer, `Reveal` (motion pattern), `SmoothScroll` (oba poštuju reduced-motion).
**★ PRIORITET / SLEDEĆE: KONFIGURATOR** („Дизајнирајте сами" / /napravite-svoju) — NAJVAŽNIJI deo sajta, mora flawless. **Puna spec: `docs/konfigurator.md` (graditi TAČNO po njoj, ne lutati — lutanje je srušilo prošli pokušaj).** Cene su već u Sanity (`docs/cenovnik.md`). Pre koda: proći „otvorena pitanja za vlasnika" iz konfigurator.md §11 (font paleta, zlatne ivice, omot mapiranje, itd.). Plaćanje 50% depozita = Faza 5 (posle konfiguratora).

---

**(Arhiva prethodne akcije)** 1.1 korak 2 — render sekcija iz Sanity: (a) galerija-mozaik iz `galleryItem`; (b) „zašto baš mi" iz `homePage.whyReasons`; (c) DRUŠTVENI DOKAZ „Postanite deo priče": brojač raste do `counterTarget`+`counterSuffix` za 2-3s (reduced-motion → odmah), UPOREDO „padaju" paketi (vlasnik šalje skicu paketa — ČEKA SE), telefon sa IG mrežom (`instagramImages`), „Utisci" iz `testimonial`; (d) kontakt sekcija (forma tek u 1.3). Niša rečenica ispod brojača: preporuka „2.000+ porodica u našoj priči" (uredivo u Sanity `counterLabel`).

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
