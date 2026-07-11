# CLAUDE.md — Kreativna Pozivnica (Wedding Invitation & Art Website)

---

## HOW TO READ THIS FILE

This file has **two layers**:

- **LAYER 1 — UNIVERSAL STANDARDS.** My personal development standards. These are about *how I work* and *what quality means to me*, not about any one project. When I start a new project (e.g. the dispatch site), I copy Layer 1 **unchanged** and only rewrite Layer 2.
- **LAYER 2 — THIS PROJECT.** Everything specific to this website: what it does, the stack, folders, brand. This gets replaced per project.

> Note to the AI: I am a **no-code developer**. I do not read architecture natively. When you reference structure, patterns, or security, explain it in plain language, not just jargon.

---

# ======================================================
# LAYER 1 — UNIVERSAL STANDARDS  (copy to every project)
# ======================================================

## 1. WHO I AM / HOW I WORK

- I work in **"CEO mode"**: I define **WHAT** we build. You propose and implement **HOW**.
- I dislike back-and-forth. Give me a clear plan, then execute. Don't ask me to make technical micro-decisions I'm not equipped to make — recommend, and flag only the decisions that genuinely need me.
- I am non-technical. Explain the *why* simply. When you use a technical term that matters, add a one-line plain explanation.

## 2. WORKING PROCESS (hard rules)

- **Plan before acting** on any task that touches **3+ files**. State the plan, wait for my approval, then implement.
- **Build must pass before every push.** No exceptions.
- **One task = one commit** with a clear message.
- **Do NOT install new packages/dependencies without explicit approval.** Propose it, tell me why, wait.
- **Component size limit:** if a component passes **~200 lines**, that's a signal to split it. Flag it.
- **Scope discipline:** every work chunk gets an explicit **"what we are NOT doing"** and a **"done when..."** criterion, stated up front. This prevents scope creep inside one session.
- **Don't research well-documented, well-known tools.** If it's standard (Next.js, Sanity, common libraries), just use it — don't burn time/tokens researching what's already known.

## 3. SECURITY — THE MOST IMPORTANT PART  ⚠️

I do NOT know what a vulnerability looks like. That is YOUR job to surface, not mine to remember.
Security is not a feature you "add" — it is the **absence of open doors** in what we already build.

**Hard process rule — SURFACE THE HOLES:**
For every part of the app that takes input **from the outside world** — a form, an API route, the CMS, a file upload, a webhook, a payment step — you must, *before calling it done*:
1. List the possible ways it could be attacked or abused, **in plain language**.
2. Tell me the guard/limit you are putting in place for each.
3. If you left something unguarded, say so explicitly.

**Standing security rules (learned from a real incident — an unguarded input cost a client $50,000):**
- **Rate limiting:** any input that can be called many times (forms, API routes, webhooks) MUST have a limit, so no one can spam it thousands of times.
- **Secret keys / tokens / API keys are NEVER exposed in client-side code** (the code that gets sent to the browser). They stay server-side only.
- **Validate and sanitize** everything that comes from a user before it's used or stored.
- Focus the deep security attention on **real doors** (external inputs). A component that only *displays* content is not a door — don't turn every internal wall into a security audit and slow us to a crawl. Serious where input enters, light elsewhere.

## 4. CODE QUALITY HIERARCHY

My definition of "good code" is **engineering quality**, not cosmetics:
- A healthy, sane architecture. Good security. Clean, maintainable code a senior developer would look at and say *"this has a solid base, time was invested here."*
- Cosmetic polish (fancy hover effects, animations) is **NOT** what quality means to me. Those are secondary.

**Priority order, always:**
1. **Functionality that solves the real problem** — and this *includes* healthy architecture + security + clean code, because those ARE what make it work reliably.
2. **Cosmetic polish** comes only *after* functionality is done and working.

Never spend time on visual polish before the underlying functionality is complete and solid.

**Before adding ANY polish/animation effect**, apply an explicit test: *"Does this help the content / does this work well on mobile?"* If not, skip it. This prevents overengineering.

## 5. TECHNICAL PATTERNS (principles, apply to any project)

- **Styling from day 1:** use a design-token / utility-first system from the start. Never scatter inline styles ad-hoc and "fix it later" — that mess never gets fixed cleanly.
- **One repeatable interaction pattern:** define a single motion/animation (or equivalent interaction) pattern early and apply it everywhere. No per-component ad-hoc solutions.
- **Owner-editable content goes through the CMS/config ONLY. Never hardcode** content the owner needs to change himself into a component.

## 6. LAUNCH DISCIPLINE

- **Never deploy fake functionality.** A form or integration that looks like it works but does nothing real (e.g. just `console.log`) must never go to production.
- **Pre-launch checklist is mandatory:** before any launch, verify no placeholder/demo content remains in production.

## 7. LESSONS LEARNED  (living section — append as we go)

> When we make a mistake, add a one-line rule here so it never repeats. Keep it short.

- **Never trust a price sent from the browser.** Always recalculate the final amount on the server before charging — a user can edit what the browser sends.
- **Don't promise platform behavior we can't verify.** (E.g. Instagram cannot pre-fill a DM with text+image via a link — Meta blocks it. Check the platform limit before designing around it.)

---

# ======================================================
# LAYER 2 — THIS PROJECT  (Kreativna Pozivnica)
# ======================================================

## 8. WHAT THIS PROJECT IS

A **premium handmade wedding invitation & custom-art brand**. The business hand-illustrates each couple's real story — their church, themselves as a couple — so no identical invitation exists anywhere. That custom illustration is the core, uncopyable selling point. The brand has grown beyond invitations into **custom art & gifts** (framed illustrations, religious/slava gifts) — one post reached ~200,000 people organically.

**Primary goal of the site:** reduce the manual DM/messaging load on the owner's wife (currently the biggest time drain) by moving the catalog, self-serve product info, and inquiry intake onto the site — so customers self-serve instead of asking everything by message — AND convert an inquiry/visit into an order.

**Audience:** engaged couples (mostly 20–34), currently ~78% domestic (Serbia). Site must also serve the growing art/gifts audience.

## 8a. THE TWO WORLDS  (core architecture idea)

The brand is really **two worlds**, and the site must keep them clearly separated so visitors are not confused:

- **World A — Pozivnice (weddings).** Invitations (digital + physical), plus wedding stationery (envelopes, thank-you cards, drink menus, welcome signs). This world has "shop" logic: configure → price → buy.
- **World B — Umetnost & pokloni (art & gifts).** Framed illustrations, **slava (patron-saint) gifts**, frames, religious art. This is the brand's organic-reach magnet. For launch it is **showcase → inquiry** (no online buying yet). Per business timeline, the slava line is emphasized at the January launch.

## 9. STACK

- **Framework:** Next.js (App Router) + TypeScript
- **CMS / content:** Sanity
- **Styling:** Tailwind + design tokens — **single system.** (Note: the Budva project mixed styled-components + Tailwind; here we pick ONE — Tailwind + tokens — to avoid that mess.)
- **i18n:** next-intl — **Serbian Cyrillic (sr-Cyrl) as default + English (en).** (Already known from Budva.)
- **Motion:** framer-motion + lenis (smooth scroll). (Already known from Budva.)
- **Hosting:** Vercel

**New territory for me (never built in Budva — treat with extra care + plain explanations):**
- 💳 **Payment** (Serbian gateway — TBD)
- 📄 **PDF generation** (personalized digital invitations)
- ✉️ **Email sending** (owner notifications + customer delivery)
- 🛡️ **Rate limiting** (required by §3)
- ✅ **Input validation** (zod or similar)
- 🧩 **Live configurator / text editor**

> Stack is fixed. Do not propose alternative frameworks/CMS unless a hard technical blocker forces it — flag the blocker first.

## 10. FOLDER STRUCTURE  (proposed — mirrors the Budva project I already know)

```
/
├─ src/
│  ├─ app/
│  │  └─ [locale]/              # sr-Cyrl (default) + en  →  the language wrapper
│  │     ├─ page.tsx            # LANDING (single scroll: hero → gallery → "zašto baš mi" → kontakt)
│  │     ├─ napravite-svoju/    # CONFIGURATOR tab (digital + physical invitations)
│  │     ├─ kako-se-pravi/      # "How it's made" tab (embedded YouTube)
│  │     ├─ umetnost/           # WORLD B tab (art, slava gifts, frames) — showcase
│  │     └─ ...
│  ├─ app/api/                  # SERVER-ONLY routes: inquiry, payment, pdf, webhook
│  ├─ app/studio/              # Sanity Studio (where you & wife edit everything)
│  ├─ components/               # UI building blocks (each < ~200 lines)
│  ├─ lib/                      # helpers: sanity client, pricing, validation, rate-limit, email, pdf
│  ├─ sanity/                   # content schemas (models, pricing, gallery, inquiries, copy)
│  └─ tokens/ (or styles)       # design tokens (colors, fonts, spacing)
├─ messages/                    # translation strings (sr, en)
├─ public/                      # static assets + option swatch images (papers, seals, colors)
└─ config files                 # next.config, tailwind, tsconfig, .env.example
```

**Plain-language, what each folder does:**
- **app/[locale]/** — the actual pages people see, in both languages. `[locale]` is the wrapper that serves sr-Cyrl or en.
- **app/api/** — the "back office" code that runs on the server (never sent to the browser). Payment, PDF, saving inquiries, secret keys live here.
- **app/studio/** — the Sanity editor. This is where you and your wife change text, prices, gallery, models — without touching code.
- **components/** — reusable pieces (buttons, cards, the Smart Inquiry popup, the configurator steps).
- **lib/** — shared "engine" logic (calculating price, checking spam, sending mail).
- **sanity/** — the *shape* of your content (what a "model" or "price" or "inquiry" is made of).
- **messages/** — the words, translated.
- **public/** — pictures/files served as-is (e.g. the swatch photos for each paper/seal/color).

## 11. DESIGN TOKENS  ✅ derived from the official logo + package card (tune hex as needed)

Aesthetic: **warm, airy, editorial. Cream whitespace, antique-gold + sage accents, sepia-brown text (never pure black), gold-lotus motif as the signature.** Soft watercolor/aged-paper feel from the brand card, used sparingly.

**Colors (starter tokens — from logo & card):**
| Token | Hex | Use |
|---|---|---|
| `--c-cream` | `#F5EEE0` | primary background (warm ivory) |
| `--c-greige` | `#E7E0D0` | alternate section background (logo bg) |
| `--c-kraft` | `#E8D6BB` | vintage/aged accent background (the card), sparing |
| `--c-gold` | `#B7995A` | primary accent — lotus outline, wordmark, key lines |
| `--c-gold-deep` | `#927741` | gold hover / borders |
| `--c-sage` | `#9B9E76` | secondary accent — botanical, lotus petals |
| `--c-sage-deep` | `#797B54` | sage hover / darker botanical |
| `--c-terracotta` | `#C08A6A` | warm tertiary accent, very sparing (watercolor washes) |
| `--c-ink` | `#3D352A` | body text — warm deep brown, NOT black |
| `--c-ink-muted` | `#6C6049` | secondary text |
| `--c-line` | `#DCD1BB` | dividers / soft borders |

**Typography (all must have full Cyrillic support):**
- **Headings/display:** `Cormorant Garamond` — elegant roman serif matching the wordmark. Letter-spaced caps for titles.
- **Body/UI:** `Lora` — warm, readable serif with full Cyrillic. (Optional clean sans `Inter`/`Manrope` for tiny UI labels.)
- **Script accent:** `Marck Script` — an elegant connected cursive with **full Cyrillic support** (matches the handwritten line on the brand card). Use **sparingly, for decorative accents only** (short taglines, section flourishes), never for body/readable content. The logo wordmark itself stays a brand image asset.

**Motif:** the gold-outlined **lotus** is the signature. Use for: logo, section dividers, favicon, subtle watermark, seal-like accents. Keep sparse and premium — never busy.

**Rules:** lots of cream whitespace; gold + sage as *accents/lines*, not big fills; text is warm brown; watercolor/kraft textures only as occasional accents, not everywhere.

> These are starter values read from the logo + card. Per Layer 1, they live as tokens from day 1 — no inline styles.

## 11a. DESIGN DIRECTION & DIFFERENTIATION  (warm-rich, anti-template)

**Overall direction: WARM & RICH, not minimalist** (owner's call). Lean into texture, ornament, and layered detail so the site feels like a handmade, tactile artifact (paper, watercolor, gold) — not a clean SaaS page. Warmth over sparseness. (Rich ≠ cluttered — the §4 quality bar still holds.)

**Escape the "default AI-generated site" look.** There is a recognizable generic template aesthetic; we deliberately avoid it.
- ❌ **Avoid:** generic sans (Inter/system); everything centered; uniform rounded cards in tidy 3-col grids (the #1 tell); flat solid-only backgrounds; default buttons + generic drop shadows.
- ✅ **Do:** editorial / **asymmetric** layouts (offset text, images bleeding off-edge, varied rhythm); **gallery as a mosaic** (varied sizes / overlap), not a uniform grid; real **material texture** (paper/watercolor/kraft, subtle grain) on the warm cream base; **bespoke details** (gold-lotus dividers, gold-leaf accents, hand-torn edges, the signature intro "otvaranje" overlay, possibly a custom cursor); **typography-led** hierarchy (big serif + script accents, Cyrillic-first — our biggest differentiator, push it) with generous, irregular whitespace.

> Test for every section: *"Could a random AI template have produced this?"* If yes, add craft until the answer is no.

## 12. MOTION / INTERACTION PATTERN

One consistent, **subtle, premium** pattern (framer-motion + lenis): gentle fade/rise of sections on scroll, restrained. No flashy effects. Define once, apply everywhere. Polish only after functionality (Layer 1 §4).

**Intro / entry overlay — „otvaranje pozivnice" (signature interaction):** on load, the site opens with a full-screen cover that feels like a *closed invitation* (gold lotus + short prompt). The visitor clicks to "open" → the cover animates away → the hero is revealed. Deeply on-brand (the invitation literally opens). **Build in Phase 1 (batch 1.0), not before.**
- **Must-not-break rules (flag):** the real page content stays **server-rendered underneath** the overlay (so Google + SEO see the hero; the overlay is only a visual layer, never a gate that hides content from crawlers). Provide a **reduced-motion / accessibility fallback** (respect `prefers-reduced-motion`; keyboard-openable; never trap the user).
- **Decide at build time:** show once per session (cookie/localStorage) vs every visit; skippable; behavior on direct deep-links to other tabs (overlay only on landing, not on every page).

## 13. SEO STANDARDS (this site targets organic growth)

Every page must:
- Have proper metadata (title, description) driven from the CMS where possible.
- Use a correct heading hierarchy (one `h1` per page, logical `h2`/`h3`).
- Use semantic HTML (real `<nav>`, `<main>`, `<article>`, etc. — not `<div>` soup).
- Be fast and mobile-first (Core Web Vitals matter for ranking).
- Have descriptive, keyword-aware, human-readable URLs. **Use Latin slugs for URLs** (e.g. `/napravite-svoju`) even though on-page content is Cyrillic — cleaner + safer for links.
- Have correct **hreflang** (sr / en) so Google serves the right language.
- **World B (art/slava) is the organic magnet — give it especially strong SEO.**

## 14. SCOPE — WHAT WE BUILD, AND WHAT WE DON'T  (corrected)

> **CORRECTION to the original CLAUDE.md:** the original said checkout/payment is NOT in scope. That was an oversight. **Payment IS in scope and front-and-center.**

**IN SCOPE (launch):**
- Landing (hero + gallery + "zašto baš mi" + **testimonials / social proof** + contact form). Testimonials are Sanity-editable; exact placement/look TBD with owner (he has ideas).
- "Kako se pravi" page (YouTube embeds).
- **Digital invitation:** pick model → edit text (live preview) → **pay 100% online** → PDF emailed. Record kept in Sanity (as evidence, not an "active order").
- **Physical invitation:** guided configurator (paper / wrapper / seal / gold leaf / torn edges) → live price → **pay 50% deposit online, remainder cash-on-delivery** → upsell popup (Smart Inquiry for extras).
- **Smart Inquiry** pattern everywhere (showcase items, custom design, World B, upsell).
- World B showcase (art, slava gifts, frames) → Smart Inquiry.
- SEO + i18n (sr-Cyrl + en).

**NOT in scope (launch) — keep it simple:**
- ❌ Automatic multi-item cart + automatic bundle-discount engine. Discounts are handled **manually by the business** via the upsell Smart Inquiry. (Deliberately dropped to stay sane.)
- ❌ Buying World B items online (they are showcase → inquiry for now).
- ❌ Configuring text position / font (fixed per model — customer edits **text only**).
- ❌ Mixing digital + physical in one payment. Digital is its own standalone flow.

## 15. PRODUCTS & FLOWS  (the heart of the site)

**Digital invitation (standalone, self-serve):**
pick model → live text editor (text only; font/position fixed) → live preview → pay 100% → PDF to email → evidence saved in Sanity.

**Physical invitation (self-serve, guided):**
pick model → choose levers → live price → pay 50% deposit (rest COD) → order evidence + email → upsell popup.
- **Customer-selectable levers (drive the price):** paper (5 types), wrapper (envelope / paus wrap / none), seal (none / imprint + color), gold leaf (yes/no), hand-torn edges (yes/no).

**Showcase-only (NOT purchasable — Smart Inquiry):** folded invitations, scroll-in-a-bottle invitations, custom design ("prilagodite baš vama"), and all of World B.

## 16. SMART INQUIRY PATTERN  (one reusable component, used everywhere)

A single "Pitajte nas" component that **knows exactly which product/image triggered it**. On submit it:
1. **Saves the inquiry to Sanity** (product name + image + customer note/contact) → permanent evidence, nothing lost.
2. **Emails the owner** so they see it immediately.
3. Optionally offers a secondary **Instagram link** ("ili nam pišite na Instagram").

> Why not open Instagram DM pre-filled with the image + question? **Instagram/Meta does not allow pre-filling a DM (text or image) via a link.** The Smart Inquiry achieves the real goal ("inquiry references THAT specific product, and is saved") without depending on Instagram.

## 17. PRICING

- The full price logic already exists **in an Excel** owned by the business. It must be translated into **Sanity config** so the owner edits prices without code (Layer 1 §5).
- Price levers: base per model + paper + wrapper + seal + gold leaf + torn edges + quantity tiers.
- **Security:** the final charged amount is **always recomputed on the server** from Sanity config — never trusted from the browser (§7).

## 18. SECURITY DOORS (external inputs to guard — the "real doors")

1. **Contact form + every Smart Inquiry** → rate limit, validation, sanitize, honeypot/anti-spam.
2. **Payment init route** → rate limit, server-side keys only, **recompute price server-side**.
3. **Payment webhook** → verify signature/authenticity; never trust a raw callback.
4. **PDF generation route** → rate limit (it's expensive), validate/sanitize the text that goes into the PDF.
5. **Sanity writes (inquiries/orders)** → server-side token only; no public write token in the browser.

## 19. TIMELINE (business-driven)

- **Build: through summer (peak season).** We build thoroughly during this window.
- **Launch: January.** Even a finished MVP is NOT launched before January — peak wedding season with 50+ active inquiries and paid ad campaigns is running; introducing a new system mid-season would risk revenue and break momentum. January is when capacity frees up and the religious/slava product line (World B) launches.
- **Milestones:** the long runway is permission to be *thorough*, not endless. Internal checkpoints in ROADMAP.md keep "far deadline" from becoming "no deadline." Thorough — yes. Infinite polishing — no.

---
