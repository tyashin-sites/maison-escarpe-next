'use client';

import { useState } from 'react';

/**
 * "Write a review" affordance. Reviews are verified-buyer only, and the
 * submission form is the Tyashin-hosted page at /reviews/<orderNumber> —
 * we just collect the order number + email and send the shopper there.
 * (Buyers also get this exact link by email after delivery.)
 */
export default function WriteReviewCTA() {
  const [open, setOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const o = orderNumber.trim();
    const m = email.trim();
    if (!o || !m) return;
    window.location.href = `/reviews/${encodeURIComponent(o)}?e=${encodeURIComponent(m)}`;
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary"
      >
        Write a review
      </button>
    );
  }

  return (
    <form onSubmit={go} className="flex w-full max-w-md flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Bought this? Enter your order number and the email you ordered with — we&apos;ll take you
        to your review form.
      </p>
      <input
        type="text"
        required
        placeholder="Order number (e.g. OSH-1234)"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        className=" border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <input
        type="email"
        required
        placeholder="Email used on the order"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className=" border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
