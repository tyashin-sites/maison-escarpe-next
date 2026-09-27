'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart, toast, toastError } from '@/components/Providers';
import { formatPriceExplicit } from '@/lib/format';
import { submitLead } from '@/lib/leads';
import type { Cart } from '@/lib/types';

/**
 * Reservation checkout — rendered when the store has NO enabled payment
 * method (no gateway yet, no COD, no WhatsApp). Instead of a dead payment
 * step the visitor reserves their allocation: the cart is written to the
 * Tyashin lead inbox (contact-form plugin, source "reservation") and the
 * house confirms by email. The moment a payment method is enabled in the
 * admin, the normal checkout takes over — no code change.
 */
export default function ReservationCheckout({ cart, currency }: { cart: Cart; currency: string }) {
  const { clearCart } = useCart();
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', country: 'Canada', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const lines = cart.items.map((i) => `${i.quantity} × ${i.name} — ${formatPriceExplicit(i.price * i.quantity, currency)}`);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: `Reservation — ${formatPriceExplicit(cart.total, currency)}`,
        message: [
          'RESERVATION REQUEST',
          ...lines,
          `Total (before tax/shipping): ${formatPriceExplicit(cart.total, currency)}`,
          `Ship to: ${form.city}, ${form.country}`,
          form.note ? `Note: ${form.note}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        source: 'reservation',
        customFields: { city: form.city, country: form.country, items: String(cart.items.length) },
        metadata: { cart: cart.items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })) },
      });
      await clearCart().catch(() => {});
      setDone(true);
      toast.success('Reservation received.');
    } catch (err) {
      toastError(err, 'The reservation did not send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="stone-card on-dark mx-auto max-w-2xl p-8 md:p-10">
        <p className="eyebrow">Reserved</p>
        <h2 className="mt-4 font-display text-3xl text-paper">Your allocation is held.</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-dark">
          The house will write to {form.email} to confirm the bottles, the batch and payment. Nothing is charged
          until you reply.
        </p>
        <Link href="/products" className="btn-link mt-8 text-paper">
          Back to the attars
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form onSubmit={onSubmit} className="space-y-6 lg:col-span-2">
        <div className="card p-6">
          <h3 className="mb-2 font-display text-xl text-ink">How reservations work</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Payment is not yet taken on the site. Leave your details and the house confirms your allocation by
            email with a secure payment link. Bottles are held for seven days.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="mb-5 font-display text-xl text-ink">Your details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="r-name">
                Full name
              </label>
              <input id="r-name" required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            </div>
            <div>
              <label className="field-label" htmlFor="r-email">
                Email
              </label>
              <input id="r-email" type="email" required className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </div>
            <div>
              <label className="field-label" htmlFor="r-phone">
                Phone (optional)
              </label>
              <input id="r-phone" type="tel" className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            </div>
            <div>
              <label className="field-label" htmlFor="r-country">
                Country
              </label>
              <select id="r-country" className="field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                <option>Canada</option>
                <option>United States</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="r-city">
                City
              </label>
              <input id="r-city" required className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} autoComplete="address-level2" />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="r-note">
                A note for the house (optional)
              </label>
              <textarea id="r-note" rows={3} className="field resize-none" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary w-full sm:w-auto">
          {submitting ? 'Sending…' : 'Reserve'}
        </button>
      </form>

      <aside className="lg:col-span-1">
        <div className="card sticky top-24 p-6">
          <h3 className="mb-5 font-display text-xl text-ink">Your allocation</h3>
          <ul className="space-y-3 text-sm">
            {cart.items.map((i) => (
              <li key={`${i.productId}-${i.variantId}`} className="flex justify-between gap-4">
                <span className="text-ink/85">
                  {i.quantity} × {i.name}
                </span>
                <span className="tt-price shrink-0">{formatPriceExplicit(i.price * i.quantity, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="hairline my-5" aria-hidden />
          <div className="flex justify-between text-base">
            <span>Total</span>
            <span className="tt-price text-ink">{formatPriceExplicit(cart.total, currency)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Before tax and shipping. Nothing is charged today.</p>
        </div>
      </aside>
    </div>
  );
}
