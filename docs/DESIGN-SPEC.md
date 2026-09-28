# Maison Escarpe — Design Spec (single source of truth; deviations are bugs)

## Thesis
**"Dolostone & Dusk" — v2, cinematic (2026-09-27).** The Niagara Escarpment at the last hour of light; oil the colour of the cliff face. v1 was a store wearing the palette; v2 is chapters: every home section is full-bleed, the product grid has no chrome, and ONE flacon appears in every image.
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
- **Display: Bodoni Moda** — weights 400/500 + italic. Hierarchy by size + space, weight ≤500 at display sizes. Display tier reaches 8rem on desktop; the numeral tier (the "40") reaches 20rem.
  Tracking `-0.02em` above 40px, `+0.02em` at small caps. Line-height ≥ 1.05 always. Old-style numerals for batch numbers.
- **Wordmark:** two-line lockup — `MAISON` (Manrope 500, 10px, tracking +0.32em) above `ESCARPE` (Bodoni Moda 500 small caps, tracking +0.22em) — never an image, never a crest.
- **UI/body: Manrope** 300–600 — nav 13px/`+0.14em` uppercase, body 16px/1.65, buttons 500 `+0.12em` uppercase, prices
  Manrope 500 `tabular-nums`.
- Scale: hero `clamp(2.9rem, 7vw, 6rem)`; section `clamp(1.9rem, 3.6vw, 3rem)`; PDP name `clamp(2rem, 4vw, 3.4rem)`; eyebrow 11px.
- **Text budgets (hard):** hero headline ≤ 8 words; hero sub ≤ 22; section intro ≤ 24; card blurb ≤ 14; product story line ≤ 16;
  manifesto paragraph ≤ 60; about paragraphs ≤ 80 each.

## Space, grid, surfaces
Section rhythm `clamp(5.5rem, 11vw, 9.5rem)`; container `max-w-7xl` (80rem) with `px-6 md:px-10`; product grid 2/3/4 cols (gap 16/24px).
Radius is **zero** everywhere: images bleed to hard edges, buttons and inputs are square (a stone edge, not a capsule). Product tiles carry no border, no background, no button.
Hairlines are 1px brass gradients fading both ways. Dark sections carry a 4% film-grain overlay; light sections none.

## Motion (tier 2 — GSAP system per tyashin-luxury-website; every effect obeys `prefers-reduced-motion`)
One ease `cubic-bezier(0.22, 1, 0.36, 1)` shared by CSS + GSAP ('brand' CustomEase). Durations micro 150 / ui 300 / reveal 900 / hero 1100.
**Signature moments (three — anti-sameness vs. the Thridify and Knotty builds):**
1. **Cinema hero** — 100svh full-bleed plate with the flacon on the ledge, a nine-second transform-only settle (LCP law), headline set over the image, scroll cue.
2. **The ritual, pinned** — the resin macro pins while three numbered lines light up in scroll order (scrubbed class toggles; unpinned on mobile / reduced motion).
3. **Brass cursor** — a dot with a lagging ring on fine pointers, growing over links; plus PointerFX spotlight on the remaining cards.
Plus rise + blur entrances at 88%, masked word reveals below the fold, header that starts transparent over dark heroes and becomes paper glass on scroll (height constant — CLS law), route rise-into-focus.
**Banned:** parallax > 0.2, cursor trails, scroll-jacking, bounce easings, autoplay video above the fold, rounded cards, bordered product tiles.

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


## Addendum compliance (tyashin-website §6 / nextjs-code-prompt.ts, checked 2026-09-27)
Followed: §1 server components by default · §3 `seo.ts` + per-page metadata · §3b ONE `@graph` per page via `src/lib/knowledge-graph.ts` (Store, WebSite, WebPage, BreadcrumbList, Product+Offer with data-driven ratings, BlogPosting, FAQPage, ItemList) · §3c one canonical host (slug subdomain until SITE_DOMAIN) · §3d/§3e no ghost links, no orphans (footer carries every collection + legal + FAQ + journal; PDP breadcrumb + related) · §3f attribution · §3g `/sitemap-pages.xml` from `site-routes.ts` · §3h no telemetry · §4 `generateStaticParams` · §7 loading states · §8 `error.tsx` · §9 `next/font` · §11 literal background on html/body, `overflow-x-clip` · §11b pure-CSS hero entrance, transform-only LCP · §13 Tailwind `primary/accent/background/surface/foreground/muted/border/radius/font-heading/font-body` → `var(--brand-*)` · §16 awaited params · §17 PDP slot markers exactly once.
Deliberate deviations (with reasons): **Tailwind v3** not v4 — the `tyashin-nextjs-port` scaffold rule for hand-built sites (the addendum's v4 `@import` is the generator's convention); **Header is a client component** — it needs the live cart count; the wordmark is TYPE by design (DESIGN-SPEC) and no logo exists in the brand kit, so `getBrandKit()` logo fetching would render nothing; **no `content/site.json`** — copy lives in components (hand-authored site, same as every ported storefront); **`<img>` through the platform optimizer** (`?w=&f=auto` AVIF) instead of `next/image`, per the port skill.
