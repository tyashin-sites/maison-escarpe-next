'use client';

import { useState } from 'react';
import { toast, toastError } from '@/components/Providers';
import { submitLead } from '@/lib/leads';

/**
 * Contact / list form — POSTs to the Tyashin contact-form endpoint via the
 * shared submitLead() helper (single point of change for every lead surface).
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Join the list', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message || `(${form.subject})`,
        source: form.subject === 'Join the list' ? 'house-list' : 'contact-form',
      });
      toast.success('Received. The house will write back.');
      setDone(true);
    } catch (err) {
      toastError(err, 'The message did not send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="stone-card on-dark p-8">
        <p className="eyebrow">Received</p>
        <p className="mt-4 font-display text-2xl text-paper">Thank you. You are on the list.</p>
        <p className="mt-3 text-sm text-muted-dark">We write rarely, and only when there is a batch worth writing about.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">
            Name
          </label>
          <input id="c-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">
            Email
          </label>
          <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="field-label">
          Reason
        </label>
        <select id="c-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="field">
          <option>Join the list</option>
          <option>A question about an attar</option>
          <option>A private allocation</option>
          <option>Press or wholesale</option>
          <option>Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">
          Message <span className="normal-case tracking-normal text-muted-foreground/70">(optional if joining the list)</span>
        </label>
        <textarea id="c-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field resize-y" />
      </div>
      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? 'Sending…' : 'Send'}
      </button>
      <p className="text-xs text-muted-foreground">
        By writing you agree to our <a href="/privacy-policy" className="underline underline-offset-2">privacy notice</a>. No
        newsletters beyond the house list.
      </p>
    </form>
  );
}
