import { RITUAL, type AttarFacts as Facts } from '@/lib/attar';

/**
 * Below the buy box: story, notes pyramid, provenance and the ritual. All of
 * it is parsed from the product description (src/lib/attar.ts), so the admin
 * edits it in Tyashin without a deploy.
 */
export default function AttarFacts({ facts }: { facts: Facts }) {
  const paragraphs = facts.story.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const hasPyramid = facts.top || facts.heart || facts.base;

  return (
    <section className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16" aria-label="About this attar">
      <div className="lg:col-span-7">
        {paragraphs.length > 0 && (
          <div className="max-w-2xl">
            <p className="eyebrow">The story</p>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/85">
              {paragraphs.map((p, i) => (
                <p key={i} data-fx="rise">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}
        {facts.homage && (
          <p className="mt-6 max-w-2xl border-l border-brass/50 pl-5 text-sm italic text-muted-foreground" data-fx="rise">
            {facts.homage}
          </p>
        )}

        {hasPyramid && (
          <div className="mt-12">
            <p className="eyebrow">Notes</p>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
              {[
                ['Top', facts.top],
                ['Heart', facts.heart],
                ['Base', facts.base],
              ].map(([k, v]) =>
                v ? (
                  <div key={k} className="bg-paper p-5" data-fx="rise">
                    <dt className="tt-caps text-[0.625rem] text-brass-deep">{k}</dt>
                    <dd className="mt-2 font-display text-lg leading-snug text-ink">{v}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </div>
        )}

        {(facts.oud || facts.season || facts.batch) && (
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {facts.oud && (
              <div data-fx="rise">
                <dt className="tt-caps text-[0.625rem] text-brass-deep">Oud</dt>
                <dd className="mt-2 text-sm text-ink/85">{facts.oud}</dd>
              </div>
            )}
            {facts.season && (
              <div data-fx="rise">
                <dt className="tt-caps text-[0.625rem] text-brass-deep">Season</dt>
                <dd className="mt-2 text-sm text-ink/85">{facts.season}</dd>
              </div>
            )}
            {facts.batch && (
              <div data-fx="rise">
                <dt className="tt-caps text-[0.625rem] text-brass-deep">Batch</dt>
                <dd className="mt-2 text-sm text-ink/85">{facts.batch}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <aside className="lg:col-span-5">
        <div className="stone-card on-dark p-7 md:p-8" data-fx="rise">
          <p className="eyebrow">{RITUAL.eyebrow}</p>
          <h2 className="mt-4 font-display text-2xl text-paper">{RITUAL.title}</h2>
          <ol className="mt-6 space-y-4">
            {RITUAL.lines.map((line, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-xl leading-none text-brass-soft">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm leading-relaxed text-paper/85">{line}</p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </section>
  );
}
