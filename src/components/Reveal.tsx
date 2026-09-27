'use client';

/**
 * Reveal / Stagger — scroll-triggered entrances on the shared 'brand' ease.
 * Elements rise and settle into focus (blur 6px → sharp), fire once at 88%,
 * and clear inline transform/filter so CSS hover states keep working.
 * Reduced motion / no-JS → content simply stays visible (nothing is hidden
 * pre-hydration).
 */

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, reduced } from '@/components/motion/gsap';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  distance?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'span' | 'li';
}

const offsetFor = (dir: Direction, dist: number) => {
  switch (dir) {
    case 'up':
      return { y: dist };
    case 'down':
      return { y: -dist };
    case 'left':
      return { x: dist };
    case 'right':
      return { x: -dist };
    default:
      return {};
  }
};

export function Reveal({ children, delay = 0, direction = 'up', distance = 24, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      gsap.from(el, {
        opacity: 0,
        filter: 'blur(6px)',
        ...offsetFor(direction, distance),
        duration: 0.9,
        delay,
        ease: 'brand',
        clearProps: 'filter,transform',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    },
    { scope: ref as React.RefObject<HTMLElement> },
  );
  const Tag = as as 'div';
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: 'div' | 'section' | 'ul' | 'ol';
}

export function Stagger({ children, delay = 0, stagger = 0.08, className, as = 'div' }: StaggerProps) {
  const ref = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced() || el.children.length === 0) return;
      gsap.from(el.children, {
        opacity: 0,
        y: 24,
        filter: 'blur(6px)',
        duration: 0.9,
        delay,
        stagger,
        ease: 'brand',
        clearProps: 'filter,transform',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    },
    { scope: ref as React.RefObject<HTMLElement> },
  );
  const Tag = as as 'div';
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
