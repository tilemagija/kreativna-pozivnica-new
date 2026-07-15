# Šta VLASNIK treba da uradi (checklist)

> Jedno mesto za sve što zavisi od tebe (nalozi, pravi podaci, sadržaj). Ništa od ovoga
> ja ne mogu umesto tebe. Podeljeno na: OBAVEZNO pre lansiranja · OPCIONO · SADRŽAJ (žena).

---

## 🔴 OBAVEZNO PRE LANSIRANJA (bez ovoga se ne pušta sajt)

- [ ] **Pravi podaci banke.** Studio → Подешавања сајта → „Уплата на рачун". Sad stoji
      PLACEHOLDER (`160-0000000123456-78`, Banca Intesa). Unesi pravi primalac / broj
      računa / banka / (model 00, šifra plaćanja 289 su default) / svrha uplate.
      Bez ovoga kupac dobija pogrešan račun za uplatu depozita.
- [ ] **Resend nalog + ključ (da mejlovi stižu).** Napravi nalog na resend.com → API Keys →
      napravi ključ. Unesi `RESEND_API_KEY` u Vercel (Project → Settings → Environment
      Variables) i u lokalni `.env.local`. Primalac mejla = „Мејл за упите" u Studiju.
      Bez ovoga: narudžba se snimi, ali ti NE stigne mejl.
      (Opciono kasnije: verifikuj svoj domen u Resend-u da mejl ide sa tvoje adrese, ne sa
      Resend test adrese koja šalje samo na tvoj Resend nalog.)
- [ ] **Obriši TEST podatke.** Pre launcha ukloni test šablone (`test-template`,
      `test-double`, `test-digital`), test kategorije, test „Додаци" stavke
      (`test-dodaci-1..4`) iz Studija, i placeholder banku.
- [ ] **Rotiraj Sanity write token.** `SANITY_API_WRITE_TOKEN` je bio u chatu → napravi
      NOV u sanity.io/manage (API → Tokens), zameni ga u Vercel + `.env.local`, stari obriši.

## 🟡 OPCIONO (nije blokira launch, ali korisno)

- [ ] **Google Sheet evidencija narudžbina.** Automatski upis svake narudžbe u tvoj Sheet
      (materijali po narudžbi + SUMIF za nabavku). Uputstvo (10 min): `docs/google-sheet-setup.md`.
      Bez ovoga sajt radi normalno (Sanity + mejl), samo nema tabele.
- [ ] **Zaštita alata `/template-tool` u produkciji.** Postavi env `TEMPLATE_TOOL_KEY` u
      Vercel, pa ga unesi u alat (localStorage). Dok se ne postavi, alat u produkciji NE
      može da snima (bezbedno po defaultu); lokalno radi slobodno.

## 🟢 SADRŽAJ — unosi ŽENA (kroz Studio, bez koda)

- [ ] **Pravi šabloni pozivnica.** Hi-res slika (Canva export ~300dpi) BEZ editabilnog
      teksta → Studio „Позивнице — шаблони" → nova → okači sliku → u `/template-tool`
      postavi polja. (Trenutni test-šablon je placeholder, samo za demo mehanike.)
- [ ] **Fontovi editabilnih polja.** Za svaki šablon potvrdi font (Google font ili tvoj
      custom fajl + licenca za web/PDF). Detalji: „FONT STRATEGIJA" u ROADMAP-u.
- [ ] **Pečat — motivi i boje.** Studio: „Печат — мотиви" i „Печат — боје" (sad prazno).
- [ ] **Papiri i koverte — svotčevi + cene.** Studio: liste papira/koverti (slika + cena/kom).

---

_Kad završiš neku stavku, samo je odčekiraj ovde. Ako nešto ne znaš gde je u Studiju — pitaj me._
