'use client';

/**
 * ScrollFX — the sitewide declarative scroll-effects layer. Mounted once in
 * the root layout; wires GSAP ScrollTriggers to data attributes so SERVER
 * components get choreography without becoming client components:
 *
 *   data-parallax="0.05–0.2"  scrubbed vertical drift (atmosphere only)
 *   data-fx="rise"            one-shot rise + blur-settle at 88%, once
 *   data-fx="draw"            scaleX 0→1 for hairlines
 *   data-fx="words"           masked SplitText word reveal — BELOW FOLD ONLY
 *                             (LCP law: never on a possible LCP element)
 *
 * Re-inits on route change; refreshes trigger positions on window load.
 * Reduced motion → nothing is wired.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, SplitText, useGSAP, reduced } from '@/components/motion/gsap';

const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith('__reactFiber$'));

export function ScrollFX() {
  const pathname = usePathname();

  useGSAP(
    (context) => {
      if (reduced() || !context) return;
      // HYDRATION LAW: the layout hydrates before streamed page segments. Wait
      // until every target carries React's fiber key before writing styles.
      let raf = 0;
      const deadline = performance.now() + 8000;
      const tryWire = () => {
        const targets = document.querySelectorAll('[data-parallax],[data-fx]');
        const ready = targets.length > 0 && Array.from(targets).every(isHydrated);
        if (!ready && performance.now() < deadline) {
          raf = requestAnimationFrame(tryWire);
          return;
        }
        if (ready) context.add(wire);
      };
      raf = requestAnimationFrame(tryWire);
      return () => cancelAnimationFrame(raf);
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') return;
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}

function wire() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Math.min(0.2, parseFloat(el.dataset.parallax || '0.12'));
    const travel = () => speed * Math.min(window.innerHeight, 900) * 0.5;
    gsap.fromTo(
      el,
      { y: () => -travel() },
      {
        y: () => travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-fx="rise"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      filter: 'blur(6px)',
      duration: 1,
      ease: 'brand',
      clearProps: 'filter,transform',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-fx="words"]').forEach((el) => {
    try {
      const split = new SplitText(el, { type: 'words', mask: 'words', wordsClass: 'fx-word', aria: 'none' });
      gsap.from(split.words, {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.07,
        ease: 'brand',
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
    } catch {
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: 'brand',
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }
  });

  gsap.utils.toArray<HTMLElement>('[data-fx="draw"]').forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      duration: 1.2,
      ease: 'brand',
      clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  ScrollTrigger.refresh();
}
