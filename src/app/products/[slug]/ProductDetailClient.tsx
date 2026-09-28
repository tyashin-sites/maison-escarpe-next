'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, useStore, toast, toastError } from '@/components/Providers';
import WearScale from '@/components/WearScale';
import { formatPriceExplicit } from '@/lib/format';
import { optimizedSrc } from '@/lib/img';
import type { AttarFacts } from '@/lib/attar';
import type { ApiProduct } from '@/lib/types';

interface Props {
  product: ApiProduct;
  facts: AttarFacts;
  tierLabel?: string;
  sizeLabel: string;
}

/**
 * PDP — sticky full-height media on the left, the buy box on the right.
 * One size (30 ml) for now; variants render only if the admin adds them.
 * Structural slot markers (data-tyashin-slot / data-thridify-slot) are the
 * platform plugin contract and appear exactly once each (addendum §17).
 */
export default function ProductDetailClient({ product, facts, tierLabel, sizeLabel }: Props) {
  const { addToCart } = useCart();
  const { store } = useStore();
  const router = useRouter();

  const activeVariants = product.hasVariants ? product.variants.filter((v) => v.isActive) : [];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(activeVariants[0]?.id ?? null);
  const [adding, setAdding] = useState(false);

  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant && selectedVariant.price > 0 ? selectedVariant.price : product.price;
  const currency = store?.currency || product.currency || 'CAD';
  const inStock = product.trackInventory ? (selectedVariant ? selectedVariant.stock > 0 : product.stock > 0) : true;
  const img = product.images.find((i) => i.isPrimary) || product.images[0];
  const sku = product.sku || product.name;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, 1, selectedVariantId || undefined);
      toast.success(`${product.name} added`, { action: { label: 'View cart', onClick: () => router.push('/cart') } });
    } catch (err) {
      toastError(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-2">
      {/* Media column: gallery frame + viewer-tabs slot in ONE grid child. */}
      <div>
        <div className="pdp-media" data-tyashin-slot="product-gallery" data-thridify-page-product-id={sku}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={optimizedSrc(img.url, 1400)}
              srcSet={[800, 1100, 1400, 1800].map((w) => `${optimizedSrc(img.url, w)} ${w}w`).join(', ')}
              sizes="(max-width: 1023px) 100vw, 50vw"
              alt={img.alt || product.name}
              width={1024}
              height={1536}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-dark">No image yet</div>
          )}
        </div>
        <div data-thridify-slot="viewer-tabs" />
      </div>

      {/* Buy column */}
      <div className="px-[clamp(1.25rem,5vw,6rem)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(3rem,6vw,6rem)]">
        {tierLabel && <p className="eyebrow">{tierLabel}</p>}
        <h1 className="tt-1 mt-5 text-ink">{product.name}</h1>
        {(product.shortDescription || facts.story) && (
          <p className="lead mt-5 max-w-md" data-tyashin-slot="product-description">
            {product.shortDescription || facts.story.split('\n')[0]}
          </p>
        )}

        <div className="rule mt-10" aria-hidden />
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
          <span className="tt-price text-2xl text-ink">{formatPriceExplicit(displayPrice, currency)}</span>
          <span className="tt-caps text-muted-foreground">{selectedVariant?.name || sizeLabel} · numbered flacon</span>
        </div>
        {store?.taxName && store.taxRate ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {store.taxInclusive ? 'Taxes included.' : `Plus ${store.taxName} at checkout.`} Complimentary courier in Canada and the
            United States. All sales final once shipped.
          </p>
        ) : null}

        {activeVariants.length > 1 && (
          <div className="mt-8">
            <p className="field-label">Size</p>
            <div className="flex flex-wrap gap-2">
              {activeVariants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`border px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors ${
                    v.id === selectedVariantId ? 'border-ink bg-ink text-paper' : 'border-ink/25 text-ink hover:border-brass'
                  }`}
                  aria-pressed={v.id === selectedVariantId}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8" data-tyashin-slot="product-cta">
          <button onClick={handleAdd} disabled={adding || !inStock} className="btn btn-primary w-full">
            {!inStock ? 'Allocated — join the list' : adding ? 'Adding…' : 'Add to cart'}
          </button>
          {!inStock && (
            <Link href="/contact" className="btn-link mt-4 text-ink">
              Ask about the next batch
            </Link>
          )}
        </div>

        <div className="mt-12">
          <p className="field-label">Wear</p>
          <WearScale level={facts.wear} />
        </div>

        {(facts.top || facts.heart || facts.base) && (
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              ['Top', facts.top],
              ['Heart', facts.heart],
              ['Base', facts.base],
            ].map(([k, v]) =>
              v ? (
                <div key={k}>
                  <dt className="tt-caps text-brass-deep">{k}</dt>
                  <dd className="mt-2 font-display text-lg leading-snug text-ink">{v}</dd>
                </div>
              ) : null,
            )}
          </dl>
        )}

        {(facts.oud || facts.season || facts.batch) && (
          <>
            <div className="rule mt-12" aria-hidden />
            <dl className="mt-6 space-y-4">
              {[
                ['Oud', facts.oud],
                ['Season', facts.season],
                ['Batch', facts.batch],
              ].map(([k, v]) =>
                v ? (
                  <div key={k} className="grid grid-cols-[6rem_1fr] gap-4">
                    <dt className="tt-caps pt-0.5 text-muted-foreground">{k}</dt>
                    <dd className="text-sm text-ink/85">{v}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </>
        )}

        <div className="rule mt-12" aria-hidden />
        <ul className="mt-6 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <li>Forty percent concentrate in oil. No alcohol, no water.</li>
          <li>Natural resins settle. Shake gently before each wear.</li>
          <li>For external use only. Patch-test on the inner arm before first use.</li>
        </ul>
      </div>
    </div>
  );
}
