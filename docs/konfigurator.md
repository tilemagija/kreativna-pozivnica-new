# KONFIGURATOR — puna specifikacija (Faza 3, „Дизајнирајте сами" / /napravite-svoju)

> **NAJVAŽNIJI deo sajta. Mora da bude flawless.** Prošli pokušaj NIJE pukao na
> konkretnom tehničkom problemu — vlasnik i AI su danima **lutali u krug** tražeći
> pristup i izgubili volju. **Zato je ovaj dokument ODLUKA: pristup je zaključan
> ispod, NE re-litigirati.** Graditi tačno po ovome, korak po korak, verifikovati
> svaki korak uživo, ne izmišljati alternative.

Kontekst: pročitaj i `docs/cenovnik.md` (cene, formula, pravila količine). Cene su
već u Sanity (paperOption/envelopeOption liste + `pricing` singleton, seed ubačen).

---

## 1. ŠTA GRADIMO (iz vlasnikovih odgovora + skice)

Jedan ekran (leva strana = preview, desna = kontrole), pa checkout u 2 koraka.

**Levo:** veliki **PREVIEW** šablona. Kupac **klikom na tekst u preview-u menja tekst**
(inline). Menja SAMO sadržaj teksta — pozicija, font, veličina, boja su FIKSNI (kako
je vlasnik dizajnirao šablon, §14).

**Desno (kontrole), redom (skica):**
1. **Količina** — klik i unese broj.
2. **Vrsta papira** — meni papira; svaka opcija ima **sliku (svotč) + ime**, ne samo ime.
3. **Omot** — opcije: koverat / paus omot / bez. Ako izabere „koverat" → pojavljuje se
   **pod-meni sa ponudom koverti** (envelopeOption liste).
4. **Dodaci** — cepkane ivice, zlatne ivice (zlatni listići), zaobljeni uglovi.
5. **Pečat** — meni sa **bojama voska i otiscima/motivima, sa slikama**.
6. **Živa ukupna cena** — svaki dodatak/oduzimanje odmah menja total.
7. **Dugme „Želite nešto posebno? Javite se"** — otvara Smart Inquiry / Instagram
   (vidi §8; NAPOMENA: Meta ne dozvoljava prefill DM-a, pa ide Smart Inquiry popup
   koji čuva lead + nudi IG — potvrditi s vlasnikom da li baš to ili čist IG link).
8. **Checkout** dugme.

**Checkout (2 koraka):**
- Klik Checkout → **finalni preview** + **popup**: „Molimo vas proverite da li ste sve
  tačno uneli…" (potvrda).
- Potvrda → **drugi ekran**: kupac unosi podatke (ime, telefon, mejl, adresa za
  pouzeće) + vidi rezime (konfiguracija + ukupna cena + **50% depozit**, ostalo
  **pouzećem**, **rok isporuke 10 radnih dana**).
- Submit → narudžbina se čuva (Sanity) + **mejl vlasniku**. (Plaćanje depozita online =
  **Faza 5**; za sad narudžbina ide u status „pending_payment".)

Šablona: **20–30**, to su **slike** koje vlasnik postavlja. Mora template (ne samo
slika) da bi kupac menjao tekst.

---

## 2. ZAKLJUČANE ODLUKE (ne menjati bez jakog razloga)

1. **Preview = slika šablona + HTML/CSS tekst preko nje** (apsolutno pozicioniran,
   contentEditable). NE „bake" u sliku, NE canvas, NE server-render slike. Ovo je
   najjednostavnije, radi na telefonu, i lako je „1:1" sa dizajnom ako se poštuje §6.
2. **Sve mere (x, y, širina, veličina fonta) su u % širine preview-a** → potpuno
   responsive (isto na telefonu i desktopu).
3. **Fontovi: FIKSNA paleta web-fontova sa ćirilicom** (§6). Vlasnik dizajnira šablone
   **isključivo tim fontovima** da preview 1:1 odgovara. (Ovo je verovatno gde je pre
   „lutalo" — reši se jednom, fiksnom listom.)
4. **Preview NIJE print-fajl.** Sajt hvata: izbor šablona + tekst polja + konfiguraciju.
   Vlasnik iz toga štampa. (Ne pokušavamo da generišemo print-ready fajl sada — to je
   kasnije/opciono. Tako izbegavamo zamku „preview mora piksel-tačno kao štampa".)
5. **Cena se UVEK preračunava na serveru** iz `pricing` + izabranih opcija (§7/§17).
   Browser prikazuje živu cenu radi UX-a, ali checkout veruje samo serverskoj ceni.
6. **Plaćanje (50% depozit) = Faza 5.** Sada checkout hvata narudžbinu „pending_payment".

---

## 3. CMS MODEL (Sanity šeme koje treba napraviti)

### 3.1 `invitationTemplate` (lista dokumenata) — vlasnik dodaje modele
- `name` — localeString („Ime pozivnice")
- `category` — string (opciono: venčanje, krštenje, rođendan, slava…)
- `image` — **slika šablona BEZ teksta koji kupac menja** (pozadina/ilustracija sa
  praznim mestima). hotspot.
- `aspectRatio` — number (npr. 0.71 za A6 portret) ILI izračunati iz slike metadata.
- `textFields` — array of object `templateTextField`:
  - `key` — string (interni id, npr. „imena", „datum", „mesto")
  - `label` — localeString (šta kupac vidi, npr. „Имена")
  - `defaultText` — string (primer/placeholder koji stoji u preview-u)
  - `xPct`, `yPct` — number (pozicija gornjeg-levog ugla teksta, % širine/visine)
  - `widthPct` — number (širina tekst-boksa, % širine)
  - `fontKey` — string (iz FONT PALETE, §4)
  - `fontSizePct` — number (veličina fonta kao % širine preview-a → responsive)
  - `color` — string (hex)
  - `align` — string (left/center/right)
  - `lineHeight` — number (opciono, default 1.2)
  - `multiline` — bool
  - `maxLength` — number
- `active` — bool, `order` — number

### 3.2 Pečat — slike (proširiti postojeće)
Trenutno `pricing.sealColors` = samo stringovi. Dodati SLIKE:
- `sealMotif` (lista): `name` (localeString), `image` (otisak/motiv), `order`.
- `sealColor` (lista) ILI polje u pricing: `name` + `swatch` slika (boja voska).
  (Cene pečata ostaju u `pricing`: sealBase 40 / +zlatni listići 50 / +tatarika 70.)

### 3.3 `order` (lista dokumenata) — hvata narudžbinu
Read-only u Studiju (kao `inquiry`). Polja:
- `templateName` (string snapshot) + `templateRef` (reference, opciono)
- `textValues` — array {key, value} (kupčev tekst)
- `paper` {name, pricePerPiece} (snapshot), `wrapper` (koverat/paus/bez),
  `envelope` {name, pricePerPiece} (ako koverat)
- `seal` {motif, color} ili null, `sealAddon` (none/goldLeaf/tatarika)
- `addons` {tornEdges, goldEdges, roundedCorners} (bool)
- `quantity` (number)
- `computedTotal` (number, SERVERSKI), `deposit` (number, 50%)
- `customer` {name, phone, email, address}
- `status` — „pending_payment" | „deposit_paid" | „handled"
- `createdAt` (datetime), `note` (opciono)

### 3.4 Studio desk
Dodati: „Позивнице — шаблони" (invitationTemplate), „Печат — мотиви/боје",
„Наруџбине" (order, pored „Упити"). `invitationTemplate` NIJE singleton (lista).

---

## 4. FONT PALETA (fiksna, ćirilica) — vlasnik dizajnira SAMO ovim

Predlog (sve Google Fonts sa ćirilicom; potvrditi/proširiti s vlasnikom pri buildu):
- Cormorant Garamond (serif, već učitan)
- Lora (serif, već učitan)
- Marck Script (rukopis, već učitan)
- + dodati po potrebi: Playfair Display, EB Garamond, Neucha / Caveat (rukopis),
  Spectral, Philosopher.

Implementacija: `fontKey` → mapiranje na CSS `font-family` (učitane preko next/font).
**Pravilo za vlasnika:** kad pravi novi šablon, koristi isključivo ove fontove, i
upiše u CMS koji font/veličinu/poziciju je koristio za svako tekst-polje.

> Otvoreno pitanje za build: da li vlasniku dati i alat da vizuelno postavi polja
> (klik na preview da odredi x/y) umesto ručnog unosa % — LEPŠE ali više posla.
> Prva verzija: ručni unos %/izbor fonta u CMS-u; vizuelni editor kasnije (estetska faza — vidi DESIGN.md).

---

## 5. ŽIVI TEXT-PREVIEW (kako se gradi)

- Komponenta `TemplatePreview` (client): kontejner `position:relative`, širina = 100%
  dostupnog, `aspect-ratio` iz šablona. `next/image` šablona kao pozadina.
- Za svako `textField`: apsolutno pozicioniran element (`left:xPct%`, `top:yPct%`,
  `width:widthPct%`), `contentEditable`, `font-family` iz fontKey,
  `font-size: calc(fontSizePct% * širina)` (koristiti container-query ili JS resize da
  se dobije px iz % širine; ili `cqw` jedinice: `font-size: {fontSizePct}cqw` uz
  `container-type: inline-size`) → **cqw jedinice su najčistije rešenje za responsive
  font.**
- `maxLength` enforcement na input; `align`, `color`, `lineHeight` iz polja.
- Stanje teksta: `{ [key]: value }` u React state; init iz `defaultText`.
- „Klik menja tekst" = kupac klikne polje (fokus) i kuca. Placeholder = defaultText.

---

## 6. ŽIVA CENA (iz `pricing` + izbora)

```
poKomadu = paper.pricePerPiece
         + (wrapper == koverat ? envelope.pricePerPiece : wrapper == paus ? pausOmotCena : 0)
         + (seal ? sealCenaZaIzabraniAddon : 0)
         + (tornEdges ? 20 : 0) + (goldEdges ? ? : 0) + (roundedCorners ? 10 : 0)
Ukupno  = quantity * poKomadu
        + (quantity < pricing.minQuantity ? pricing.setupFee : 0)
        − popust (ručno, kasnije — polje postoji u pricing kao beleška)
Depozit = round(Ukupno * 0.5)
```
- „Zlatne ivice" iz skice = razjasniti s vlasnikom (verovatno = zlatni listići na
  ivicama; cena?). Cenovnik ima „zlatne listiće" uz pečat (+10 razlika). Potvrditi.
- „Paus omot" cena = 40 (iz cenovnika, envelopeOption „Паус омот"). Ako je omot
  odvojen od koverte u UI-u, mapirati na tu stavku.
- Server (`/api/order`) preračunava OVO iz Sanity — ne veruje browseru (§7).

---

## 7. SECURITY (§3/§18) — isto kao forma, plus

- `/api/order`: rate-limit (reuse `lib/rateLimit`), validacija+sanitizacija svih polja
  (reuse pristup iz `/api/inquiry`), honeypot na checkout formi.
- **Cena se preračunava na serveru** iz `pricing`+izbora; ignoriše se cena iz browsera.
- Sanity write preko `serverClient` (token samo na serveru).
- Mejl vlasniku preko `lib/email.ts` (Resend, već radi) — nova funkcija
  `sendOrderEmail`. Primalac = „Мејл за упите" iz siteSettings.
- Kasnije (Faza 5): webhook plaćanja verifikovati (potpis).

---

## 8. „NEŠTO POSEBNO" dugme

Reuse `InquiryDialog` (već postoji, §16 popup): otvara Smart Inquiry sa
`context = "Konfigurator — <ime šablona>"`, čuva u Sanity + mejl, nudi Instagram.
(Meta blokira prefill DM-a — zato Smart Inquiry, ne direktan „prefilled DM". Potvrditi
s vlasnikom; ako baš hoće čist IG link, samo `openLink(instagramUrl)`.)

---

## 9. CHECKOUT FLOW (detaljno)

1. Konfigurator ekran → dugme **Checkout** (aktivno kad su obavezna polja/izbori ok).
2. **Finalni preview** (isti TemplatePreview, read-only) + **popup potvrde**:
   „Molimo vas proverite da li ste sve tačno uneli. Nakon uplate menjamo tekst teško."
   Dugmad: „Nazad, da proverim" / „Sve je tačno, nastavi".
3. **Order forma** (drugi ekran/prozor): ime, telefon, mejl, adresa (pouzeće).
   Rezime: konfiguracija + ukupna cena + **50% depozit sada**, ostalo **pouzećem**,
   **rok 10 radnih dana**.
4. Submit → `/api/order` → preračun cene, snimi `order` (status „pending_payment"),
   `sendOrderEmail` vlasniku. Kupcu poruka hvala + „kontaktiraćemo za uplatu depozita".
5. **Faza 5** ubacuje realnu naplatu depozita (gateway) pre/na koraku 4.

---

## 10. REDOSLED GRADNJE (korak po korak, verifikovati svaki)

1. **CMS**: `invitationTemplate` (+ templateTextField), `sealMotif`/`sealColor`,
   `order` šeme + Studio desk. Build. (Bez UI-a.)
2. **Seed 1 test šablon** (kroz API ili ručno u Studiju) sa 2–3 tekst-polja, da ima
   na čemu da se gradi preview.
3. **`TemplatePreview`** komponenta (slika + editabilna polja, cqw font). Verifikovati
   inline editovanje + responsive (telefon/desktop).
4. **Konfigurator UI** (desni panel: količina, papir sa svotčevima, omot→koverat,
   dodaci, pečat sa slikama) + state.
5. **Živa cena** (klijent) + „nešto posebno" dugme (InquiryDialog).
6. **Checkout korak 1**: finalni preview + popup potvrde.
7. **Checkout korak 2**: order forma + `/api/order` (preračun, snimi, mejl) + security.
8. **`/napravite-svoju` stranica** povezuje sve; skloniti 404 (nav „Дизајнирајте сами").
9. Verifikacija end-to-end (kao forma: uneti test narudžbinu, videti u Studiju +
   mejl), pa obrisati test.
10. Plaćanje (50%) ostaje za **Fazu 5**.

---

## 11. OTVORENA PITANJA ZA VLASNIKA (pitati na početku builda, ne lutati posle)

1. **Font paleta** — potvrditi/dopuniti listu iz §4 (koje fontove koristiš za dizajn?).
2. **„Zlatne ivice"** iz skice — šta tačno + cena? (razlika od „zlatnih listića" uz pečat)
3. **„Omot"** — da li je „paus omot" zasebna opcija pored „koverat", i da li koverat
   pod-meni uključuje i paus? (mapiranje na envelopeOption stavke)
4. **„Nešto posebno" dugme** — Smart Inquiry popup (preporuka) ili čist Instagram link?
5. **Vizuelni editor polja u CMS-u** (klik na preview da postaviš x/y) — sada (više
   posla) ili kasnije (prva verzija = ručni unos %)? Preporuka: kasnije.
6. Da li checkout traži i **datum događaja / rok** od kupca (za planiranje isporuke)?
