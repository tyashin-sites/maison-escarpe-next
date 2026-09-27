# Maison Escarpe — Build Plan (gated phases)

Every change names the KPI it serves; anything serving none is cut. Cutover to a real domain is user-gated.

| Phase | Deliverables | Exit gate (auditor lens) | Status |
|---|---|---|---|
| 0 Guardrails | Tyashin account + project (`escarpe-website`), CAD store, 4 collections, docs (BRAND / DESIGN-SPEC / ASSET-DEBT), public repo `tyashin-sites/maison-escarpe-next` | qa: facts ledger reviewed; no invented contact facts | done 2026-09-27 |
| 1 Design system | Tokens, type tiers, surfaces, buttons, a11y floor, motion core (gsap.ts, ScrollFX, PointerFX, HeaderFX), reduced-motion kill switch | design: anti-sameness vs Thridify/Knotty; contrast AA on paper + ink | done |
| 2 Core pages | Home (hero, strip, collections, featured, settle & wake, manifesto, provenance, list band), PLP, category, PDP (slots, wear scale, notes, ritual), about, contact, FAQ, journal, cart, reservation checkout, legal, 404 | brand: text budgets; one CTA per viewport; no ghost links; no orphans | done |
| 3 Catalog | 13 placeholder products with structured descriptions, 2 sizes each (3 ml / 12 ml), AI imagery in one photographic system, discovery set | qa: every product renders; JSON-LD Product valid; prices tiered as ASSET-DEBT #3 | done |
| 4 SEO/LLM surface | Per-page metadata, canonical = one host, `/sitemap-pages.xml`, FAQPage schema, `ROBOTS_NOINDEX=true` until cutover | seo: no split-brain host; noindex present on preview | done (noindex by design) |
| 5 Trust & compliance | FAQ (application, separation, shipping, allergens, returns), legal drafts, footer cautions, patch-test line, no longevity numbers | brand+legal: no unsubstantiated claims, no therapeutic language | done (drafts; counsel review owed) |
| 6 Perf & hardening | Prod build green; Lighthouse mobile ≥ 90; CLS 0; LCP transform-only; fonts subset | qa: `next build` clean; Lighthouse evidence in `audits/` | see audits/ |
| 7 Launch on slug subdomain | `/adopt`, CI green, live at escarpe-website.sites.tyashin.com, plugins installed (contact-form, chatbot disabled, blog) | qa: live smoke; registered in CUSTOMERS.md + safe-deploy | in progress |
| 8 Cutover (user-gated) | Customer confirms name + domains; real inputs replace ASSET-DEBT rows; domain connected; SEO Co-Pilot; `ROBOTS_NOINDEX=false` BUILD-time; Stripe | all four lenses GO | pending customer |
