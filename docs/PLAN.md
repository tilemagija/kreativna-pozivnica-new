# PLAN — SVE ŠTO JE PREOSTALO (redosled do launcha i posle)

> Konsolidovan snapshot (06.08). Živi izvor stanja je `ROADMAP.md` „TRENUTNO STANJE";
> ovaj fajl je pregled celokupnog preostalog posla po redosledu. Launch cilj: **januar**.
> Sitnice/tell-ovi: `POLISH.md`. Izgled/tokeni: `DESIGN.md`. Vlasnik obaveze: `docs/vlasnik-todo.md`.

## Gde smo sada
Početna + `/pozivnice` + `/umetnost` + `/dodaci` u etno tonu. Funkcionalnost (konfigurator,
narudžbe, mejlovi, IPS QR, dvojezično, SEO baseline) kompletna. Konfigurator „Дизајнирајте
сами" — vizuelni revamp KRENUO (korak 1: filteri levo/uokvireni, širi grid, CMS „Тип").

---

## I. ZAVRŠETAK ESTETIKE (trenutna faza)
1. **Konfigurator „Дизајнирајте сами" — završiti revamp:** stil tabova PRINTED/DIGITAL + kartice
   dizajna u etno tonu (ram/senka/hover) + filter dugmad u panelu + fix mobilnog „flash" 3→1.
   (Kasnije faza: pojednostavljenje koraka + pouzdanost živog editora na mobilnom.)
2. **`/prilagodite`** u etno svet (zadnja „gola" strana).
3. **World A vez traka** (`HorizontB`) kao razdelnik na `/pozivnice`.
4. **World B** — redizajn verske/slava linije (`data-world="b"` hook postoji).
5. (opciono) **Utišati crvenu** u vezu → terakota, ako zasmeta pored zelene.
6. **Polish batch** (`POLISH.md`): logo-slika (čeka asset) · placeholder „Утисци" · brojač „2000+" ·
   hero kontrast/„vague hero" · provera svih dugmadi · cursive font mera · em-dash provera.

## II. SADRŽAJ I ASSETI (žena/vlasnik — može paralelno)
7. **Veliki vizuelni pass sa ženom** (ona vodi estetiku brenda).
8. **Hi-res asseti:** hero ≥1920px · ~8 fotki proizvoda · lotos logo (transparentno).
9. **Žena unosi CMS sadržaj:** galerije, radovi, šabloni, pečati, utisci, IG screenshot,
   + novi **„Типови позивница"** (oblik/dimenzija) i dodela šablonima.

## III. PRAVNO I POVERENJE (pre launcha)
10. **Strane „Политика приватности" + „Услови коришћења"** (napraviti — sajt uzima lične podatke/plaćanje).
11. **Prave metrike umesto placeholdera** (brojač/utisci: pravi podaci ili sklanjanje).

## IV. FAZA 4 — PDF POZIVNICE (blokirano)
12. **Digitalni PDF izvoz** pozivnica — čeka hi-res dizajne + fontove + odobrenje PDF paketa.

## V. PRED-LAUNCH KALJENJE
13. **Bezbednosni „bulletproof" pass** — svi spoljni inputi (forme, API rute, webhook, plaćanje):
    rate-limit, validacija, tajne samo server-side, cena preračunata na serveru.
14. **Pred-launch čeklista:** obriši test podatke (`test-*`) · rotiraj Sanity token · pravi podaci
    banke · Resend nalog (mejlovi) · upali Vercel Analytics · Viber/WhatsApp broj · prava digitalna cena.
15. **Svoj domen** (umesto `vercel.app`).

## ★ LAUNCH — januar

## VI. POSLE LAUNCHA / VEĆE OPKLADE
16. **Ozbiljan SEO** (kad je ceo stack gotov — sad je samo baseline): meta kampanje preko
    Claude Code + skilovi koje vlasnik ubaci · OG share slika · pun per-page hreflang.
17. **Instagram — Claude odgovara mušterijama preko MCP-a** (ZAMENA za raniji plan „AI FAQ chatbot
    na sajtu" — odustali). Eksperiment; čeka Anthropic nalog + MCP setup + **guardrails**
    (ljudsko odobrenje pre slanja poruke, limiti, bez auto-slanja bez pregleda).

---

## Odluke iz ovog dogovora (06.08)
- **FAQ chatbot na sajtu — ODUSTALI.** Umesto toga Instagram odgovaranje preko MCP-a (stavka 17).
- **SEO** ostaje baseline sad; ozbiljan SEO je zasebna faza POSLE celog stacka (stavka 16).
