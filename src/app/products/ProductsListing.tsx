'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { api } from '@/lib/api';
import type { ApiCategory, ApiMeta, ApiProduct } from '@/lib/types';

interface Props {
  initialProducts: ApiProduct[];
  initialMeta: ApiMeta;
  categories: ApiCategory[];
  initialSearch: string;
  initialCategorySlug: string;
  initialSortBy: string;
  initialSortOrder: string;
  /** When set, the listing is locked to this collection (used by /category/[slug]). */
  fixedCategorySlug?: string;
}

const PAGE_SIZE = 60;

/**
 * Filter / sort / search + "load more" controller. The server renders page N
 * from the URL (crawlable pagination); this layers progressive enhancement.
 */
export default function ProductsListing({
  initialProducts,
  initialMeta,
  categories,
  initialSearch,
  initialCategorySlug,
  initialSortBy,
  initialSortOrder,
  fixedCategorySlug,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategorySlug = fixedCategorySlug || initialCategorySlug;

  const [products, setProducts] = useState<ApiProduct[]>(initialProducts);
  const [meta, setMeta] = useState<ApiMeta>(initialMeta);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [, startTransition] = useTransition();

  const lastKeyRef = useRef('');
  useEffect(() => {
    const key = JSON.stringify({ initialCategorySlug, initialSearch, initialSortBy, initialSortOrder });
    if (lastKeyRef.current && lastKeyRef.current !== key) {
      setProducts(initialProducts);
      setMeta(initialMeta);
    }
    lastKeyRef.current = key;
  }, [initialCategorySlug, initialSearch, initialSortBy, initialSortOrder, initialProducts, initialMeta]);

  const pushParams = (next: URLSearchParams) => {
    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (slug) next.set('category', slug);
    else next.delete('category');
    next.delete('categoryId');
    next.delete('page');
    pushParams(next);
  };

  const setSort = (value: string) => {
    const [by, order] = value.split('_');
    const next = new URLSearchParams(searchParams.toString());
    next.set('sortBy', by);
    next.set('sortOrder', order);
    next.delete('page');
    pushParams(next);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams.toString());
    const v = searchInput.trim();
    if (v) next.set('search', v);
    else next.delete('search');
    next.delete('page');
    pushParams(next);
  };

  const loadMore = async () => {
    if (loadingMore || meta.page >= meta.totalPages) return;
    setLoadingMore(true);
    try {
      const params: Record<string, string | number> = {
        limit: PAGE_SIZE,
        page: meta.page + 1,
        sortBy: initialSortBy,
        sortOrder: initialSortOrder,
      };
      if (initialSearch) params.search = initialSearch;
      if (activeCategorySlug) params.category = activeCategorySlug;
      const res = await api.getProducts(params);
      setProducts((prev) => [...prev, ...(res.data ?? [])]);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      console.error('[products] load more', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const pill = (active: boolean) =>
    `rounded-sm border px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors ${
      active ? 'border-ink bg-ink text-paper' : 'border-border text-muted-foreground hover:border-brass hover:text-ink'
    }`;

  return (
    <>
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {!fixedCategorySlug ? (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategory('')} className={pill(!activeCategorySlug)}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat._id} onClick={() => setCategory(cat.slug)} className={pill(activeCategorySlug === cat.slug)}>
                {cat.name}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <form onSubmit={submitSearch}>
            <input
              type="search"
              placeholder="Search"
              aria-label="Search attars"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="field w-44 py-2 text-sm"
            />
          </form>
          <select
            value={`${initialSortBy}_${initialSortOrder}`}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort"
            className="field w-auto py-2 text-sm"
          >
            <option value="createdAt_asc">House order</option>
            <option value="createdAt_desc">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name_asc">Name</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-2xl text-ink">Nothing here yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Try another collection or clear the search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} eager={i < 2} />
            ))}
          </div>
          {meta.page < meta.totalPages && (
            <div className="mt-12 text-center">
              <button onClick={loadMore} disabled={loadingMore} className="btn btn-ghost">
                {loadingMore ? 'Loading…' : 'Show more'}
              </button>
              {loadingMore && (
                <div className="mt-6">
                  <ProductGridSkeleton count={4} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
