/**
 * Lead submission — the ONE way the site writes a lead to Tyashin
 * (`POST /api/v1/public/contact` → lead inbox + CRM contact + notifications).
 * Used by the contact form, the house-list CTA and the checkout reservation
 * fallback.
 */
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || '6ab98d8af53db5cdd5d093f3';
const API_URL = process.env.NEXT_PUBLIC_TYASHIN_API_URL || 'https://website-api.tyashin.com';
const API_KEY = process.env.NEXT_PUBLIC_TYASHIN_API_KEY || '';

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source: string;
  customFields?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/public/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      ...payload,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    }),
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean; error?: { message?: string } } | null;
  if (!json?.success) throw new Error(json?.error?.message || 'Failed to send');
}
