import Link from 'next/link';
import PageFrame from '@/components/PageFrame';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import ListCapture from '@/components/signature/ListCapture';
import { pageMetadata, SITE } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'The House',
  description:
    'Maison Escarpe is a Canadian house of oil-based oud attars at forty percent concentrate, named for the Niagara Escarpment behind Burlington, Ontario. The rock, the oil, the promise.',
  path: '/about',
});

/**
 * The House — trust page. Public facts about the place and the house's own
 * intent only. No founder biography, history or awards were supplied
 * (docs/ASSET-DEBT.md #9); none are invented.
 */
export default function AboutPage() {
  return (
    <PageFrame tone="dark">
      <section className="cinema grain" aria-label="The house">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/about-cliff.jpg" alt="Dolostone cliff of the Niagara Escarpment at dusk" className="cinema-img" width={1536} height={1024} fetchPriority="high" loading="eager" decoding="async" />
        <div className="cinema-veil" aria-hidden />
        <div className="container-x relative z-[2] flex min-h-[100svh] flex-col justify-end pb-[clamp(3rem,7vh,6rem)] pt-[calc(var(--header-h)+2rem)] text-paper">
          <p className="eyebrow hero-in-fade text-brass-soft">The house</p>
          <h1 className="tt-display hero-in mt-6 max-w-[16ch]">Named for a wall of stone that took four hundred million years.</h1>
          <p className="lead hero-in-fade measure mt-8 text-paper/78" style={{ animationDelay: '140ms' }}>
            The Niagara Escarpment rises directly behind {SITE.city}: dolostone laid down in a shallow sea, lifted, and left
            to weather. The house is composed in its shadow.
          </p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-x lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-3">
            <p className="eyebrow">The rock</p>
          </div>
          <div className="mt-6 lg:col-span-8 lg:mt-0">
            <h2 className="tt-1 max-w-[16ch] text-ink" data-fx="words">
              Slow things, done properly.
            </h2>
            <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-ink/80">
              <p data-fx="rise">
                An escarpe, in the old French of fortification, is the steep inner wall of a ditch — the last wall before the
                keep. We liked the idea of a house you are let inside of, rather than one that sells to everyone at once.
              </p>
              <p data-fx="rise">
                Oud is the same kind of thing. A tree is wounded, defends itself with resin for decades, and only then does
                the wood become worth distilling. Nothing about it is quick, and nothing about it should be cheap.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="on-dark relative bg-ink" aria-labelledby="oil-title">
        <div className="lg:grid lg:grid-cols-2">
          <div className="bleed-img aspect-[4/5] lg:aspect-auto lg:min-h-[100svh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/about-atelier.jpg" alt="A composing bench: brass scale, vials of oil, raw agarwood" width={1536} height={1024} loading="lazy" data-parallax="0.06" className="!h-[112%] !-translate-y-[6%]" />
          </div>
          <div className="flex flex-col justify-center px-[clamp(1.25rem,5vw,6rem)] py-[clamp(5rem,10vw,9rem)]">
            <p className="eyebrow">The oil</p>
            <h2 id="oil-title" className="tt-1 mt-5 max-w-[14ch] text-paper" data-fx="words">
              Forty percent, and nothing to hide it.
            </h2>
            <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-paper/80">
              <p data-fx="rise">
                Most fine fragrance is fifteen to twenty-five percent aromatic material in alcohol. Ours is forty percent in
                oil. There is no alcohol to flash off, no water, and no solubiliser to keep the natural resins evenly
                suspended — which is why the flacon asks to be shaken before it is worn.
              </p>
              <p data-fx="rise">
                Oil sits on the skin instead of evaporating from it. The attars are built to stay: on a cuff or a scarf they
                are meant to linger for days, and on skin to carry through a day and a night. We would rather you found that
                out yourself than read a number here.
              </p>
            </div>
            <Link href="/products" className="btn-link mt-10 text-paper" data-fx="rise">
              Explore the attars
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-x">
          <p className="eyebrow">The promise</p>
          <ol className="mt-10 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {[
              ['Numbered, not endless', 'Each attar is poured in small batches and numbered. When a batch is gone it is gone; the next one is offered to the list first.'],
              ['Named provenance', 'Every flacon names the oud behind it — region and batch — because two oils from the same forest rarely smell alike.'],
              ['Nothing added to flatter it', 'No alcohol, no water, no solubilisers, no stabilisers. Shake gently and wear.'],
              ['Composed in Ontario', 'Blended, matured and hand-filled by weight in Burlington, Ontario, and shipped by courier across Canada and the United States.'],
            ].map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] gap-6 border-t border-ink/15 pt-6" data-fx="rise">
                <span className="font-display text-2xl text-brass-deep">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{t}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ListCapture />
      <KnowledgeGraph
        path="/about"
        type="AboutPage"
        title="The House"
        description="Maison Escarpe is a Canadian house of oil-based oud attars at forty percent concentrate, named for the Niagara Escarpment behind Burlington, Ontario."
        image="/about-cliff.jpg"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'The house' }]}
      />
    </PageFrame>
  );
}
