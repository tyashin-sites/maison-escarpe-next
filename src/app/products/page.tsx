import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaginationNav from '@/components/PaginationNav';
import ProductsListing from './ProductsListing';
import { api } from '@/lib/api';
import { pageMetadata } from '@/lib/seo';
import type { ApiCategory, ApiProduct } from '@/lib/types';

export const metadata = pageMetadata({
  title: 'The Attars',
  description:
    'Every Maison Escarpe attar: oil-based oud at forty percent concentrate across the Signature, Reserve and Private Blend collections. Composed in Burlington, Ontario.',
  path: '/products',
});

interface SearchParams {
  category?: string;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
}

const PAGE_SIZE = 60;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const sortBy = sp.sortBy || 'createdAt';
  const sortOrder = sp.sortOrder || 'asc';
  const search = sp.search || '';
  const categorySlug = sp.category || '';
  const categoryId = sp.categoryId || '';
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  let initialProducts: ApiProduct[] = [];
  let initialMeta = { total: 0, page, limit: PAGE_SIZE, totalPages: 1 };
  let categories: ApiCategory[] = [];
  try {
    const params: Record<string, string | number> = { limit: PAGE_SIZE, page, sortBy, sortOrder };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    else if (categorySlug) params.category = categorySlug;
    const [pRes, cRes] = await Promise.all([api.getProducts(params), api.getCategories()]);
    initialProducts = pRes.data ?? [];
    initialMeta = pRes.meta ?? initialMeta;
    categories = cRes.data ?? [];
  } catch (err) {
    console.error('[products]', err);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-b border-brass/20 bg-paper">
          <div className="container-x py-14 md:py-20">
            <p className="eyebrow">The attars</p>
            <h1 className="tt-1 mt-5 max-w-3xl text-ink">One oil, worn twelve ways.</h1>
            <p className="lead mt-4 max-w-2xl">
              Every bottle is the same forty percent concentrate. Choose by the oud behind it, the season, and how
              far you want it to carry.
            </p>
          </div>
        </section>
        <section className="section pt-10 md:pt-14">
          <div className="container-x">
            <ProductsListing
              initialProducts={initialProducts}
              initialMeta={initialMeta}
              categories={categories}
              initialSearch={search}
              initialCategorySlug={categorySlug}
              initialSortBy={sortBy}
              initialSortOrder={sortOrder}
            />
            <PaginationNav
              currentPage={initialMeta.page}
              totalPages={initialMeta.totalPages}
              basePath="/products"
              params={{
                ...(search ? { search } : {}),
                ...(categorySlug ? { category: categorySlug } : {}),
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
