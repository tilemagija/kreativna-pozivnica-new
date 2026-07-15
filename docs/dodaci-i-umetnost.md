# Spec — „Додаци" strana + World B „Уметност" nadogradnja

> Dogovorena logika (15.07). Graditi TAČNO po ovome, bez lutanja. Dve nezavisne celine.

---

## A) „Додаци" strana (World A — prateće stvari)

**Svrha:** informativna vitrina „radimo i ovo" (zahvalnice, pokloni za goste, table
dobrodošlice, kitke…) → galerija slika → dugme na Instagram. **Bez kategorija, bez cena,
bez checkout-a.**

- **Nav:** novi link **„Додаци"**, posle „Дизајнирајте сами" (World A grupa).
- **Ruta:** `/dodaci` (latinica u URL-u, ćirilica na strani).
- **CMS:**
  - `dodaciPage` (singleton): naslov (localeString) + uvodni tekst (localeText, sr+en) +
    tekst dugmeta (default „Јавите нам се"). IG link = REUSE `siteSettings` instagram.
  - `dodaciItem` (lista): `image` (+ alt za SEO) + opcioni `caption` (localeString) +
    `order` (broj). Bez cene/kategorije.
- **Izgled:** mozaik galerija (anti-template, kao landing). Bez lightbox-a (nije tražen).
- **Dugme:** „Јавите нам се" → Instagram, novi tab, `rel="noopener"`.
- **SEO:** metadata iz CMS-a, jedan `h1`, semantika, sr+en. Lagano (prateća strana).

**NE radimo:** kategorije, cene, kupovinu, inquiry formu. **Gotovo kad:** strana radi iz
CMS-a na oba jezika, mobilno bez horiz. skrola, dugme vodi na IG.

---

## B) World B — „Уметност" nadogradnja (`/umetnost` već postoji, Faza 2)

**Svrha:** bogatija vitrina verske umetnosti/poklona sa svojom estetikom. Pregled + okvirna
cena + kontakt preko Instagrama. **Bez checkout-a.**

**Odluke vlasnika (15.07):**
- **Kontakt = ČIST INSTAGRAM.** Dugme „Проверите доступност" vodi pravo na IG DM.
  ⚠️ Svesno odstupanje od §16 Smart Inquiry obrasca — vlasnik bira IG jer su radovi
  jedinstveni komadi („da li je baš ova slika slobodna" = prirodan DM razgovor). Lead se
  NE čuva; to je prihvaćeno za World B.
- **SEO = lightbox + strana po radu.** Svaki rad dobija indeksiranu adresu.

**CMS — nadograditi `artwork`:**
- postojeće: image(+alt), name, category (slava/art/frame/religious/other), description, order.
- DODATI: `slug` (za `/umetnost/[slug]`), `priceFrom` (broj — okvirna „од X дин"),
  `dimensions` (lista stringova, npr. „30×40 cm"), `frames` (lista: naziv + opciona slika okvira),
  opciono `gallery` (dodatni uglovi/detalji).

**Ponašanje:**
- `/umetnost` = galerija (mozaik, svoja estetika). Ispod slike: naziv + okvirna cena.
- Klik na sliku → **lightbox preko ekrana** (NE novi prozor, NE na hover): velika slika +
  opis + dimenzije + ponuđeni ramovi + okvirna cena + dugme „Проверите доступност" (IG).
  Escape/backdrop zatvara; pristupačno (role=dialog + focus trap — reuse checkout obrasca).
  Lightbox ima link „цела страна →" ka `/umetnost/[slug]`.
- `/umetnost/[slug]` = prava, server-renderovana strana po radu (za Google): jedinstven
  title/description, slika sa opisnim alt-om, dimenzije/ramovi/cena kao tekst, IG dugme.

**SEO (World B = organski rudnik, drugačija publika — slava/verski pokloni):**
- Svaki rad ima svoju adresu u `sitemap`-u → hvata duge pretrage („поклон за крсну славу"…).
- `generateMetadata` po radu (title = naziv + kategorija, description = opis).
- Strukturisani podaci schema.org (`CreativeWork`); cena kao „од X" (ne fiksni Offer, jer je okvirna).
- Slike: opisni alt (sr), next/image optimizacija, image-sitemap; radovi lazy-load.
- hreflang sr/en; sr je primaran (domaća publika).

**Estetika:** graditi STRUKTURU sada sa temom koja se lako preboji; tačan izgled
(boje/fontovi verske linije) zaključati u dizajn-prolazu (po mogućstvu sa ženom, kao Faza 6).

**NE radimo:** checkout, plaćanje, Smart Inquiry na World B, konfigurisanje. **Gotovo kad:**
galerija + lightbox + strana po radu rade iz CMS-a, cena/dimenzije/ramovi se prikazuju,
IG dugme radi, svaki rad indeksiran, mobilno čisto, sr+en.
