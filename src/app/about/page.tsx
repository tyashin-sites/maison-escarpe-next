import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReserveBand from '@/components/signature/ReserveBand';
import { pageMetadata, SITE } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'The House',
  description:
    'Maison Escarpe is a Canadian house of oil-based oud attars at forty percent concentrate, named for the Niagara Escarpment behind Burlington, Ontario. The rock, the oil, the promise.',
  path: '/about',
});

/**
 * The House — trust page. Everything here is either a public fact about the
 * place (the Niagara Escarpment) or the house's own intent. There is no
 * founder biography, no history, no awards: none were supplied
 * (docs/ASSET-DEBT.md #9). Never invent them.
 */
export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="on-dark grain relative bg-ink">
          <div className="container-x grid items-end gap-10 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow hero-in-fade">The house</p>
              <h1 className="tt-display hero-in mt-6 text-paper" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
                Named for a wall of stone that took four hundred million years.
              </h1>
            </div>
            <p className="lead hero-in-fade lg:col-span-5" style={{ animationDelay: '140ms' }}>
              The Niagara Escarpment rises directly behind {SITE.city}: dolostone laid down in a shallow sea,
              lifted, and left to weather. The house is composed in its shadow.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="media-frame aspect-[4/3] lg:col-span-6" data-parallax="0.08">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/about-cliff.jpg" alt="Dolostone cliff of the Niagara Escarpment at dusk" width={1536} height={1024} loading="lazy" />
            </div>
            <div className="lg:col-span-6">
              <p className="eyebrow">The rock</p>
              <h2 className="tt-1 mt-5 text-ink" data-fx="words">
                Slow things, done properly.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/85">
                <p data-fx="rise">
                  An escarpe, in the old French of fortification, is the steep inner wall of a ditch — the last wall
                  before the keep. We liked the idea of a house you are let inside of, rather than one that sells to
                  everyone at once.
                </p>
                <p data-fx="rise">
                  Oud is the same kind of thing. A tree is wounded, defends itself with resin for decades, and only
                  then does the wood become worth distilling. Nothing about it is quick, and nothing about it should be
                  cheap.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="on-dark grain bg-stone">
          <div className="container-x grid gap-12 py-[clamp(5.5rem,11vw,9.5rem)] lg:grid-cols-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:col-span-6">
              <p className="eyebrow">The oil</p>
              <h2 className="tt-1 mt-5 text-paper" data-fx="words">
                Forty percent, and nothing to hide it.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-paper/85">
                <p data-fx="rise">
                  Most fine fragrance is fifteen to twenty-five percent aromatic material in alcohol. Ours is forty
                  percent in oil. There is no alcohol to flash off, no water, and no solubiliser to keep the natural
                  resins evenly suspended — which is why the bottle asks to be shaken before it is worn.
                </p>
                <p data-fx="rise">
                  Oil sits on the skin instead of evaporating from it. The attars are built to stay: on a cuff or a
                  scarf they are meant to linger for days, and on skin to carry through a day and a night. We would
                  rather you found that out yourself than read a number here.
                </p>
              </div>
              <Link href="/products" className="btn-link mt-8 text-paper">
                Explore the attars
              </Link>
            </div>
            <div className="media-frame order-1 aspect-[4/3] lg:order-2 lg:col-span-6" data-parallax="0.08">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/about-atelier.jpg" alt="A composing bench: brass scale, vials of oil, raw agarwood" width={1536} height={1024} loading="lazy" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-x max-w-4xl">
            <p className="eyebrow">The promise</p>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
              {[
                ['Numbered, not endless', 'Each attar is poured in small batches and numbered. When a batch is gone it is gone; the next one is offered to the list first.'],
                ['Named provenance', 'Every bottle names the oud behind it — region and batch — because two oils from the same forest rarely smell alike.'],
                ['Nothing added to flatter it', 'No alcohol, no water, no solubilisers, no stabilisers. Shake gently and wear.'],
                ['Composed in Ontario', 'Blended, matured and hand-filled by weight in Burlington, Ontario, and shipped by courier across Canada and the United States.'],
              ].map(([t, d]) => (
                <li key={t} className="spot relative bg-paper p-7" data-fx="rise">
                  <h3 className="font-display text-xl text-ink">{t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ReserveBand />
      </main>
      <Footer />
    </div>
  );
}
