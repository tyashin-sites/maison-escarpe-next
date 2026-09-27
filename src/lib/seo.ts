// Single source of truth for Maison Escarpe's per-page <head> metadata and the
// handful of brand strings every surface shares (addendum §3 + §3c).
//
// JSON-LD (Product / BlogPosting / ItemList / BreadcrumbList + sitewide
// Organization / WebSite) is injected by the Tyashin platform edge at request
// time — do NOT hand-roll it here. THIS file owns the part the edge can't:
// per-page Open Graph / Twitter Card / canonical, all absolute via metadataBase.
import type { Metadata } from 'next';

const PROJECT_SLUG = process.env.PROJECT_SLUG || process.env.NEXT_PUBLIC_PROJECT_SLUG || 'escarpe-website';

/**
 * ONE canonical host. Until the customer's domain is connected this is the
 * platform slug subdomain (no www). Set SITE_DOMAIN (build env) to the real
 * apex once it is live and every canonical / OG / sitemap URL follows.
 */
const CUSTOM_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || process.env.SITE_DOMAIN || '';

export const SITE = {
  name: 'Maison Escarpe',
  shortName: 'Escarpe',
  tagline: 'Forty percent. Four hundred million years.',
  description:
    'Maison Escarpe is a Canadian house of oil-based oud attars at forty percent concentrate, composed in Burlington, Ontario. Shipping across Canada and the United States.',
  domain: CUSTOM_DOMAIN || `${PROJECT_SLUG}.sites.tyashin.com`,
  isCustomDomain: Boolean(CUSTOM_DOMAIN),
  defaultOgImage: '/og-default.jpg',
  locale: 'en_CA',
  twitter: '',
  // Place facts confirmed at intake. No street address, phone or email has
  // been supplied yet — never invent one (docs/ASSET-DEBT.md #7).
  city: 'Burlington',
  region: 'Ontario',
  country: 'Canada',
  concentration: '40%',
};

export function siteUrl(path = '/'): string {
  // Custom domains canonicalise on www; the platform subdomain has no www twin.
  const host = SITE.isCustomDomain ? `www.${SITE.domain}` : SITE.domain;
  const base = `https://${host}`;
  const p = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`;
  return `${base}${p}`;
}

/** Build a complete, absolute-URL Metadata object for one page. */
export function pageMetadata(opts: {
  title?: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = siteUrl(opts.path);
  const image = opts.image || SITE.defaultOgImage;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type || 'website',
      url,
      siteName: SITE.name,
      title: opts.title || SITE.name,
      description: opts.description,
      locale: SITE.locale,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title || SITE.name,
      description: opts.description,
      images: [image],
      ...(SITE.twitter ? { site: SITE.twitter, creator: SITE.twitter } : {}),
    },
  };
}
