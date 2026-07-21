# BRIEF — Digitalni sajt venčanja + Online RSVP + Upravljanje gostima

> **Šta je ovaj fajl:** strateški BRIEF (ne finalna spec). Namenjen da se preda
> spec-writeru („ultracode") koji će iz njega napisati **punu specifikaciju + ROADMAP + faze**.
> Piše se sve što treba da razume: viziju, tržišni dokaz, obim, arhitekturu, zavisnosti,
> otvorena pitanja. **Cilj implementacije: Q3–Q4** (POSLE nego što core proizvod — pozivnice —
> proradi i lansira). Ovo je „drugi motor" biznisa, ne feature.

---

## 0. TL;DR (jednom rečenicom)
Svaki par koji kupi štampanu pozivnicu dobija **privatnu digitalnu stranu svog venčanja**
(detalji događaja + priča + galerija) sa **online RSVP-om** (gost potvrđuje dolazak, broj
gostiju, izbor jela, napomene) i **živom listom gostiju** za par — a sve je povezano
**QR kodom na štampanoj pozivnici**. Time se brend iz „prodavnice pozivnica" pretvara u
„svadbena papirologija + digitalna platforma".

---

## 1. ZAŠTO ovo (poslovna teza)
- **Druga kategorija prihoda iz istog kupca.** Ne tražiš novog kupca — prodaješ više
  istom (svaki kupac pozivnice = kandidat za digitalnu stranu + RSVP).
- **Model iz „jednokratne transakcije" u „odnos mesecima".** Par koristi svoj sajt mesecima,
  gosti interaguju — brend je prisutan celim putovanjem. Ta „lepljivost" je razlog zašto
  Zola/Joy vrede milijarde.
- **Skoro nula marginalnog troška, visoka marža** (digitalno; to je ceo događaj, ne jedna karta).
- **Zatvara fizičko→digitalno.** Ručno ilustrovana pozivnica (srce brenda) postaje ULAZ u
  digitalnu platformu. Zolin model: besplatan wedding-sajt = mamac koji uvuče parove, pa se
  naplate pozivnice. Isti playbook, lokalizovan.
- **Rupa na domaćem tržištu.** Standard na Zapadu, skoro nelokalizovano za Srbiju/ćirilicu.
  Spoj artizanske ručne pozivnice + moderan RSVP na srpskom — niko lokalno to ne radi.
- **Pogađa GLAVNI cilj sajta (§8 CLAUDE.md: manje DM-ova ženi) direktno u centar:** gosti
  sami potvrđuju dolazak umesto da dopisuju par; online proofing ubija prepisku oko dizajna.

## 2. TRŽIŠNI DOKAZ (zašto je ovo standard, ne eksperiment)
- **Zola / Joy / Minted** sve prodaju pozivnicu + digitalni „wedding website" + RSVP kao paket.
  Standardno nude: izbor jela, plus-one, dijetetske napomene, ŽIVU listu gostiju u realnom
  vremenu, raspored sedenja, „tagovanje" događaja (samo pozvani vide određeni događaj).
- **QR kod na štampanoj pozivnici → RSVP/sajt para eksplodirao:** 20% (2022) → 38% (2023)
  → **49% (2024)**. Skoro pola parova to sad OČEKUJE.
- Izvori (za spec-writera da produbi): zola.com/expert-advice/best-online-wedding-rsvp-tools ·
  withjoy.com (RSVP wedding websites) · theknot.com/content/wedding-qr-code ·
  paperlust.co/blog/qr-code-wedding-invitations-guide · invitecount.com/best-wedding-website-platforms

---

## 3. ŠTA JE PROIZVOD (feature breakdown)

### 3.1 Digitalna strana venčanja (microsite po paru)
- Jedinstven URL po paru (npr. `/vencanje/marija-i-dusan`) — mirror postojećeg
  `/umetnost/[slug]` obrasca. Odluka: subpath vs subdomen vs custom domen (vidi §7).
- Na-brend, vizuelno usklađen sa dizajnom njihove pozivnice.
- **Detalji događaja:** datum, vreme, lokacija(e) + mapa, dres-kod, satnica/timeline,
  info o smeštaju/putovanju.
- **Više događaja sa kontrolom vidljivosti** (npr. samo bliska porodica vidi ručak dan pre).
- **Priča para + galerija** (njihove slike, kako su se upoznali) — seda na brend etos
  „svako venčanje je priča".
- Opciono: knjiga utisaka / poruke gostiju; info o poklonima (kod nas: običaj novca —
  možда tekst/računi, NE gift-registry u zapadnom smislu za v1).

### 3.2 Online RSVP (gost-strana)
- Gost potvrđuje: dolazak (da/ne), broj gostiju / plus-one, **izbor jela**, dijetetske
  napomene, (opciono) predlog pesme, poruka paru.
- Bez logina za gosta (ili lagan „kod sa pozivnice"). Public forma → rate-limit + validacija
  + honeypot (postojeći obrasci iz `/api/inquiry` i `/api/order`).

### 3.3 Dashboard za par (upravljanje gostima)
- Živa lista: ko je potvrdio, ukupan broj, **zbir po jelima**, export (CSV/Sheet — reuse
  postojeće Google Sheet integracije kao ideja).
- Uvoz liste gostiju, slanje poziva, praćenje odgovora, podsetnici (reuse Resend).
- ⚠️ Zahteva **AUTENTIFIKACIJU para** (privatni dashboard) — NOVO za projekat (vidi §6).

### 3.4 QR most (fizičko→digitalno)
- QR kod se štampa na pozivnici → vodi na RSVP stranu para. **Reuse `qrcode` paketa**
  (već koristimo za IPS QR na uplati — ista biblioteka, trivijalno).
- Ovo je „connective tissue" i najjeftiniji deo sa najvišom percipiranom vrednošću.

### 3.5 Online proofing / odobravanje dizajna (povezano, veliki DM-reducer)
- Kupac vidi digitalni proof konfigurisane pozivnice, **odobri ili traži izmenu online**,
  pre štampe. Ubija baš onu prepisku koju sajt hoće da smanji. Može i kao zaseban mini-modul.

---

## 4. KAKO ZARAĐUJE (modeli — spec-writer da odabere/preporuči)
1. **Besplatan wedding-sajt kao levak (Zola model)** → naplata pozivnica + premium tier.
2. **Plaćen dodatak po paru** (jednokratno za digitalnu stranu + RSVP).
3. **Premium tier pozivnice** koji uključuje digitalnu stranu.
4. **Kasnije: multi-tenant / white-label** drugim štamparijama (produktizacija → 3–10x, ne 2x).

---

## 5. KAKO SEDA NA POSTOJEĆI STACK
- **Next.js dinamičke rute po paru** (`/vencanje/[slug]`) — isti obrazac kao `/umetnost/[slug]`.
- **Email:** reuse Resend (pozivi, podsetnici, potvrde) — `lib/email.ts` obrazac.
- **QR:** reuse `qrcode` (`lib/payment.ts::buildIpsQrString` obrazac).
- **Bezbednost:** reuse `lib/rateLimit`, honeypot, server-strana validacija.
- **Order veza:** kad par naruči pozivnicu, može AUTO da se provizionira njegov wedding-sajt.

---

## 6. NOVO TERENSKO (što projekat DO SADA nema — spec mora da reši)
- **Autentifikacija para** za privatni dashboard (magic-link mejlom je najprostije). Ovo je
  prva prava auth potreba na projektu.
- **Skladište podataka gostiju/RSVP:** Sanity je za sadržaj (nizak volumen, uređivanje). Podaci
  gostiju su **visok volumen + lični (imena, jelo, dijeta = potencijalno „zdravstveni" podatak)**
  → ozbiljna odluka: Sanity vs prava baza (Postgres preko Vercel/Supabase). Verovatno baza.
- **Privatnost/GDPR + srpski zakon o podacima:** čuvaš lične podatke gostiju koje par unosi →
  pravni okvir, saglasnost, brisanje. Realno pitanje, ne tehnikalija.

---

## 7. OTVORENA PITANJA ZA SPEC-WRITERA (odlučiti u spec-u)
1. **Skladište:** Sanity vs dedicated DB (Postgres/Supabase) za guests/RSVP? (preporuka: baza)
2. **Auth para:** magic-link / email OTP / drugo?
3. **URL šema:** subpath (`/vencanje/[slug]`) vs subdomen vs custom domen po paru?
4. **Privatnost:** kako se hendluje saglasnost + brisanje podataka gostiju?
5. **Monetizacija:** besplatan-levak vs plaćen dodatak vs premium tier? (§4)
6. **Vezanost za kupovinu:** da li se sajt AUTO pravi kad par naruči pozivnicu?
7. **Jezik gost-strane:** dvojezično? (gosti domaći → sr primaran, en opciono).
8. **Obim v1 vs kasnije** (vidi §8).

---

## 8. OBIM — v1 vs KASNIJE (predlog granica, spec da potvrdi)
**U v1 (MVP):** microsite po paru (događaj + priča + galerija) · online RSVP (dolazak + broj +
jelo + napomena) · živi dashboard para · QR most · mejl potvrde/podsetnici · auth para (magic-link).

**NE u v1 (kasnije):** builder rasporeda sedenja · gift-registry integracija ·
multi-tenant/white-label · nativna aplikacija · kompleksna logika višednevnog venčanja ·
online proofing (može kao zaseban modul, ranije ili kasnije).

---

## 9. ZAVISNOSTI / PREDUSLOVI (pre nego što se KRENE)
- Core proizvod (pozivnice: konfigurator + checkout + plaćanje) **lansiran i dokazan.**
- Analitika postavljena (da se meri konverzija levka).
- Resend domen verifikovan (mejlovi masovnije — pozivi/podsetnici).
- Doneta odluka o skladištu (§7.1) i auth-u (§7.2) PRE koda.

## 10. RIZICI (iskreno)
- **Ozbiljan build**, nije sat-dva (privatne strane, RSVP, dashboard, auth, baza).
- **Strateški pomak, ne feature** — menja identitet brenda. Odluka, ne dugme.
- **Scope-creep opasnost** ako se krene pre nego što core proradi. Redosled je sve.
- **Pravni sloj** (podaci gostiju) se ne sme preskočiti.

---

## 11. NAPOMENA ZA SPEC-WRITERA
Iz ovog brief-a napiši: (a) punu funkcionalnu spec (kao `docs/konfigurator.md` stil),
(b) fazni ROADMAP (faze sa „NE radimo (yet)" i „Gotovo kad…" po uzoru na postojeći ROADMAP.md),
(c) bezbednosni pregled svih novih „vrata" (RSVP forma, auth, dashboard, uvoz gostiju) po §3
CLAUDE.md, (d) arhitektonsku odluku o skladištu + auth-u sa preporukom. Poštuj Layer 1
standarde iz CLAUDE.md (bezbednost, mobile-first, CMS-editable sadržaj, jedan sistem stilova).
