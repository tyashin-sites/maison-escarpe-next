'use client';

import Link from 'next/link';
import { useCategories, useStore } from './Providers';
import { formatPriceExplicit } from '@/lib/format';
import { optimizedSrc, imgSrcSet, PRODUCT_CARD_SIZES } from '@/lib/img';
import { fromPrice, parseAttar, tierOf, TIER_LABEL } from '@/lib/attar';
import type { ApiProduct } from '@/lib/types';

/**
 * Attar — editorial, chrome-free: the image, the name, one line, the price.
 * No border, no button. A flacon at this price is chosen on its own page.
 */
export default function ProductCard({ product, eager = false }: { product: ApiProduct; eager?: boolean }) {
  const { store } = useStore();
  const { categories } = useCategories();
  const image = product.images.find((i) => i.isPrimary) || product.images[0];
  const currency = store?.currency || product.currency || 'CAD';
  const facts = parseAttar(product.description);
  const tier = tierOf(product, categories);
  const href = `/products/${product.slug}`;
  const line = product.shortDescription || facts.story.split('\n')[0];

  return (
    <Link href={href} className="attar group" aria-label={product.name}>
      <div className="attar-media">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={optimizedSrc(image.url, 700)}
            srcSet={imgSrcSet(image.url, [400, 560, 700, 1000]) || undefined}
            sizes={PRODUCT_CARD_SIZES}
            alt={image.alt || product.name}
            width={700}
            height={1050}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-dark">{product.name}</div>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          {tier && <p className="tt-caps text-[0.625rem] text-brass-deep">{TIER_LABEL[tier] ?? tier}</p>}
          <h3 className="attar-name mt-1.5 text-ink">
            {product.name} <span className="attar-line" aria-hidden />
          </h3>
          {line && <p className="mt-2 line-clamp-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{line}</p>}
        </div>
        <p className="tt-price shrink-0 pt-5 text-xs text-ink/80">{formatPriceExplicit(fromPrice(product), currency)}</p>
      </div>
    </Link>
  );
}
