import Link from 'next/link';

/** Chapter VI — the manifesto. One sentence, set large, and nothing else. */
export default function ManifestoBand() {
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <p className="eyebrow">The house</p>
        <p className="tt-1 mt-8 max-w-[22ch] text-ink" data-fx="words">
          We do not make perfume that announces itself. We make oil that stays — resin a tree spent decades
          defending, worn a hand&apos;s breadth from the heart, revealed only to those who come close.
        </p>
        <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <p className="lead measure" data-fx="rise">
            Named for the wall of dolostone behind Burlington, Ontario. The rock took four hundred million years.
            The oud takes decades. We are not in a hurry either.
          </p>
          <Link href="/about" className="btn-link shrink-0 text-ink" data-fx="rise">
            Read about the house
          </Link>
        </div>
      </div>
    </section>
  );
}
