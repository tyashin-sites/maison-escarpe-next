'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import PageFrame from '@/components/PageFrame';
import { useCart, useStore, toast, toastError } from '@/components/Providers';
import { formatPrice } from '@/lib/format';
import { getOrderNote, setOrderNote, ORDER_NOTE_EVENT } from '@/lib/order-note';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart, applyCoupon, removeCoupon } = useCart();
  const { store } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  /**
   * "Special order instructions" — synced with the checkout page via
   * localStorage (`tyashin_order_note`). Initialized empty so SSR matches
   * the first client render; populated in the effect below.
   */
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(getOrderNote());
    const onExternalChange = (e: Event) => {
      const next = (e as CustomEvent<string>).detail ?? getOrderNote();
      setNote(next);
    };
    window.addEventListener(ORDER_NOTE_EVENT, onExternalChange);
    // Cross-tab updates: storage events fire on tabs that did NOT do the write.
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tyashin_order_note') setNote(e.newValue ?? '');
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(ORDER_NOTE_EVENT, onExternalChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const onNoteChange = (value: string) => {
    setNote(value);
    setOrderNote(value);
    // Tell the checkout page (open in another tab or already mounted) to
    // refresh its initial form value. Same-tab listeners pick this up too.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(ORDER_NOTE_EVENT, { detail: value }));
    }
  };

  const handleQty = async (productId: string, variantId: string | null, newQty: number) => {
    try {
      if (newQty <= 0) await removeItem(productId, variantId || undefined);
      else await updateItem(productId, newQty, variantId || undefined);
    } catch (err) {
      toastError(err);
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    try {
      await applyCoupon(code);
      toast.success('Coupon applied!');
      setCouponInput('');
    } catch (err) {
      toastError(err, 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const currency = cart?.currency || 'CAD';

  return (
    <PageFrame>
        <section className="bg-paper">
          <div className="container-x py-12 md:py-16">
            <p className="eyebrow">Cart</p>
            <h1 className="tt-1 mt-5 text-ink">What you are taking inside.</h1>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container-x max-w-5xl">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-lg bg-cream" />
                ))}
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-display text-2xl text-ink">Your cart is empty.</p>
                <Link
                  href="/products"
                  className="btn btn-ghost mt-6"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  {cart.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="card flex gap-5 p-4"
                    >
                      <div className="media-frame h-28 w-20 shrink-0">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-lg text-ink">{item.name}</h3>
                        <p className="tt-price mt-1 text-sm text-ink">
                          {formatPrice(item.price, currency)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleQty(item.productId, item.variantId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors hover:bg-cream"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQty(item.productId, item.variantId, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors hover:bg-cream"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId || undefined)}
                            className="ml-auto p-1 text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/*
                   * Special order instructions — synced with the checkout
                   * page via localStorage. Editing here updates the value on
                   * /checkout (and vice-versa); the note is sent with the
                   * order payload and surfaced in the merchant's WhatsApp
                   * message when paying that way.
                   */}
                  <div className="card p-5">
                    <label
                      htmlFor="order-note"
                      className="field-label"
                    >
                      A note for the house (optional)
                    </label>
                    <textarea
                      id="order-note"
                      value={note}
                      onChange={(e) => onNoteChange(e.target.value)}
                      rows={3}
                      maxLength={1000}
                      placeholder="Gift wrapping, a message, a delivery preference."
                      className="field mt-1 resize-none"
                    />
                  </div>

                  <button
                    onClick={() => clearCart()}
                    className="tt-caps text-[0.625rem] text-muted-foreground transition-colors hover:text-garnet"
                  >
                    Clear cart
                  </button>
                </div>

                <div className="lg:col-span-1">
                  <div className="card sticky top-24 p-6">
                    <h3 className="mb-5 font-display text-xl text-ink">Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(cart.subtotal, currency)}</span>
                      </div>
                      {cart.discountAmount > 0 && (
                        <div className="flex justify-between text-sage">
                          <span>Discount {cart.couponCode && `(${cart.couponCode})`}</span>
                          <span>-{formatPrice(cart.discountAmount, currency)}</span>
                        </div>
                      )}
                      {!cart.taxInclusive && cart.taxAmount != null && cart.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {cart.taxName || store?.taxName || 'Tax'}
                            {store?.taxRate && <span className="ml-1 text-xs">({store.taxRate}%)</span>}
                          </span>
                          <span>{formatPrice(cart.taxAmount, currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                        <span>Total</span>
                        <span className="tt-price text-ink">{formatPrice(cart.total, currency)}</span>
                      </div>
                    </div>

                    {cart.couponCode ? (
                      <div className="mt-4 flex items-center justify-between rounded-sm bg-paper-deep p-2">
                        <span className="text-xs text-muted-foreground">
                          Coupon: <strong>{cart.couponCode}</strong>
                        </span>
                        <button
                          onClick={() => removeCoupon()}
                          className="text-xs text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 flex gap-2 overflow-hidden">
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="field min-w-0 flex-1 py-2 text-sm"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="btn btn-ghost shrink-0 px-4 py-2"
                        >
                          Apply
                        </button>
                      </div>
                    )}

                    <Link
                      href="/checkout"
                      className="btn btn-primary mt-6 w-full"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </PageFrame>
  );
}
