import { RITUAL, type AttarFacts as Facts } from '@/lib/attar';

/**
 * Below the buy box: the story, the homage line, and the ritual on the
 * resin macro. Parsed from the product description (src/lib/attar.ts).
 */
export default function AttarFacts({ facts }: { facts: Facts }) {
  const paragraphs = facts.story.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paragraphs.length > 0 && (
        <section className="bg-paper py-[clamp(5rem,10vw,9rem)]" aria-label="The story">
          <div className="container-x lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-3">
              <p className="eyebrow">The story</p>
            </div>
            <div className="mt-6 lg:col-span-7 lg:mt-0">
              {paragraphs.map((p, i) => (
                <p key={i} className={`${i === 0 ? 'tt-2 text-ink' : 'mt-8 text-lg leading-relaxed text-ink/80'}`} data-fx="rise">
                  {p}
                </p>
              ))}
              {facts.homage && (
                <p className="mt-10 border-l border-brass/50 pl-6 text-sm italic leading-relaxed text-muted-foreground" data-fx="rise">
                  {facts.homage}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="on-dark relative bg-ink" aria-label={RITUAL.eyebrow}>
        <div className="lg:grid lg:grid-cols-2">
          <div className="bleed-img aspect-[16/10] lg:aspect-auto lg:min-h-[70svh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/oil-macro.jpg" alt="Oud oil mixing inside glass" width={1536} height={1024} loading="lazy" data-parallax="0.06" className="!h-[112%] !-translate-y-[6%]" />
          </div>
          <div className="flex flex-col justify-center px-[clamp(1.25rem,5vw,6rem)] py-[clamp(4rem,8vw,7rem)]">
            <p className="eyebrow">{RITUAL.eyebrow}</p>
            <h2 className="tt-2 mt-4 max-w-[16ch] text-paper" data-fx="words">
              {RITUAL.title}
            </h2>
            <ol className="mt-8 space-y-5">
              {RITUAL.lines.map((line, i) => (
                <li key={i} className="flex gap-5" data-fx="rise">
                  <span className="font-display text-2xl leading-none text-brass-soft">{String(i + 1).padStart(2, '0')}</span>
                  <p className="max-w-md text-base leading-relaxed text-paper/85">{line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
