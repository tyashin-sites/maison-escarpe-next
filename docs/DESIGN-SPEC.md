# Maison Escarpe — Design Spec (single source of truth; deviations are bugs)

## Thesis
**"Dolostone & Dusk."** The Niagara Escarpment at the last hour of light; oil the colour of the cliff face.
Maison Escarpe is a Canadian house of oil-based oud attars at forty percent concentrate. The site must feel like
a wall you have been let inside of: warm-dark, mineral, unhurried, lit by one hard tungsten light. Luxury here is
derived from *place and time* (400-million-year-old rock, resin a tree spent decades making), not from royalty
(the Gulf black-gold-crest template) and not from Stockholm (the white-sans-cylinder DTC template).

**Anti-goals:** no pure `#000`, no gold foil on black, no crest or monogram shield, no centred grotesque label typography,
no kraft/typewriter/apothecary cues, no white-sweep product photography, no "hand-poured in small batches" cliché,
no countdown timers or discount starbursts, no fake reviews or invented longevity numbers, no autoplaying video with sound.

## Color system (tokens in `globals.css` as RAW HSL TRIPLES — never wrapped; CLAUDE.md §5)
| Token | Hex | HSL | Usage |
|---|---|---|---|
| `--ink` | `#14110F` | `24 14% 7%` | Page ground on dark sections, text on paper (~45% of surface) |
| `--stone` | `#2A2521` | `27 12% 15%` | Raised dark panels ("wet dolostone"), cards on ink |
| `--stone-light` | `#3B342E` | `28 12% 21%` | Borders/hairlines on ink, muted dark surfaces |
| `--paper` | `#EDE6DA` | `38 33% 89%` | Light ground ("limestone cream", ~40%), text on ink |
| `--paper-deep` | `#E2D9C9` | `39 30% 84%` | Tinted light bands, input backgrounds |
| `--brass` | `#B08D57` | `36 37% 52%` | The single accent metal: eyebrows, hairlines, prices, focus ring (<6%) |
| `--brass-soft` | `#CDB07F` | `38 43% 65%` | Brass on ink (AA), hover state |
| `--garnet` | `#6E1F1B` | `3 61% 27%` | Accent resin: rare — one element per viewport max (CTA hover, sale-free "reserve" badge) |
| `--muted` (light) | `#6B5F52` | `31 13% 37%` | Secondary text on paper (AA 6.1:1) |
| `--muted-dark` | `#A89C8C` | `34 15% 60%` | Secondary text on ink (AA 6.7:1) |

Shadows are ink-tinted, never gray: rest `0 1px 2px rgba(20,17,15,.08), 0 8px 24px rgba(20,17,15,.06)`; hover adds a brass glow
`0 16px 48px rgba(176,141,87,.14)`.

**FORBIDDEN:** `#000`/`#fff` surfaces; saturated red/green/blue; more than one brass element per card; gradients other than the
≤8% ink→stone wash and the aurora glow behind the hero object; garnet as text.

## Typography (Google Fonts via `next/font`, self-hosted)
- **Display: Bodoni Moda** (variable, `opsz` axis) — weights 400/500 + italic. Hierarchy by size + space, weight ≤500 at display sizes.
  Tracking `-0.02em` above 40px, `+0.02em` at small caps. Line-height ≥ 1.05 always. Old-style numerals for batch numbers.
- **Wordmark:** two-line lockup — `MAISON` (Manrope 500, 10px, tracking +0.32em) above `ESCARPE` (Bodoni Moda 500 small caps, tracking +0.22em) — never an image, never a crest.
- **UI/body: Manrope** 300–600 — nav 13px/`+0.14em` uppercase, body 16px/1.65, buttons 500 `+0.12em` uppercase, prices
  Manrope 500 `tabular-nums`.
- Scale: hero `clamp(2.9rem, 7vw, 6rem)`; section `clamp(1.9rem, 3.6vw, 3rem)`; PDP name `clamp(2rem, 4vw, 3.4rem)`; eyebrow 11px.
- **Text budgets (hard):** hero headline ≤ 8 words; hero sub ≤ 22; section intro ≤ 24; card blurb ≤ 14; product story line ≤ 16;
  manifesto paragraph ≤ 60; about paragraphs ≤ 80 each.

## Space, grid, surfaces
Section rhythm `clamp(5.5rem, 11vw, 9.5rem)`; container `max-w-7xl` (80rem) with `px-6 md:px-10`; product grid 2/3/4 cols (gap 16/24px).
Radius language is **architectural**: cards `0.375rem` (6px), buttons `2px` (near-square pill — a stone edge, not a capsule), inputs `4px`.
Hairlines are 1px brass gradients fading both ways. Dark sections carry a 4% film-grain overlay; light sections none.

## Motion (tier 2 — GSAP system per tyashin-luxury-website; every effect obeys `prefers-reduced-motion`)
One ease `cubic-bezier(0.22, 1, 0.36, 1)` shared by CSS + GSAP ('brand' CustomEase). Durations micro 150 / ui 300 / reveal 900 / hero 1100.
**Signature moments (exactly three — anti-sameness vs. the Thridify and Knotty builds):**
1. **Dusk aurora** — a slow (28s) brass/garnet radial drift behind the hero bottle, transform/opacity only, paused when off-screen.
2. **Settle & wake** — the below-fold "Shake to awaken" panel: an SVG bottle whose two oil layers mix as the visitor scrolls
   (ScrollTrigger scrub, transform-only), ending on the ritual line. Mobile: same, unpinned.
3. **Brass spotlight + magnetic reserve CTA** — PointerFX card spotlight tinted brass (13%), primary CTAs lean ≤5px. Fine pointers only.
Plus the standard entrances (rise + blur-settle at 88%, once), masked word reveal on the manifesto (below fold only), header
condense by logo scale (bar height constant — CLS law), route rise-into-focus.
**LCP law:** the hero h1 and hero image are never opacity-0; they animate transform-only.
**Banned:** parallax > 0.2, cursor followers with trails, scroll-jacking, bounce easings, autoplay video above the fold.

## Imagery
All launch imagery is **AI-generated placeholder** (gpt-image-2 via the platform) in one photographic system: tungsten 3200K raking key,
deep shadow retained, wet dolostone, smoked glass, unlacquered brass, black walnut, raw agarwood — **never** white sweeps, marble or
eucalyptus. Product images 2:3 portrait; hero 3:4 on mobile / 4:5 on desktop. Every image is tracked in `ASSET-DEBT.md` and is
replaced 1:1 by real photography before any paid push. No faces.

## Signature components
1. **Hero** — wordmark eyebrow, headline "Forty percent. Four hundred million years.", one lead sentence, two CTAs (Explore the
   attars / The house), hero bottle on stone with the dusk aurora behind it.
2. **Concentration strip** — four quiet facts with brass hairline columns: 40% concentrate · oil, no alcohol · composed in Ontario ·
   numbered batches. No invented statistics.
3. **Collection tiles** — Signature / Reserve / Private Blend as three stacked stone slabs with brass small-caps labels.
4. **Attar cards** — 2:3 image, name in Bodoni, one-line story, "from C$X" in Manrope tabular, tier tag.
5. **Settle & wake** — the ritual panel (signature motion #2).
6. **Manifesto band** — ink section, masked word reveal, one paragraph, one CTA.
7. **Provenance ledger** — table of oud regions the house works with (Assam, Cambodi, Trat, Borneo, Sri Lanka, Bangladesh) with
   character notes — editorial, not sales.
8. **Wear scale** — Intimate / Present / Commanding, used on every PDP instead of hours.
9. **Reservation** — because no payment gateway is configured yet, checkout renders a "Reserve your allocation" form (lead pipeline)
   instead of a dead payment step. The cart still works.

## Page blueprints (one intent per URL)
- `/` — persuade: hero → concentration strip → collections → featured attars (8) → settle & wake → manifesto → provenance ledger →
  journal teaser → reserve band.
- `/products`, `/category/[slug]` — browse: tier intro, filter row, grid, crawlable pagination.
- `/products/[slug]` — decide: gallery (slot markers), name/tier/story, price + size variants, wear scale, notes pyramid,
  ritual, add to cart / reserve, delivery & returns, reviews (gated), related.
- `/about` — trust: the house, the escarpment, the oil, the maker (no invented biography), the promise.
- `/faq` — platform FAQ + FAQPage schema. `/contact` — email form (lead pipeline). `/blog` — the Journal (index SSR; posts platform data).
- `/cart` CSR; `/checkout` CSR with the reservation fallback. Legal = platform-standard drafts.

## UX laws
One primary CTA per viewport; every link resolves (no `href="#"`); breadcrumbs on PDP; footer carries every collection, legal,
FAQ, journal; WCAG AA in every state (brass text only on ink ≥ 18px or as brass-soft; garnet never as text); 5-second test:
"Canadian oud attar house, oil-based, exclusive, explore" must land.

## Performance budget (design constraint)
Lighthouse mobile ≥ 90; CLS 0; LCP image `priority` + `sizes` + ≤ 180 KB; fonts latin subset, swap; GSAP loaded once;
home route JS ≤ 120 KB gz; no client JS for decoration that CSS can do. If an idea breaks the budget, the idea loses.
