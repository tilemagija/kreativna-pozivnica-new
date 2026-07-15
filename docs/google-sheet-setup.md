# Google Sheet evidencija narudžbina — uputstvo za vlasnika

Cilj: čim kupac naruči, red sa svim podacima (i **koliko komada materijala**) automatski
upadne u tvoj Google Sheet. Odatle SUMIF-om lako sabereš koliko papira/koverti da naručiš.

Ovo je **opciono** — ako ne podesiš, sajt radi normalno (narudžba se i dalje snima u Sanity
i šalje ti mejl). Sheet je samo dodatna, praktičnija evidencija.

---

## Korak 1 — napravi tabelu
1. Idi na https://sheets.google.com → **Blank / Празна**.
2. Nazovi je npr. „Наруџбине — материјал".
   (Ne moraš ništa da kucaš u nju — skript sam upiše naslove kolona kad stigne prva narudžba.)

## Korak 2 — dodaj skript
1. U toj tabeli: meni **Extensions → Apps Script** (Проширења → Apps Script).
2. Obriši sav tekst koji zatekneš i **nalepi ceo skript ispod**.
3. U prvom redu skripta zameni `PROMENI_OVU_LOZINKU` nekom svojom tajnom lozinkom
   (bilo koji niz slova/brojeva, npr. `pozivnice-2026-x9k`). **Zapamti je** — treba u Koraku 4.
4. Klikni **Save** (ikonica diskete).

```javascript
// === Kreativna pozivnica — prijem narudžbina u Google Sheet ===
var SECRET = "PROMENI_OVU_LOZINKU"; // MORA biti ista kao GOOGLE_SHEET_SECRET na sajtu

var HEADERS = [
  "Датум", "Број наруџбине", "Шаблон", "Купац", "Телефон", "Мејл",
  "Количина", "Двострана", "Папир", "Папир (ком)", "Омот", "Коверта",
  "Коверта (ком)", "Печат", "Цепкане ивице", "Златне ивице", "Заобљене",
  "Укупно (дин)", "Депозит (дин)", "Датум догађаја", "Адреса"
];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (String(body.secret || "") !== SECRET) {
      return json({ ok: false, error: "forbidden" });
    }
    var o = body.order || {};
    var c = o.customer || {};

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS); // upiši naslove jednom
    }

    sheet.appendRow([
      o.createdAt || "",
      o.orderNumber || "",
      o.templateName || "",
      c.name || "",
      c.phone || "",
      c.email || "",
      o.quantity || 0,
      o.doubleSided ? "да" : "не",
      o.paperName || "",
      o.quantity || 0,                                  // Папир (ком) = количина
      o.wrapper || "",
      o.envelopeName || "",
      o.wrapper === "koverat" ? (o.quantity || 0) : 0,  // Коверта (ком)
      o.sealSummary || "",
      o.tornEdges ? "да" : "не",
      o.goldEdges ? "да" : "не",
      o.roundedCorners ? "да" : "не",
      o.total || 0,
      o.deposit || 0,
      c.eventDate || "",
      c.address || ""
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Korak 3 — objavi skript (dobij adresu)
1. Gore desno: **Deploy → New deployment** (Постави → Ново постављање).
2. Kraj „Select type" klikni zupčanik → **Web app**.
3. Podesi:
   - **Execute as:** *Me* (ти).
   - **Who has access:** *Anyone* (Свако).
     — Ovo je bezbedno jer skript odbija svaki poziv bez tačne lozinke iz Koraka 2.
4. **Deploy** → Google će tražiti da odobriš pristup (svom nalogu) — odobri.
5. Kopiraj **Web app URL** (izgleda kao `https://script.google.com/macros/s/AKf.../exec`).

> Ako kasnije menjaš skript: **Deploy → Manage deployments → uredi (olovka) → Version: New → Deploy.**
> Tako URL ostaje isti. (Novi „New deployment" bi napravio NOVI URL.)

## Korak 4 — poveži sa sajtom
Dve vrednosti treba uneti na **dva mesta** (Vercel + lokalno):

| Ime | Vrednost |
|---|---|
| `GOOGLE_SHEET_WEBHOOK_URL` | Web app URL iz Koraka 3 |
| `GOOGLE_SHEET_SECRET` | lozinka koju si stavio u skript (Korak 2) |

- **Vercel:** Project → Settings → Environment Variables → dodaj obe → **Redeploy**.
- **Lokalno (za probu na kompjuteru):** upiši ih u fajl `.env.local`.

Gotovo. Sledeća narudžba upada u tabelu sama.

---

## Zbirni list za naručivanje materijala (SUMIF)
U drugom tabu (npr. „Материјал") napravi listu papira i saberi komade:

```
=SUMIF('Sheet1'!I:I; "Име папира"; 'Sheet1'!J:J)
```
- `I:I` = kolona **Папир**, `J:J` = kolona **Папир (ком)**.
- Za koverte: `=SUMIF('Sheet1'!L:L; "Име коверте"; 'Sheet1'!M:M)`.

(Ime taba „Sheet1" zameni stvarnim imenom prvog taba ako je drugačije.)

## Bezbednost (prosto)
- **Lozinka** čuva tabelu: bez tačne lozinke skript odbija upis, pa niko ne može da ti puni tabelu ni ako sazna adresu.
- Sajt diramo **samo tu jednu tabelu**, ne ceo Google nalog.
- Ako Sheet ikad zakaže, **narudžba se svejedno snimi** u Sanity i dobiješ mejl — nikad se ne izgubi.
