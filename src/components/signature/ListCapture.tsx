'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitLead } from '@/lib/leads';

/**
 * Chapter IX — the list. Inline capture on a full-bleed dusk image. Batches
 * are offered to the list before they are listed; the form writes a lead
 * (source "house-list") to the Tyashin inbox.
 */
export default function ListCapture() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await submitLead({ name: form.name, email: form.email, subject: 'Join the list', message: '(joined the house list)', source: 'house-list' });
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <section className="cinema on-dark grain !min-h-0" aria-labelledby="list-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-tall.jpg" alt="" className="cinema-img !animate-none !scale-100" width={1024} height={1536} loading="lazy" data-parallax="0.08" />
      <div className="absolute inset-0 bg-ink/72" aria-hidden />
      <div className="container-x relative z-[2] py-[clamp(6rem,14vw,12rem)] lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="eyebrow">The list</p>
          <h2 id="list-title" className="tt-1 mt-5 max-w-[14ch] text-paper" data-fx="words">
            Batches go to the list before they go anywhere else.
          </h2>
          <p className="lead mt-6 max-w-md" data-fx="rise">
            Leave your name. You will hear about a pour before it is announced, and never more than once a month.
          </p>
        </div>
        <div className="mt-12 lg:col-span-5 lg:col-start-8 lg:mt-3">
          {state === 'done' ? (
            <div data-fx="rise">
              <p className="font-display text-3xl text-paper">You are on the list.</p>
              <p className="mt-3 text-sm text-muted-dark">We write rarely, and only when there is a batch worth writing about.</p>
              <Link href="/category/discovery" className="btn-link mt-8 text-paper">
                Start with the discovery set
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-7" data-fx="rise">
              <div>
                <label htmlFor="list-name" className="field-label">
                  Name
                </label>
                <input id="list-name" required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="list-email" className="field-label">
                  Email
                </label>
                <input id="list-email" type="email" required className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button type="submit" disabled={state === 'sending'} className="btn btn-primary">
                  {state === 'sending' ? 'Sending…' : 'Join the list'}
                </button>
                <Link href="/category/discovery" className="btn-link text-paper">
                  Or start with the discovery set
                </Link>
              </div>
              {state === 'error' && <p className="text-sm text-brass-soft">That did not send. Please try again.</p>}
              <p className="text-xs text-muted-dark">
                By joining you agree to our{' '}
                <Link href="/privacy-policy" className="underline underline-offset-2">
                  privacy notice
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
