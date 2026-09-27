'use client';

import Link from 'next/link';
import { useCategories, useStore } from './Providers';
import { formatPriceExplicit } from '@/lib/format';
import { optimizedSrc, imgSrcSet, PRODUCT_CARD_SIZES } from '@/lib/img';
import { fromPrice, parseAttar, tierOf, TIER_LABEL } from '@/lib/attar';
import type { ApiProduct } from '@/lib/types';

/**
 * Attar card — home, listing and category pages. Quiet by design: 2:3 image,
 * name in Bodoni, one-line story, "from C$X". No inline add-to-cart: an oil
 * at this price is chosen on its own page, not thrown in a basket from a grid.
 */
export default function ProductCard({ product, eager = false }: { product: ApiProduct; eager?: boolean }) {
  const { store } = useStore();
  const { categories } = useCategories();
  const image = product.images.find((i) => i.isPrimary) || product.images[0];
  const currency = store?.currency || product.currency || 'CAD';
  const facts = parseAttar(product.description);
  const tier = tierOf(product, categories);
  const price = fromPrice(product);
  const href = `/products/${product.slug}`;
  const storyLine = product.shortDescription || facts.story.split('\n')[0];

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={href} className="media-frame block aspect-[2/3]" aria-label={product.name}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={optimizedSrc(image.url, 600)}
            srcSet={imgSrcSet(image.url, [300, 450, 600, 900]) || undefined}
            sizes={PRODUCT_CARD_SIZES}
            alt={image.alt || product.name}
            width={600}
            height={900}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-dark">{product.name}</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {tier && <p className="tt-caps text-[0.625rem] text-brass">{TIER_LABEL[tier] ?? tier}</p>}
        <Link href={href} className="mt-2">
          <h3 className="font-display text-xl leading-tight text-ink transition-colors group-hover:text-stone md:text-[1.35rem]">
            {product.name}
          </h3>
        </Link>
        {storyLine && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{storyLine}</p>}
        <div className="mt-auto flex items-baseline justify-between pt-5">
          <span className="tt-price text-sm text-ink">
            {product.hasVariants ? 'from ' : ''}
            {formatPriceExplicit(price, currency)}
          </span>
          <span className="btn-link text-[0.6875rem] text-muted-foreground group-hover:text-ink">View</span>
        </div>
      </div>
    </article>
  );
}
