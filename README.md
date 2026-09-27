# Maison Escarpe — Next.js storefront

Tyashin-managed Next.js (App Router) storefront for **Maison Escarpe**, a Canadian house of
oil-based oud attars (40% concentrate) launching from Burlington, Ontario and expanding to the
United States. Runs on Cloudflare Workers via OpenNext.

- Brand research + rationale: `docs/BRAND.md`
- Design system (single source of truth — deviations are bugs): `docs/DESIGN-SPEC.md`
- Build phases + audit gates: `docs/BUILD-PLAN.md`
- Placeholder inventory: `docs/ASSET-DEBT.md` — **every product, price, image and legal draft is
  a placeholder** until the customer supplies the real inputs.
- The site owns NO product data — the catalog lives in Tyashin and every page reads the public
  e-commerce API with `X-API-Key`. Structured attar facts (notes, oud, wear, season, batch) live as
  `Key: value` lines inside each product description and are parsed by `src/lib/attar.ts`.
- Deploy: push to `main` → GitHub Actions (installed by `POST /github/:projectId/adopt`). Never
  hand-edit `.github/workflows/deploy.yml`.
- `ROBOTS_NOINDEX` is `true` until the real domain is connected and the catalog is real.

Local dev: `npm install && npm run dev` (uses the production Tyashin API read-only; copy
`.env.example` to `.env.local` and set `TYASHIN_API_KEY`).
