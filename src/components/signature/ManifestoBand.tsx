import Link from 'next/link';

/**
 * Manifesto — one paragraph, masked word reveal (below fold only), one CTA.
 * Positioning copy in the house's voice; no factual claims about tests,
 * awards, or history.
 */
export default function ManifestoBand() {
  return (
    <section className="section bg-paper">
      <div className="container-x max-w-4xl">
        <p className="eyebrow">The house</p>
        <p className="tt-1 mt-6 text-ink" data-fx="words">
          We do not make perfume that announces itself. We make oil that stays — resin a tree spent decades
          defending, worn a hand&apos;s breadth from the heart, revealed only to those who come close.
        </p>
        <div className="hairline-solid mt-10 w-24" data-fx="draw" aria-hidden />
        <p className="lead mt-8 max-w-2xl" data-fx="rise">
          Maison Escarpe is named for the wall of dolostone that stands behind Burlington, Ontario. The rock took four
          hundred million years. The oud takes decades. We are not in a hurry either.
        </p>
        <div className="mt-10" data-fx="rise">
          <Link href="/about" className="btn-link text-ink">
            Read about the house
          </Link>
        </div>
      </div>
    </section>
  );
}
