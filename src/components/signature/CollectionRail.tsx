import Link from 'next/link';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { optimizedSrc } from '@/lib/img';
import { TIER_LINE } from '@/lib/attar';
import type { ApiCategory } from '@/lib/types';

const ORDER = ['signature', 'reserve', 'private-blend'];
const NUMERAL = ['I', 'II', 'III'];

/**
 * Chapter III — three walls, edge to edge. One attar's image stands for each
 * collection; the image reads first, the words come up on hover.
 */
export default function CollectionRail({ categories, images }: { categories: ApiCategory[]; images: Record<string, string | undefined> }) {
  const tiers = ORDER.map((slug) => categories.find((c) => c.slug === slug)).filter((c): c is ApiCategory => Boolean(c));
  if (tiers.length === 0) return null;
  return (
    <section aria-label="The collections" className="bg-ink">
      <div className="container-x on-dark py-[clamp(4rem,8vw,7rem)] text-paper">
        <p className="eyebrow">The collections</p>
        <h2 className="tt-1 mt-5 max-w-[16ch]" data-fx="words">
          Three walls, one oil.
        </h2>
      </div>
      <div className="rail">
        {tiers.map((cat, i) => {
          const img = images[cat.slug];
          return (
            <Link key={cat._id} href={getCategoryLandingHref(cat.slug)} className="rail-panel group">
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimizedSrc(img, 1000)} alt="" width={1000} height={1500} loading="lazy" />
              )}
              <div className="rail-copy">
                <p className="font-display text-lg text-brass-soft">{NUMERAL[i]}</p>
                <h3 className="mt-2 font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-none">{cat.name}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/75">{cat.description || TIER_LINE[cat.slug]}</p>
                <span className="btn-link rail-cta mt-6 text-paper">Enter</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
