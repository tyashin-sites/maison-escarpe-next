'use client';

/**
 * Cursor — a brass dot with a lagging ring, fine pointers only. The ring
 * grows over links and buttons and hides when the pointer leaves the window.
 * Pure transform via gsap.quickTo; reduced motion → no cursor at all (the
 * native one stays).
 */

import { useEffect } from 'react';
import { gsap, reduced } from '@/components/motion/gsap';

const HOVER = 'a, button, [role="button"], input, select, textarea, summary, label';

export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || reduced()) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot is-hidden';
    ring.className = 'cursor-ring is-hidden';
    document.body.append(dot, ring);
    document.documentElement.classList.add('has-cursor');

    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        dot.classList.remove('is-hidden');
        ring.classList.remove('is-hidden');
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = e.target as Element | null;
      ring.classList.toggle('is-hover', Boolean(t?.closest(HOVER)));
    };
    const onLeave = () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
      shown = false;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      dot.remove();
      ring.remove();
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);
  return null;
}
