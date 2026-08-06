# POLISH.md — sitnice / dorada (batch kad se estetika slegne)

> Radni spisak sitnih dorada i „tell-ova". Ne dirati usput — batch-uje se u polish fazi.

---

## AUDIT: „20 znakova da je app vibe-coded" (vlasnik doneo listu, 05.08)

> Vlasnik je tražio da iz liste od 20 izvučem koje se odnose na NAS. Ovo je samo evidencija
> (šta postoji), NE plan popravke — plan pravimo kad vlasnik kaže „šta treba da se sredi".

### ✅ Odnosi se na nas (potvrđeno)
- **#1 vercel.app URL** — sajt živi na `kreativna-pozivnica-new.vercel.app`, nema svog domena (pre-launch obaveza vlasnika).
- **#4 fake/placeholder reviews** — „Утисци" sekcija stoji na placeholderima dok vlasnik ne uploaduje prave (Studio → Почетна → „5 · Постаните део приче").
- **#8 text-only logo** — navbar nema logo-sliku (čeka brend asset: lotos transparentno). Već u DESIGN backlogu.
- **#11 no privacy policy** — nema strane politike privatnosti (a sajt uzima lične podatke kroz narudžbe/forme).
- **#12 no T&C's** — nema uslova korišćenja/prodaje (a naplaćuje se).
- **#18 cursive font** — Marck Script se koristi kao akcenat (kickeri/taglineovi). Na listi je; treba proveriti da nije preterano.

### 🟡 Delimično / za proveru (postoji, zavisi od upotrebe)
- **#13/14/15 fake metrics** — animirani count-up brojač „2000+" na početnoj (`SocialProof` → `Counter`, default `counterTarget=2000`). Čita se kao izmišljena statistika ako broj nije realan i pošteno označen. CMS-povezano (`counterTarget/Label`), vlasnik da postavi pravu vrednost ili da se skloni.
- **#3 ai slop photos** — dekorativne vez trake (`HorizontB/vertikalnaB/pozadinaB`) su AI-generisane teksture; + „ФОТОГРАФИЈА УСКОРО" placeholder pločice u „Наше услуге" dok vlasnik ne ubaci prave.
- **#6 scroll animations** — `Reveal` (fade/rise) + Lenis + count-up svuda. Namerno/suptilno (jedan obrazac), ali tehnički jeste „scroll animations" sa liste.

### ⚪ Treba brz pogled kasnije (nije potvrđeno)
- **#5 broken buttons** — proveriti da svi linkovi/dugmad rade (audit pre demoa/launcha).
- **#10 hero text colour** — proveriti kontrast/čitljivost teksta preko hero slike.
- **#17 vague hero** — da li hero jasno kaže ŠTA nudimo (ne samo slika + tagline).
- **#20 em dashes** — proveriti da copy ne zloupotrebljava crtice (AI tell).

### ❌ Ne odnosi se na nas
- #2 purple gradient (paleta je etno papirus/zelena/zlato) · #7 one-page site (imamo više strana) · #9 no favicon (ima `favicon.ico`) · #16 emoji icons (nema emoji ikonica) · #19 lovable tag (ne koristimo Lovable).

---

## Backlog sitnica
> (Detaljan UI/UX backlog je u `DESIGN.md` → „BACKLOG SITNICA". Ovde se sliva ostalo.)
- Mobilni „flash" 3→1 kolone u `MasonryInfinite` (SSR default 3 kolone, na mount se koriguje).
