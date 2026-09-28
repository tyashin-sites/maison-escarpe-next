/**
 * Attar content conventions — the platform (Tyashin admin) is the single
 * source of truth for products, and its product schema has no "notes" or
 * "wear" fields. So structured facts live INSIDE the product description as
 * simple `Key: value` lines and are parsed here. The admin can edit them in
 * the product editor without a deploy.
 *
 *   <story prose>
 *
 *   Top: saffron, pink pepper
 *   Heart: Cambodi oud, Taif rose
 *   Base: Hindi oud, amber, sandal
 *   Oud: Cambodi (Pursat) and Assam
 *   Wear: Present
 *   Season: All year
 *   Batch: Numbered — 60 bottles per batch
 *
 * Tier comes from the product's category slug; wear defaults to "Present".
 */

import type { ApiProduct, ApiCategory } from './types';

export type WearLevel = 'Intimate' | 'Present' | 'Commanding';

export const WEAR_LEVELS: Record<WearLevel, { index: number; blurb: string }> = {
  Intimate: { index: 0, blurb: 'Stays close to the skin. Found by those who come near.' },
  Present: { index: 1, blurb: 'Noticed across a table. Never announces itself.' },
  Commanding: { index: 2, blurb: 'Fills a room slowly, then stays after you leave.' },
};

export interface AttarFacts {
  story: string;
  top?: string;
  heart?: string;
  base?: string;
  oud?: string;
  wear: WearLevel;
  season?: string;
  batch?: string;
  homage?: string;
}

const KEYS = ['top', 'heart', 'base', 'oud', 'wear', 'season', 'batch', 'homage'] as const;

export function parseAttar(description: string): AttarFacts {
  const facts: Partial<AttarFacts> = {};
  const prose: string[] = [];
  for (const raw of (description || '').split(/\r?\n/)) {
    const line = raw.trim();
    const m = line.match(/^([A-Za-z]+):\s*(.+)$/);
    const key = m?.[1]?.toLowerCase() as (typeof KEYS)[number] | undefined;
    if (m && key && (KEYS as readonly string[]).includes(key)) {
      (facts as Record<string, string>)[key] = m[2].trim();
    } else {
      prose.push(raw);
    }
  }
  const wearRaw = (facts.wear || '').trim();
  const wear: WearLevel =
    wearRaw === 'Intimate' || wearRaw === 'Commanding' || wearRaw === 'Present' ? wearRaw : 'Present';
  return {
    story: prose.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    top: facts.top,
    heart: facts.heart,
    base: facts.base,
    oud: facts.oud,
    wear,
    season: facts.season,
    batch: facts.batch,
    homage: facts.homage,
  };
}

export const TIER_LABEL: Record<string, string> = {
  signature: 'Signature',
  reserve: 'Reserve',
  'private-blend': 'Private Blend',
  discovery: 'Discovery',
};

export const TIER_LINE: Record<string, string> = {
  signature: 'The entry to the wall. Built for daily wear.',
  reserve: 'Named-origin oud leads. Smaller batches.',
  'private-blend': 'Single-origin and aged. Numbered, allocated to the list first.',
  discovery: 'Wear before you decide. Credited toward a full bottle.',
};

export function tierOf(product: Pick<ApiProduct, 'categoryId'>, categories: ApiCategory[]): string | undefined {
  return categories.find((c) => c._id === product.categoryId)?.slug;
}

/** Lowest active variant price, or the base price — for "from C$X". */
export function fromPrice(product: Pick<ApiProduct, 'price' | 'hasVariants' | 'variants'>): number {
  if (product.hasVariants && product.variants?.length) {
    const active = product.variants.filter((v) => v.isActive && v.price > 0);
    if (active.length) return Math.min(...active.map((v) => v.price));
  }
  return product.price;
}

/** The ritual copy — one source, used on the PDP, home panel and FAQ. */
export const RITUAL = {
  eyebrow: 'Shake to awaken',
  title: 'Natural resins settle. That is the point.',
  lines: [
    'Nothing in the flacon is added to keep it uniform: no solubilisers, no stabilisers. The resins settle.',
    'Turn the flacon over twice and shake it gently before each wear, so every spray carries the whole composition.',
    'Two sprays. Pulse points, the collarbone, the inside of a cuff. Let it warm on the skin before you judge it.',
  ],
};
