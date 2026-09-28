# Phase 6 evidence — Lighthouse mobile (simulated 4G, local `next start` prod build)

## v2 cinematic — 2026-09-27 (evening)
| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 96 | 100 | 100 | 69* | 2.8 s | 0 | 0 ms |
| `/products/rampart` | 93 | 100 | 100 | 69* | 3.3 s | 0 | 0 ms |

\* SEO 69 = `is-crawlable` + `robots-txt` fail by design: the preview host is `noindex` until the customer's domain is live (ASSET-DEBT #15).

## v1 — 2026-09-27 (afternoon), superseded
Home 94 / PDP 90, a11y 100, CLS 0. v1 was a store wearing the palette; v2 rebuilt every chapter full-bleed, dropped card chrome, composited ONE master flacon across the catalog, pinned the ritual chapter, and added the brass cursor — and got faster doing it (hero preload + 100 KB WebP, project-scoped AVIF product images).
