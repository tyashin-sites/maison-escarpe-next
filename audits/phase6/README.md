# Phase 6 evidence — Lighthouse mobile (simulated 4G, local `next start` prod build, 2026-09-27)

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 94 | 100 | 100 | 69* | 3.1 s | 0 | 0 ms |
| `/products/rampart` | 90 | 100 | 100 | 69* | 3.7 s | 0 | 0 ms |

\* SEO 69 = `is-crawlable` fails by design: the preview host is `noindex` until the customer's domain is live (ASSET-DEBT #15).

Fixes that got here: AI product images re-hosted as project-scoped JPEGs so the platform optimizer serves 25–35 KB AVIF at `?w=450&f=auto` (the shared `ai-images/` path served 2.4 MB PNGs → LCP 15.8 s); WebP hero; products prerendered (`limit: 100` — the API rejects 200); brass-deep eyebrows for AA on paper; footer labels not headings; SplitText `aria: 'none'`.
