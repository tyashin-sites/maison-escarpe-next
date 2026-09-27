'use client';

/**
 * Shared GSAP core — the ONE place plugins are registered and the brand ease
 * ('brand' = --ease-brand, cubic-bezier(0.22, 1, 0.36, 1)) is encoded.
 * Every animated component imports from here, never from 'gsap' directly.
 *
 *  - 'brand' ease everywhere; 'none' only for scroll-scrubbed tweens.
 *  - transform / opacity / filter only; clearProps on complete so CSS hovers
 *    keep working afterwards.
 *  - reduced() gates EVERY entrance / scrub / magnetic lean.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  if (!CustomEase.get('brand')) {
    CustomEase.create('brand', 'M0,0 C0.22,1 0.36,1 1,1');
  }
}

/** True when the visitor asked for reduced motion — check inside effects. */
export function reduced(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
