import type { Metadata } from 'next';
import { Bodoni_Moda, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import LegalFooterBar from '@/components/LegalFooterBar';
import { ScrollFX } from '@/components/motion/ScrollFX';
import { PointerFX } from '@/components/motion/PointerFX';
import { HeaderFX } from '@/components/motion/HeaderFX';
import { api } from '@/lib/api';
import { SITE, siteUrl } from '@/lib/seo';
import type { StoreInfo, ApiCategory } from '@/lib/types';

// Self-hosted, preloaded, swap (DESIGN-SPEC typography). Bodoni Moda carries
// the house voice at display sizes; Manrope is the quiet UI counterpart.
const display = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});
const body = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

/**
 * Brand kit + Tyashin runtime are intercepted by the Tyashin dispatch layer on
 * customer hosts; on direct *.workers.dev access they 404 and globals.css
 * carries the full token set anyway, so the site is always themed.
 */
// NOINDEX while the site lives on the platform slug subdomain (no SITE_DOMAIN
// at build time) or when explicitly asked. The catalog is placeholder until
// the customer signs off (docs/ASSET-DEBT.md #15) — a preview host must never
// be indexed. Flip by setting SITE_DOMAIN + ROBOTS_NOINDEX=false as BUILD-time
// env at cutover; a runtime var alone leaves prerendered pages unchanged.
const ROBOTS_NOINDEX = process.env.ROBOTS_NOINDEX === 'true' || !SITE.isCustomDomain;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title: {
    default: 'Maison Escarpe — Oil-Based Oud Attars, Composed in Canada',
    template: '%s · Maison Escarpe',
  },
  description: SITE.description,
  alternates: { canonical: siteUrl('/') },
  // Only the `robots` tag, deliberately: the platform edge strips the
  // robots+googlebot PAIR as a leftover-canary backstop, and would silently
  // un-noindex the preview host if both were emitted.
  robots: ROBOTS_NOINDEX ? { index: false, follow: false } : undefined,
  openGraph: {
    title: 'Maison Escarpe — Forty percent. Four hundred million years.',
    description: SITE.description,
    type: 'website',
    url: siteUrl('/'),
    siteName: SITE.name,
    locale: SITE.locale,
    images: [{ url: SITE.defaultOgImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison Escarpe — Oil-Based Oud Attars, Composed in Canada',
    description: SITE.description,
    images: [SITE.defaultOgImage],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // SSR-seed store info + categories so first paint shows correct currency
  // labels and the footer renders collections without a client round-trip.
  let initialStore: StoreInfo | null = null;
  let initialCategories: ApiCategory[] = [];
  try {
    const [s, c] = await Promise.all([api.getStoreInfo(), api.getCategories()]);
    initialStore = s.data;
    initialCategories = c.data ?? [];
  } catch (err) {
    console.error('[layout] seed fetch failed:', err);
  }

  return (
    // PERF: paint the paper ground on the very first frame (no white flash).
    <html lang="en-CA" className={`${display.variable} ${body.variable}`} style={{ backgroundColor: '#EDE6DA' }}>
      <head>
        {/* Brand kit is NOT linked here — Tyashin dispatch inlines it as a
            <style> on customer hosts; a <link> would re-add a render-blocking
            request AND suppress the platform inline. */}
        <link rel="alternate" type="application/rss+xml" title="Maison Escarpe Journal" href="/blog/rss.xml" />
        <link rel="preconnect" href="https://website-api.tyashin.com" />
        <script src="/tyashin-runtime.js" defer />
      </head>
      <body className="bg-background text-foreground antialiased overflow-x-clip" style={{ backgroundColor: '#EDE6DA' }}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="scroll-progress" aria-hidden />
        <Providers initialStore={initialStore} initialCategories={initialCategories}>
          {children}
          <LegalFooterBar />
        </Providers>
        <ScrollFX />
        <PointerFX />
        <HeaderFX />
      </body>
    </html>
  );
}
