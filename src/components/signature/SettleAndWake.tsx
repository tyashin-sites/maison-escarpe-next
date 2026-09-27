'use client';

/**
 * Settle & Wake — signature motion #2. An SVG bottle whose two oil layers
 * mix as the visitor scrolls (ScrollTrigger scrub, transform-only), ending on
 * the ritual line. This turns the one property a 40% oil cannot hide — it
 * settles — into the brand's gesture. Reduced motion / no JS → the mixed,
 * final state is what the server renders.
 */

import { useRef } from 'react';
import { gsap, useGSAP, reduced } from '@/components/motion/gsap';
import { RITUAL } from '@/lib/attar';

export default function SettleAndWake() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced()) return;
      const heavy = root.querySelector<SVGElement>('[data-layer="heavy"]');
      const light = root.querySelector<SVGElement>('[data-layer="light"]');
      const swirl = root.querySelector<SVGElement>('[data-layer="swirl"]');
      const bottle = root.querySelector<SVGElement>('[data-bottle]');
      if (!heavy || !light || !swirl || !bottle) return;

      // Start separated: heavy resin layer sunk, light layer floating, no swirl.
      gsap.set(heavy, { y: 46, transformOrigin: '50% 100%' });
      gsap.set(light, { y: -12, opacity: 0.9 });
      gsap.set(swirl, { opacity: 0, scale: 0.6, rotate: -20, transformOrigin: '50% 50%' });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 45%', scrub: 0.9 },
      });
      tl.to(bottle, { rotate: -7, transformOrigin: '50% 80%', duration: 0.25 }, 0)
        .to(bottle, { rotate: 6, duration: 0.3 }, 0.25)
        .to(bottle, { rotate: 0, duration: 0.25 }, 0.55)
        .to(heavy, { y: 0, duration: 0.7 }, 0.15)
        .to(light, { y: 0, opacity: 0.55, duration: 0.7 }, 0.15)
        .to(swirl, { opacity: 0.8, scale: 1, rotate: 25, duration: 0.6 }, 0.25)
        .to(swirl, { opacity: 0.25, duration: 0.2 }, 0.85);
    },
    { scope: ref as React.RefObject<HTMLElement> },
  );

  return (
    <section ref={ref} className="on-dark grain bg-stone" aria-labelledby="ritual-title">
      <div className="container-x grid items-center gap-12 py-[clamp(5.5rem,11vw,9.5rem)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">{RITUAL.eyebrow}</p>
          <h2 id="ritual-title" className="tt-1 mt-5 text-paper" data-fx="words">
            {RITUAL.title}
          </h2>
          <ol className="mt-8 space-y-5">
            {RITUAL.lines.map((line, i) => (
              <li key={i} className="flex gap-5" data-fx="rise">
                <span className="font-display text-2xl leading-none text-brass-soft">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-base leading-relaxed text-paper/85">{line}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-7">
          <svg
            viewBox="0 0 420 520"
            className="mx-auto block h-auto w-full max-w-[380px]"
            role="img"
            aria-label="The oil in a Maison Escarpe bottle settling and then mixing when shaken"
          >
            <defs>
              <linearGradient id="glass" x1="0" x2="1">
                <stop offset="0" stopColor="#EDE6DA" stopOpacity="0.16" />
                <stop offset="0.5" stopColor="#EDE6DA" stopOpacity="0.02" />
                <stop offset="1" stopColor="#EDE6DA" stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id="brass" x1="0" x2="1">
                <stop offset="0" stopColor="#8C6D3F" />
                <stop offset="0.45" stopColor="#CDB07F" />
                <stop offset="1" stopColor="#7A5D34" />
              </linearGradient>
              <linearGradient id="oilLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#C8963E" />
                <stop offset="1" stopColor="#8A5A1E" />
              </linearGradient>
              <linearGradient id="oilHeavy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#5A2A14" />
                <stop offset="1" stopColor="#2B140A" />
              </linearGradient>
              <clipPath id="body">
                <rect x="110" y="150" width="200" height="330" rx="14" />
              </clipPath>
            </defs>
            <g data-bottle>
              {/* cap */}
              <rect x="150" y="40" width="120" height="96" rx="6" fill="url(#brass)" />
              <rect x="150" y="40" width="120" height="8" rx="3" fill="#E6D3A6" opacity="0.5" />
              <rect x="168" y="136" width="84" height="18" fill="#6E5630" />
              {/* liquid */}
              <g clipPath="url(#body)">
                <rect x="110" y="150" width="200" height="330" fill="#1A140F" />
                <rect data-layer="light" x="110" y="190" width="200" height="290" fill="url(#oilLight)" opacity="0.9" />
                <rect data-layer="heavy" x="110" y="300" width="200" height="180" fill="url(#oilHeavy)" />
                <path
                  data-layer="swirl"
                  d="M130 330 C 180 290, 240 370, 290 330 S 240 420, 190 400 S 160 350, 130 330 Z"
                  fill="#C8963E"
                  opacity="0"
                />
                <rect x="110" y="150" width="200" height="330" fill="url(#glass)" />
              </g>
              {/* glass outline + highlight */}
              <rect x="110" y="150" width="200" height="330" rx="14" fill="none" stroke="#EDE6DA" strokeOpacity="0.35" />
              <rect x="122" y="166" width="10" height="290" rx="5" fill="#EDE6DA" opacity="0.12" />
              {/* resting-line etch */}
              <line x1="110" y1="300" x2="310" y2="300" stroke="#CDB07F" strokeOpacity="0.45" strokeDasharray="3 5" />
            </g>
            <text x="210" y="510" textAnchor="middle" fill="#A89C8C" fontSize="11" letterSpacing="3" fontFamily="var(--font-body)">
              TURN TWICE · SHAKE GENTLY · WEAR
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
