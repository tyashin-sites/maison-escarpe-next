import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs';
import DeliveryReturns from '@/components/DeliveryReturns';
import RelatedProducts from '@/components/RelatedProducts';
import ReviewsSection from '@/components/ReviewsSection';
import ProductDetailClient from './ProductDetailClient';
import AttarFacts from '@/components/AttarFacts';
import { api, ApiError } from '@/lib/api';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { pageMetadata, SITE, siteUrl } from '@/lib/seo';
import { parseAttar, TIER_LABEL } from '@/lib/attar';
import type { ProductReviewsPayload, StoreInfo } from '@/lib/types';

/**
 * GSC merchant-listing fields for the baked Offer, from the SAME store facts
 * the "Delivery & returns" block displays. Absent facts → absent fields.
 */
function merchantListingFields(info?: StoreInfo): Record<string, unknown> {
  if (!info) return {};
  const out: Record<string, unknown> = {};
  const zones = (Array.isArray(info.shippingZones) ? info.shippingZones : [])
    .filter((z) => z && Array.isArray(z.countries) && z.countries.length > 0)
    .slice(0, 3);
  if (zones.length > 0) {
    out.shippingDetails = zones.map((z) => {
      const nums = (z.estimatedDays || '').match(/\d+/g);
      const min = nums ? parseInt(nums[0], 10) : NaN;
      const max = nums && nums.length > 1 ? parseInt(nums[1], 10) : min;
      return {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: ((typeof z.rate === 'number' && z.rate >= 0 ? z.rate : 0) / 100).toFixed(2),
          currency: info.currency || 'CAD',
        },
        shippingDestination: (z.countries ?? []).slice(0, 10).map((cc) => ({ '@type': 'DefinedRegion', addressCountry: cc })),
        ...(Number.isFinite(min) && Number.isFinite(max) && max >= min && max <= 90
          ? {
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                transitTime: { '@type': 'QuantitativeValue', minValue: min, maxValue: max, unitCode: 'DAY' },
              },
            }
          : {}),
      };
    });
  }
  const rp = info.returnPolicy;
  if (rp?.category === 'not-permitted') {
    out.hasMerchantReturnPolicy = {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: rp.applicableCountry || 'CA',
      returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
    };
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

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await api.getProducts({ limit: 100 });
    return (res.data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.getProduct(slug);
    const p = res.data;
    const facts = parseAttar(p.description);
    const title = p.seo?.metaTitle || `${p.name} — Oud Attar`;
    const description =
      p.seo?.metaDescription ||
      p.shortDescription ||
      (facts.story ? facts.story.slice(0, 160) : `${p.name}, an oil-based oud attar by ${SITE.name}.`);
    const img = p.seo?.ogImage || p.images.find((i) => i.isPrimary)?.url || p.images[0]?.url;
    return pageMetadata({ title, description, path: `/products/${slug}`, image: img });
  } catch {
    return { title: 'Attar' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    const res = await api.getProduct(slug);
    product = res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    console.error('[pdp]', err);
    notFound();
  }

  const currency = product.currency || 'CAD';
  const facts = parseAttar(product.description);

  let categoryName: string | undefined;
  let categorySlug: string | undefined;
  let reviewsPayload: ProductReviewsPayload | undefined;
  let storeInfo: StoreInfo | undefined;
  try {
    const [cRes, rRes, sRes] = await Promise.allSettled([
      api.getCategories(),
      api.getProductReviews(product._id, 1, 10),
      api.getStoreInfo(),
    ]);
    if (cRes.status === 'fulfilled' && product.categoryId) {
      const cat = (cRes.value.data ?? []).find((c) => c._id === product.categoryId);
      categoryName = cat?.name;
      categorySlug = cat?.slug;
    }
    if (rRes.status === 'fulfilled') reviewsPayload = rRes.value.data;
    if (sRes.status === 'fulfilled') storeInfo = sRes.value.data;
  } catch {
    /* non-fatal */
  }

  const reviewsEnabled = reviewsPayload?.enabled === true;
  const reviewStats =
    reviewsEnabled && typeof reviewsPayload?.stats?.averageRating === 'number' ? reviewsPayload.stats : undefined;
  const reviewList = Array.isArray(reviewsPayload?.reviews) ? reviewsPayload.reviews : [];

  // schema.org Product / Offer. Ratings are DATA-DRIVEN: emitted only when
  // review display is on and real published reviews exist.
  const inStock = product.trackInventory ? product.stock > 0 : true;
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: facts.story || product.shortDescription,
    image: product.images.map((i) => i.url).filter(Boolean),
    sku: product.sku || undefined,
    brand: { '@type': 'Brand', name: SITE.name },
    category: categoryName,
    offers: {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: currency,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: siteUrl(`/products/${product.slug}`),
      ...merchantListingFields(storeInfo),
    },
    ...(reviewStats && reviewStats.totalReviews > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(reviewStats.averageRating.toFixed(1)),
            reviewCount: reviewStats.totalReviews,
          },
          review: reviewList.slice(0, 3).map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.customerName },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            name: r.title || undefined,
            reviewBody: r.body,
            datePublished: r.createdAt,
          })),
        }
      : {}),
  };

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: 'The attars', href: '/products' },
    ...(categoryName && categorySlug ? [{ label: categoryName, href: getCategoryLandingHref(categorySlug) }] : []),
    { label: product.name },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <div className="container-x py-8 md:py-12">
          <Breadcrumbs crumbs={crumbs} />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <ProductDetailClient
              product={product}
              facts={facts}
              tierLabel={categorySlug ? TIER_LABEL[categorySlug] : categoryName}
            />
          </div>

          <AttarFacts facts={facts} />

          <div className="mx-auto mt-12 max-w-3xl">
            <DeliveryReturns />
          </div>

          <ReviewsSection productId={product._id} />
          <RelatedProducts slug={product.slug} currency={currency} />
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </div>
  );
}
