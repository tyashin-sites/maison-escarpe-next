'use client';

/**
 * Chapter V — the ritual. Desktop: the macro image is pinned while the three
 * lines light up one after another as the visitor scrolls (scrubbed). Mobile
 * and reduced motion: the same content, unpinned, all lines lit.
 */

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced } from '@/components/motion/gsap';
import { RITUAL } from '@/lib/attar';

export default function RitualChapter() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced()) return;
      const lines = gsap.utils.toArray<HTMLElement>('.ritual-line', root);
      if (lines.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const stage = root.querySelector<HTMLElement>('[data-stage]');
        const copy = root.querySelector<HTMLElement>('[data-copy]');
        if (!stage || !copy) return;
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => `+=${lines.length * 60}%`,
          pin: stage,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            const step = Math.min(lines.length - 1, Math.floor(self.progress * lines.length * 0.999));
            lines.forEach((l, i) => l.classList.toggle('is-on', i <= step));
          },
        });
        gsap.to(stage.querySelector('img'), {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${lines.length * 60}%`, scrub: 0.6 },
        });
      });
      mm.add('(max-width: 1023px)', () => {
        lines.forEach((l) => {
          ScrollTrigger.create({ trigger: l, start: 'top 80%', once: true, onEnter: () => l.classList.add('is-on') });
        });
      });
      return () => mm.revert();
    },
    { scope: ref as React.RefObject<HTMLElement> },
  );

  return (
    <section ref={ref} className="on-dark relative bg-ink" aria-labelledby="ritual-title">
      <div className="lg:grid lg:grid-cols-2">
        <div data-stage className="bleed-img relative aspect-[4/5] lg:aspect-auto lg:h-[100svh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/resin-macro.jpg" alt="Raw agarwood: resin-saturated heartwood" width={1536} height={1024} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink/70" aria-hidden />
        </div>
        <div data-copy className="flex flex-col justify-center px-[clamp(1.25rem,5vw,6rem)] py-[clamp(5rem,10vw,9rem)] lg:min-h-[100svh]">
          <p className="eyebrow">{RITUAL.eyebrow}</p>
          <h2 id="ritual-title" className="tt-1 mt-5 max-w-[14ch] text-paper" data-fx="words">
            {RITUAL.title}
          </h2>
          <ol className="mt-12 space-y-8">
            {RITUAL.lines.map((line, i) => (
              <li key={i} className="ritual-line flex gap-6">
                <span className="font-display text-3xl leading-none text-brass-soft">{String(i + 1).padStart(2, '0')}</span>
                <p className="max-w-md text-lg leading-relaxed text-paper/90">{line}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
