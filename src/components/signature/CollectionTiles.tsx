import Link from 'next/link';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { TIER_LINE } from '@/lib/attar';
import type { ApiCategory } from '@/lib/types';

const ORDER = ['signature', 'reserve', 'private-blend', 'discovery'];

/**
 * Collection tiles — stone slabs on paper. Reads the live category list so a
 * collection added in the admin appears here without a deploy.
 */
export default function CollectionTiles({ categories }: { categories: ApiCategory[] }) {
  const sorted = [...categories].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));
  if (sorted.length === 0) return null;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {sorted.map((cat, i) => (
        <Link
          key={cat._id}
          href={getCategoryLandingHref(cat.slug)}
          className="stone-card on-dark group flex min-h-[15rem] flex-col justify-between p-7"
          data-fx="rise"
          style={{ transitionDelay: `${i * 40}ms` }}
        >
          <span className="tt-caps text-[0.625rem] text-brass-soft">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-display text-2xl text-paper md:text-[1.75rem]">{cat.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-dark">
              {cat.description || TIER_LINE[cat.slug] || ''}
            </p>
            <span className="btn-link mt-6 text-[0.6875rem] text-brass-soft">Enter</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
