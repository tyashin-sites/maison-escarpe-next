import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsListing from '@/app/products/ProductsListing';
import PaginationNav from '@/components/PaginationNav';
import { api, ApiError } from '@/lib/api';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { pageMetadata } from '@/lib/seo';
import { TIER_LINE } from '@/lib/attar';
import type { ApiCategory, ApiProduct } from '@/lib/types';

const PAGE_SIZE = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.getCategory(slug);
    const c = res.data;
    return pageMetadata({
      title: `${c.name} Collection`,
      description: c.description || `${c.name} — oil-based oud attars by Maison Escarpe.`,
      path: `/category/${slug}`,
      image: c.imageUrl || undefined,
    });
  } catch {
    return { title: 'Collection' };
  }
}

export default async function CategoryLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sortBy?: string; sortOrder?: string; search?: string; page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const sortBy = sp.sortBy || 'createdAt';
  const sortOrder = sp.sortOrder || 'asc';
  const search = sp.search || '';
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  let category: ApiCategory | null = null;
  let products: ApiProduct[] = [];
  let meta = { total: 0, page, limit: PAGE_SIZE, totalPages: 1 };
  let categories: ApiCategory[] = [];
  try {
    const [catRes, prodRes, catsRes] = await Promise.all([
      api.getCategory(slug),
      api.getProducts({ category: slug, limit: PAGE_SIZE, page, sortBy, sortOrder, ...(search ? { search } : {}) }),
      api.getCategories(),
    ]);
    category = catRes.data;
    products = prodRes.data ?? [];
    meta = prodRes.meta ?? meta;
    categories = catsRes.data ?? [];
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    console.error('[category]', err);
  }
  if (!category) notFound();

  const siblings = categories.filter((c) => c.slug !== slug);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-b border-brass/20 bg-paper">
          <div className="container-x py-14 md:py-20">
            <p className="eyebrow">Collection</p>
            <h1 className="tt-1 mt-5 text-ink">{category.name}</h1>
            <p className="lead mt-4 max-w-2xl">{category.description || TIER_LINE[slug] || ''}</p>
            {siblings.length > 0 && (
              <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="Other collections">
                {siblings.map((c) => (
                  <Link key={c._id} href={getCategoryLandingHref(c.slug)} className="nav-link">
                    {c.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </section>
        <section className="section pt-10 md:pt-14">
          <div className="container-x">
            <ProductsListing
              initialProducts={products}
              initialMeta={meta}
              categories={categories}
              initialSearch={search}
              initialCategorySlug={slug}
              initialSortBy={sortBy}
              initialSortOrder={sortOrder}
              fixedCategorySlug={slug}
            />
            <PaginationNav
              currentPage={meta.page}
              totalPages={meta.totalPages}
              basePath={`/category/${encodeURIComponent(slug)}`}
              params={{
                ...(search ? { search } : {}),
                ...(sp.sortBy ? { sortBy } : {}),
                ...(sp.sortOrder ? { sortOrder } : {}),
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
