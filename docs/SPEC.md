# SPEC.md — puna specifikacija projekta (Kreativna Pozivnica)

> Detalji proizvoda, flow-ova, cena i bezbednosnih „vrata". Čita se PO POTREBI (kad se radi
> funkcionalnost), ne na svakom startu. Univerzalna radna pravila → `CLAUDE.md`.
> Izgled/tokeni → `DESIGN.md`. Gde smo → `ROADMAP.md`. Istorija → `docs/ROADMAP-archive.md`.

---

## 1. ŠTA JE PROJEKAT

**Premium ručno rađene svadbene pozivnice & custom umetnost.** Biznis ručno ilustruje priču svakog para (njihova crkva, oni kao par) — ne postoji identična pozivnica. Ta custom ilustracija je jezgro, neкopирљива prednost. Brend je izrastao u **custom umetnost & poklone** (uramljene ilustracije, verski/slava pokloni) — jedan post dosegao ~200.000 ljudi organski.

**Primarni cilj sajta:** smanjiti ručno DM/dopisivanje opterećenje vlasnikove žene (najveći trošač vremena) — pomeriti katalog, samouslužne info i prijem upita na sajt, i pretvoriti upit/posetu u narudžbu.

**Publika:** parovi pred venčanje (uglavnom 20–34), ~78% domaći (Srbija). Sajt služi i rastuću umetnost/pokloni publiku.

## 1a. DVA SVETA  (jezgro arhitekture)

- **Svet A — Pozivnice (venčanja).** Pozivnice (digitalne + fizičke) + svadbena galanterija (koverte, zahvalnice, meniji, table dobrodošlice). „Shop" logika: konfiguriši → cena → kupi.
- **Svet B — Umetnost & pokloni.** Uramljene ilustracije, **slava pokloni**, ramovi, verska umetnost. Magnet organskog dometa. Za launch: **showcase → upit** (bez online kupovine). Slava linija je naglašena za januarski launch.

## 2. STACK

- **Framework:** Next.js (App Router) + TypeScript
- **CMS:** Sanity
- **Styling:** Tailwind + design tokeni — **jedan sistem** (ne mešati styled-components).
- **i18n:** next-intl — **srpski ćirilica (sr-Cyrl) default + engleski (en).**
- **Motion:** framer-motion + lenis (smooth scroll).
- **Hosting:** Vercel

**Novo terensko (extra pažnja + prost jezik):** plaćanje, PDF generisanje, slanje mejlova, rate limiting, input validacija, live konfigurator/text editor.

> Stack je fiksan. Ne predlagati alternative osim ako tvrd tehnički bloker ne prisili — prvo flag-uj bloker.

## 3. FOLDER STRUKTURA

```
src/
  app/[locale]/          # sr-Cyrl (default) + en — jezički wrapper (stranice)
    page.tsx             # LANDING (single scroll)
    napravite-svoju/     # KONFIGURATOR (digitalne + fizičke)
    nastanak/            # „kako se pravi" (YouTube)
    umetnost/            # SVET B (showcase)
    dodaci/ · prilagodite/ · akcija/
  app/api/               # SERVER-ONLY: inquiry, order, template-fields
  app/studio/            # Sanity Studio
  app/template-tool/     # interni alat za postavljanje polja šablona
  components/            # UI (svaki < ~200 linija)
  lib/                   # helpers: pricing, validation, rate-limit, email, pdf, payment
  sanity/                # šeme + queries
messages/                # prevodi (sr, en)
public/                  # statika + swatch slike
```

## 4. SEO STANDARDI  (sajt cilja organski rast)

- Metadata (title, description) iz CMS-a gde moguće.
- Ispravna heading hijerarhija (jedan `h1` po strani, logični `h2`/`h3`).
- Semantički HTML (`<nav>`, `<main>`, `<article>`).
- Brzo i mobile-first (Core Web Vitals).
- Opisni, čitljivi URL-ovi. **Latin slug-ovi** (npr. `/napravite-svoju`) iako je sadržaj ćirilica.
- Ispravan **hreflang** (sr / en).
- **Svet B (umetnost/slava) je organski magnet — poseban SEO fokus.**

## 5. OBIM — ŠTA GRADIMO, ŠTA NE

**U OBIMU (launch):**
- Landing (hero + galerija + „zašto baš mi" + utisci/društveni dokaz + kontakt forma).
- „Nastanak" strana (YouTube embed-ovi).
- **Digitalna pozivnica:** izbor modela → izmena teksta (live preview) → **plaćanje 100%** → PDF na mejl. Evidencija u Sanity.
- **Fizička pozivnica:** vođeni konfigurator (papir/omot/pečat/zlatne ivice/pocepane ivice) → živa cena → **plaćanje 50% depozit online, ostatak pouzećem** → upsell popup.
- **Smart Inquiry** obrazac svuda (showcase, custom, Svet B, upsell).
- Svet B showcase → upit. SEO + i18n (sr+en).

**NIJE u obimu (launch):**
- ❌ Automatski multi-item cart + auto bundle popusti (popusti ručno preko upita).
- ❌ Online kupovina Svet B (showcase → upit).
- ❌ Konfigurisanje pozicije/fonta teksta (fiksno po modelu — kupac menja SAMO tekst).
- ❌ Mešanje digitalne + fizičke u jednom plaćanju.

## 6. PROIZVODI & FLOW-OVI

**Digitalna (standalone, samouslužna):** izbor modela → live text editor (samo tekst) → preview → plaćanje 100% → PDF na mejl → evidencija u Sanity.

**Fizička (samouslužna, vođena):** izbor modela → poluge → živa cena → depozit 50% (ostatak pouzećem) → evidencija + mejl → upsell.
- **Poluge cene:** papir (5 tipova), omot (koverat / paus / bez), pečat (bez / otisak + boja), zlatne ivice (da/ne), pocepane ivice (da/ne).

**Samo showcase (NIJE za kupovinu — upit/Instagram):** savijene pozivnice, pozivnica u flašici, custom dizajn („prilagodite baš vama"), i ceo Svet B.

## 7. SMART INQUIRY  (jedna reupotrebljiva komponenta)

„Pitajte nas" komponenta koja **zna koji proizvod/sliku je pokrenuo**. Na submit: (1) snima upit u Sanity (naziv + slika + poruka/kontakt) → trajna evidencija; (2) mejl vlasniku; (3) opcioni Instagram link.

> Instagram/Meta NE dozvoljava pre-punjenje DM-a (tekst/slika) preko linka — zato Smart Inquiry postiže isti cilj bez oslanjanja na IG. **NAPOMENA:** vlasnik je za jedinstvene komade (Svet B, custom vitrine) izabrao ČIST Instagram link umesto Smart Inquiry — `components/InquiryDialog.tsx` je zato sad neupotrebljen (kandidat za brisanje).

## 8. CENE

- Puna logika je bila u Excelu → prevedena u **Sanity config** (vlasnik menja cene bez koda).
- Poluge: baza po modelu + papir + omot + pečat + zlatne ivice + pocepane ivice + količinski nivoi.
- **Bezbednost:** finalni iznos se UVEK preračunava na serveru iz Sanity config-a — nikad se ne veruje browseru.
- Formula (potvrđena): `Kol × (papir + dodaci/kom + koverta + pečat) + (Kol<50 ? setupFee : 0) − popust(ručno)`. Dvostrana = +addonDoubleSided/kom (auto sa šablona). Digitalna = fiksna cena (`digitalPrice`, ista 1/2-strana).

## 9. BEZBEDNOSNA „VRATA" (spoljni inputi za čuvanje)

1. **Kontakt forma + svaki Smart Inquiry** → rate limit, validacija, sanitizacija, honeypot.
2. **Order/payment ruta** → rate limit, ključevi samo server-side, **preračun cene server-side**.
3. **Payment webhook** (kad dođe gateway) → verifikuj potpis/autentičnost.
4. **PDF ruta** → rate limit (skupa), validiraj/sanitizuj tekst koji ide u PDF.
5. **Sanity upisi (upiti/narudžbe)** → server-side token; nikad javni write token u browseru.

## 10. TIMELINE

- **Build kroz leto** (temeljito). **Launch januar** (i gotov MVP se NE pušta pre januara — vrhunac sezone + plaćene reklame; nov sistem usred sezone rizikuje prihod). Januar = kapacitet se oslobodi + slava linija (Svet B) kreće.
- Dug rok = dozvola da budemo temeljni, ne beskonačni. Interni checkpoint-i u `docs/ROADMAP-archive.md`.

## 11. KLJUČNE ODLUKE VLASNIKA (za pamćenje)

- **Nav = SAMO linkovi ka posebnim stranama.** Landing scroll-sekcije (O nama, Galerija, Kontakt, društveni dokaz) NISU u navu.
- **Plaćanje = uplata na račun** (ne kartični gateway — bez provizija/integracije, bez kartičnih podataka kroz sajt). Poziv na broj + IPS QR.
- **Jedinstveni komadi (Svet B, custom vitrine) → čist Instagram**, ne Smart Inquiry.
- **Zlatne ivice** = dodatak po komadu (cena u Sanity). **„Nešto posebno"** dugme = čist Instagram link.
- **Svi dizajni** mogu i štampano i digitalno (nema `type` na šablonu; kupčev izbor kroz `?tip=`).
- **Font strategija:** pozadinska SLIKA nosi svu umetnost (ukrasi, ručno crtana slova, fiksni tekst); sajt živim tekstom ispisuje SAMO editabilna polja. Zato ne treba 100+ fontova — samo fontovi editabilnih polja za ~20–30 kuriranih šablona; ostatak kataloga = „na upit".

## 12. PARKIRANE STRATEŠKE IDEJE (van prvobitnog plana)

- 💡 **Digitalni sajt venčanja + online RSVP + upravljanje gostima** (Q3–Q4) — svaki par uz štampanu pozivnicu dobija privatnu digitalnu stranu venčanja + online RSVP + živu listu gostiju, povezano QR-om. „Drugi motor" biznisa. Pun brief: `docs/ideja-wedding-website-rsvp.md`. Traži: auth para (magic-link) + prava baza (ne Sanity) + pravni sloj.
- 💡 **AI FAQ chatbot** — chat na sajtu koji odgovara iz vlasnikovog FAQ-a (Claude API preko HTTP, Haiku model, strog rate-limit + budžet-plafon, odgovara SAMO iz FAQ-a). Traži: Anthropic API nalog (NE claude.ai Pro) + FAQ sadržaj. Detalji u `docs/ROADMAP-archive.md`.
