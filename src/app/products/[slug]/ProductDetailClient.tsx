'use client';

import { useMemo, useState } from 'react';
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
}

/**
 * PDP interactive half: gallery + buy box. Structural slot markers
 * (data-tyashin-slot / data-thridify-slot) are the platform plugin contract
 * and must appear exactly once each (addendum §17).
 */
export default function ProductDetailClient({ product, facts, tierLabel }: Props) {
  const { addToCart } = useCart();
  const { store } = useStore();
  const router = useRouter();

  const activeVariants = product.hasVariants ? product.variants.filter((v) => v.isActive) : [];
  // Default to the hero size (12 ml) when present, else the first active variant.
  const initialVariantId =
    activeVariants.find((v) => /12\s*ml/i.test(v.name))?.id ?? activeVariants[0]?.id ?? null;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(initialVariantId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant && selectedVariant.price > 0 ? selectedVariant.price : product.price;
  const currency = store?.currency || product.currency || 'CAD';
  const inStock = product.trackInventory ? (selectedVariant ? selectedVariant.stock > 0 : product.stock > 0) : true;

  const optionGroups = useMemo(() => {
    if (activeVariants.length === 0) return {} as Record<string, string[]>;
    const keys = Object.keys(activeVariants[0].attributes || {});
    const out: Record<string, string[]> = {};
    for (const k of keys) out[k] = [...new Set(activeVariants.map((v) => v.attributes[k]))];
    return out;
  }, [activeVariants]);

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, 1, selectedVariantId || undefined);
      toast.success(`${product.name}${selectedVariant ? ` · ${selectedVariant.name}` : ''} added`, {
        action: { label: 'View cart', onClick: () => router.push('/cart') },
      });
    } catch (err) {
      toastError(err);
    } finally {
      setAdding(false);
    }
  };

  const img = product.images[selectedImage] || product.images[0];
  const sku = product.sku || product.name;

  return (
    <>
      {/* ── Gallery column (gallery frame + viewer-tabs slot in ONE grid child) */}
      <div className="lg:col-span-7">
        <div
          className="media-frame relative aspect-[3/4] w-full sm:aspect-[4/5] lg:aspect-[3/4] lg:max-h-[80vh]"
          data-tyashin-slot="product-gallery"
          data-thridify-page-product-id={sku}
        >
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={optimizedSrc(img.url, 1200)}
              alt={img.alt || product.name}
              width={1024}
              height={1536}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-dark">No image yet</div>
          )}
        </div>
        <div data-thridify-slot="viewer-tabs" className="mt-3" />
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {product.images.map((im, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`media-frame h-20 w-16 shrink-0 border transition-colors ${
                  i === selectedImage ? 'border-brass' : 'border-transparent'
                }`}
                aria-label={`Image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optimizedSrc(im.url, 200)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Buy box */}
      <div className="lg:col-span-5">
        {tierLabel && <p className="eyebrow">{tierLabel}</p>}
        <h1 className="tt-1 mt-4 text-ink" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
          {product.name}
        </h1>
        {(product.shortDescription || facts.story) && (
          <p className="lead mt-4" data-tyashin-slot="product-description">
            {product.shortDescription || facts.story.split('\n')[0]}
          </p>
        )}

        <div className="mt-8 flex items-baseline gap-3">
          <span className="tt-price text-2xl text-ink">{formatPriceExplicit(displayPrice, currency)}</span>
          {selectedVariant && <span className="text-sm text-muted-foreground">{selectedVariant.name}</span>}
        </div>
        {store?.taxName && store.taxRate ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {store.taxInclusive ? 'Taxes included.' : `Plus ${store.taxName} at checkout.`} Complimentary courier in Canada and
            the United States.
          </p>
        ) : null}

        {Object.entries(optionGroups).map(([optionName, values]) => (
          <div key={optionName} className="mt-8">
            <p className="field-label">{optionName}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((val) => {
                const matching = activeVariants.find((v) => v.attributes[optionName] === val);
                const isSelected = selectedVariant?.attributes[optionName] === val;
                return (
                  <button
                    key={val}
                    onClick={() => matching && setSelectedVariantId(matching.id)}
                    className={`rounded-sm border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors ${
                      isSelected
                        ? 'border-ink bg-ink text-paper'
                        : 'border-border bg-transparent text-ink hover:border-brass'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {val}
                    {matching && matching.price > 0 && (
                      <span className="ml-2 opacity-70">{formatPriceExplicit(matching.price, currency)}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

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

        <div className="mt-10">
          <p className="field-label">Wear</p>
          <WearScale level={facts.wear} />
        </div>

        <div className="hairline mt-10" aria-hidden />
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>Forty percent concentrate in oil. No alcohol, no water.</li>
          <li>Natural resins settle. Shake gently before each wear.</li>
          <li>For external use only. Patch-test on the inner arm before first use.</li>
        </ul>
      </div>
    </>
  );
}
