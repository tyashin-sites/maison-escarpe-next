import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageFrame from '@/components/PageFrame';
import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs';
import DeliveryReturns from '@/components/DeliveryReturns';
import RelatedProducts from '@/components/RelatedProducts';
import ReviewsSection from '@/components/ReviewsSection';
import ProductDetailClient from './ProductDetailClient';
import AttarFacts from '@/components/AttarFacts';
import { api, ApiError } from '@/lib/api';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { pageMetadata, SITE } from '@/lib/seo';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { parseAttar, TIER_LABEL } from '@/lib/attar';
import type { ProductReviewsPayload, StoreInfo } from '@/lib/types';

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

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: 'The attars', href: '/products' },
    ...(categoryName && categorySlug ? [{ label: categoryName, href: getCategoryLandingHref(categorySlug) }] : []),
    { label: product.name },
  ];

  const isDiscovery = product.tags.some((t) => /discovery|sample/.test(t));

  return (
    <PageFrame>
      <div className="container-x pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <ProductDetailClient
        product={product}
        facts={facts}
        tierLabel={categorySlug ? TIER_LABEL[categorySlug] : categoryName}
        sizeLabel={isDiscovery ? '4 × 1 ml' : '30 ml'}
      />

      <AttarFacts facts={facts} />

      <div className="container-x py-[clamp(4rem,8vw,7rem)]">
        <div className="max-w-3xl">
          <DeliveryReturns />
        </div>
        <ReviewsSection productId={product._id} />
        <RelatedProducts slug={product.slug} currency={currency} />
      </div>
      <KnowledgeGraph
        path={`/products/${product.slug}`}
        type="ItemPage"
        title={product.name}
        description={product.shortDescription || facts.story.split('\n')[0]}
        image={product.images?.[0]?.url}
        crumbs={crumbs}
        product={{ product, categoryName, storeInfo, reviews: reviewStats ? { averageRating: reviewStats.averageRating, totalReviews: reviewStats.totalReviews } : undefined }}
      />
    </PageFrame>
  );
}
