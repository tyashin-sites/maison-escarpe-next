/**
 * schema.org knowledge graph — addendum §3b. Every page ships ONE
 * `<script type="application/ld+json">` holding a single interlinked @graph:
 * Organization (Store) + WebSite site-wide, WebPage + BreadcrumbList per
 * route, and Product / BlogPosting / FAQPage / CollectionPage nodes where the
 * page has them. The platform edge injects a baseline idempotently by @type,
 * so declaring a type here is what stops a duplicate.
 *
 * Facts only: no address, phone, email, rating or founder is emitted because
 * none has been supplied (docs/ASSET-DEBT.md #7/#9/#10).
 */
import { SITE, siteUrl } from './seo';
import type { ApiProduct, BlogPost, StoreInfo } from './types';

const ORIGIN = siteUrl('/').replace(/\/+$/, '');
const ORG_ID = `${ORIGIN}/#organization`;
const SITE_ID = `${ORIGIN}/#website`;

export interface Crumb {
  label: string;
  href?: string;
}

export interface GraphInput {
  path: string;
  title: string;
  description: string;
  type?: 'WebPage' | 'CollectionPage' | 'ItemPage' | 'AboutPage' | 'ContactPage' | 'FAQPage';
  crumbs?: Crumb[];
  image?: string;
  product?: { product: ApiProduct; categoryName?: string; storeInfo?: StoreInfo; reviews?: { averageRating: number; totalReviews: number } };
  article?: BlogPost;
  faqs?: { question: string; answer: string }[];
  itemList?: { name: string; url: string; image?: string }[];
}

function organization() {
  return {
    '@type': 'Store',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: `${ORIGIN}/`,
    description: SITE.description,
    slogan: SITE.tagline,
    areaServed: [
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United States' },
    ],
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: 'ON', addressCountry: 'CA' },
    knowsAbout: ['oud', 'attar', 'oil-based perfume', 'agarwood', 'dehn al oud', 'mukhallat', 'niche fragrance', 'Niagara Escarpment'],
    image: `${ORIGIN}${SITE.defaultOgImage}`,
  };
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${ORIGIN}/`,
    name: SITE.name,
    inLanguage: 'en-CA',
    publisher: { '@id': ORG_ID },
  };
}

function shippingAndReturns(info?: StoreInfo): Record<string, unknown> {
  if (!info) return {};
  const out: Record<string, unknown> = {};
  const zones = (Array.isArray(info.shippingZones) ? info.shippingZones : [])
    .filter((z) => z && Array.isArray(z.countries) && z.countries.length > 0)
    .slice(0, 3);
  if (zones.length) {
    out.shippingDetails = zones.map((z) => {
      const nums = (z.estimatedDays || '').match(/\d+/g);
      const min = nums ? parseInt(nums[0], 10) : NaN;
      const max = nums && nums.length > 1 ? parseInt(nums[1], 10) : min;
      return {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: ((z.rate ?? 0) / 100).toFixed(2), currency: info.currency || 'CAD' },
        shippingDestination: (z.countries ?? []).slice(0, 10).map((cc) => ({ '@type': 'DefinedRegion', addressCountry: cc })),
        ...(Number.isFinite(min) && Number.isFinite(max) && max >= min && max <= 90
          ? { deliveryTime: { '@type': 'ShippingDeliveryTime', transitTime: { '@type': 'QuantitativeValue', minValue: min, maxValue: max, unitCode: 'DAY' } } }
          : {}),
      };
    });
  }
  const rp = info.returnPolicy;
  if (rp?.category === 'not-permitted') {
    out.hasMerchantReturnPolicy = { '@type': 'MerchantReturnPolicy', applicableCountry: rp.applicableCountry || 'CA', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' };
  } else if (rp?.category === 'finite' && rp.merchantReturnDays) {
    out.hasMerchantReturnPolicy = {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: rp.applicableCountry || 'CA',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: rp.merchantReturnDays,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: rp.returnFees === 'free' ? 'https://schema.org/FreeReturn' : 'https://schema.org/ReturnShippingFees',
    };
  }
  return out;
}

export function buildGraph(input: GraphInput): Record<string, unknown> {
  const pageUrl = siteUrl(input.path);
  const pageId = `${pageUrl}#webpage`;
  const nodes: Record<string, unknown>[] = [organization(), website()];

  const crumbs = input.crumbs ?? [];
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  if (crumbs.length > 0) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        ...(c.href ? { item: siteUrl(c.href) } : {}),
      })),
    });
  }

  const webpage: Record<string, unknown> = {
    '@type': input.type ?? 'WebPage',
    '@id': pageId,
    url: pageUrl,
    name: input.title,
    description: input.description,
    inLanguage: 'en-CA',
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    ...(input.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: input.image } } : {}),
    ...(crumbs.length > 0 ? { breadcrumb: { '@id': breadcrumbId } } : {}),
  };

  if (input.product) {
    const { product, categoryName, storeInfo, reviews } = input.product;
    const productId = `${pageUrl}#product`;
    const inStock = product.trackInventory ? product.stock > 0 : true;
    nodes.push({
      '@type': 'Product',
      '@id': productId,
      name: product.name,
      description: product.shortDescription || product.description?.split('\n')[0],
      image: (product.images ?? []).map((i) => i.url).filter(Boolean),
      sku: product.sku || undefined,
      brand: { '@id': ORG_ID },
      ...(categoryName ? { category: categoryName } : {}),
      offers: {
        '@type': 'Offer',
        price: (product.price / 100).toFixed(2),
        priceCurrency: product.currency || storeInfo?.currency || 'CAD',
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: pageUrl,
        seller: { '@id': ORG_ID },
        ...shippingAndReturns(storeInfo),
      },
      // Ratings are DATA-DRIVEN — only when the store displays real reviews.
      ...(reviews && reviews.totalReviews > 0
        ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: Number(reviews.averageRating.toFixed(1)), reviewCount: reviews.totalReviews } }
        : {}),
    });
    webpage.mainEntity = { '@id': productId };
  }

  if (input.article) {
    const a = input.article;
    const articleId = `${pageUrl}#article`;
    nodes.push({
      '@type': 'BlogPosting',
      '@id': articleId,
      headline: a.title,
      description: a.excerpt || undefined,
      image: a.featuredImage ? [a.featuredImage] : undefined,
      datePublished: a.publishedAt,
      dateModified: a.publishedAt,
      author: a.authorName ? { '@type': 'Person', name: a.authorName } : { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      mainEntityOfPage: { '@id': pageId },
      keywords: a.tags?.join(', ') || undefined,
      inLanguage: 'en-CA',
    });
  }

  if (input.faqs && input.faqs.length > 0) {
    webpage.mainEntity = input.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    }));
  }

  if (input.itemList && input.itemList.length > 0) {
    nodes.push({
      '@type': 'ItemList',
      '@id': `${pageUrl}#itemlist`,
      itemListElement: input.itemList.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url, ...(it.image ? { image: it.image } : {}) })),
    });
    webpage.mainEntity = { '@id': `${pageUrl}#itemlist` };
  }

  nodes.push(webpage);
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Serialise for a <script> tag — escapes `<`/`>` so a value can never break out. */
export function graphJson(graph: Record<string, unknown>): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}
