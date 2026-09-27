# Asset debt — placeholders awaiting real inputs

> Only a REAL asset clears a row. AI / drafted content never counts as done.
> Customer: **Maison Escarpe** (working brand name proposed by Tyashin/Claude on 2026-09-27 — see docs/BRAND.md).
> Confirmed real facts so far: the business is launching from **Burlington, Ontario**, expanding to the **United States**;
> products are **oil-based oud/attar perfumes at 40% oil concentration**; the brand asks customers to **shake before use**;
> positioning is above LV / D&G / Armani on exclusivity. **Everything else on this site is placeholder.**

| # | Placeholder | Real input needed | Blocks |
|---|---|---|---|
| 1 | Brand name **Maison Escarpe** (research-derived; maisonescarpe.com + .ca were both unregistered on 2026-09-27) | Customer sign-off + registration of maisonescarpe.com and maisonescarpe.ca + formal CIPO/USPTO Class 3 clearance | Domain cutover, trademark filing, any paid push |
| 2 | 13 products (12 attars + discovery set), names, notes, provenances, stories | Real formulas, real names, real oud sourcing (region, batch, year), IFRA certificates per formula at 40% | Catalog truthfulness |
| 3 | Prices (CAD ladder: Signature 12 ml C$495 / 3 ml C$145; Reserve C$695 / C$195; Private Blend C$1,150 / C$325; Discovery C$95) | Real cost-based price list; USD ladder for US launch | Any real order |
| 4 | All product, hero, about and OG imagery is AI-generated (gpt-image-2, one photographic system) | Real product photography of the actual bottle + packaging | Brand launch quality bar; catalog truthfulness |
| 5 | No payment gateway (`paymentGateway: none`); checkout renders a **reservation request** (contact-form lead) instead of payment | Stripe account (CAD, later USD) keys + decision on Shopify Pay / PayPal | Online card payments |
| 6 | Shipping zones set to "complimentary courier" CA + US at C$0 with 2–5 / 3–7 day estimates | Real courier rates, DDP duties policy for US (post de-minimis), flash-point test per formula (hazmat classification) | Checkout accuracy, US shipping |
| 7 | Business email / phone / registered address absent from the site (only "Burlington, Ontario" is shown) | Real contact email, phone, business address, legal entity name | Contact page, schema.org, legal pages, MoCRA US contact on label |
| 8 | Tyashin account provisioned by the agency (login hello@maisonescarpe.com — an unregistered domain, so nobody can receive its mail; password in the agency handover) | Customer's real email on the account (change in Settings → Profile) | Account handover, password resets |
| 9 | About page written from research (the escarpment, the oil) with no founder biography | Founder story, names, photo (if they want to be shown) | Deeper About content |
| 10 | No testimonials / critic quotes shown (No-Faking) | Real customer reviews (platform review flow) and named critic quotes with permission | Social-proof sections |
| 11 | Longevity copy uses design-intent language ("built to stay") and a wear scale, never test numbers | Logged wear tests (dates, testers, method) to substantiate "days on fabric / survives a wash" — required by Competition Bureau + FTC substantiation rules | Any quantified longevity claim |
| 12 | Legal pages are drafted templates (T&C, Privacy under PIPEDA/CCPA language, Return policy: final sale on opened oil, 14-day unopened returns) | Counsel review | Go-live on the real domain |
| 13 | FAQ answers drafted from research (application, separation, shipping, allergens) | Customer confirmation of every operational fact | Chatbot training accuracy |
| 14 | Regulatory: Health Canada Cosmetic Notification, bilingual INCI outer label, allergen disclosure (SOR/2024-63), CITES paperwork for Aquilaria oil, MoCRA responsible-person contact | Customer's regulatory consultant | Selling a single bottle legally |
| 15 | `ROBOTS_NOINDEX=true` on the preview subdomain (placeholder catalog must not be indexed) | Real domain connected + catalog confirmed real → rebuild with `ROBOTS_NOINDEX=false` | Organic search |
| 16 | SEO Co-Pilot not installed (platform 412 guard: needs a verified custom domain) | Domain verified → install + `config.phone` | Sitemap/llms.txt/schema injection |
| 17 | Chatbot installed on the free tier but **disabled** (opt-in rule) | Customer flips it on after reviewing answers | On-site assistant |
| 18 | Instagram / social handles not set (no @maisonescarpe checked beyond whois) | Customer registers handles | Footer social links, schema `sameAs` |
| 19 | Bottle format assumed to be a **12 ml atomiser** (the brief says "shake … get sprayed well"); 3 ml vials and 1 ml discovery vials assumed | Real packaging spec (atomiser vs dabber, sizes) | Product copy, imagery |

## Go-live checklist (in order)
1. Customer signs off on the name (or picks a backup: **Aurumbre** — aurumbre.com + .ca were also free on 2026-09-27) and registers the domains.
2. Replace rows 2–4 and 7 with real inputs; re-shoot imagery.
3. Connect maisonescarpe.com + www on the platform (two `POST /domains/:projectId` calls), point DNS, wait for `active`.
4. Install SEO Co-Pilot (free tier) with the real phone; rebuild with `ROBOTS_NOINDEX=false` as a BUILD-time env.
5. Configure Stripe (test mode first) and disable the reservation fallback by enabling a payment method — the checkout switches automatically.
