import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { api } from '@/lib/api';
import { formatPriceExplicit } from '@/lib/format';
import { optimizedSrc } from '@/lib/img';
import type { RelatedProduct } from '@/lib/types';

/**
 * Server-rendered "Also from the house" grid on the PDP — every product page
 * links 6–8 siblings so no attar is a dead end (addendum §3e).
 *
 * NOTE: /products/:slug/related returns LIGHTWEIGHT items ({ id, name, slug,
 * price, thumbnailUrl, inStock }) — NOT the ApiProduct shape ProductCard
 * expects. Render a dedicated card.
 */
export default async function RelatedProducts({ slug, currency = 'CAD' }: { slug: string; currency?: string }) {
  let related: RelatedProduct[];
  try {
    const res = await api.getRelatedProducts(slug, 8);
    const raw: unknown = res.data;
    const list = Array.isArray(raw) ? raw : (raw as { products?: RelatedProduct[] } | null)?.products;
    if (!Array.isArray(list) || list.length === 0) return null;
    related = list.filter((p) => p && typeof p.slug === 'string' && typeof p.name === 'string');
  } catch {
    return null;
  }
  if (related.length === 0) return null;

  return (
    <section className="mt-20 md:mt-28">
      <SectionHeading eyebrow="Also from the house" title="Other attars to wear against it" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {related.slice(0, 8).map((p) => (
          <Link key={p.id ?? p.slug} href={`/products/${encodeURIComponent(p.slug)}`} className="card group overflow-hidden">
            <div className="media-frame aspect-[2/3]">
              {p.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimizedSrc(p.thumbnailUrl, 450)} alt={p.name} loading="lazy" width={450} height={675} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-dark">{p.name}</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg leading-tight text-ink">{p.name}</h3>
              {typeof p.price === 'number' && (
                <p className="tt-price mt-1.5 text-xs text-muted-foreground">from {formatPriceExplicit(p.price, currency)}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
