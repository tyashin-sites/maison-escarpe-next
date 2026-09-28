/**
 * Chapter II — The oil. A full-bleed macro of the oil on one side, the
 * numeral on the other. Every line is a design decision of the house or a
 * fact the customer supplied; nothing is measured or claimed.
 */
export default function OilChapter() {
  return (
    <section className="on-dark grain relative bg-ink-deep" aria-labelledby="oil-title">
      <div className="grid lg:grid-cols-2">
        <div className="bleed-img relative aspect-[4/5] lg:aspect-auto lg:min-h-[100svh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/oil-macro.jpg"
            alt="Macro of oud oil mixing inside glass after being shaken"
            width={1536}
            height={1024}
            loading="lazy"
            data-parallax="0.06"
            className="!h-[112%] !-translate-y-[6%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-deep/40" aria-hidden />
        </div>
        <div className="relative flex flex-col justify-center px-[clamp(1.25rem,5vw,6rem)] py-[clamp(5rem,10vw,9rem)]">
          <p className="eyebrow">The oil</p>
          <p className="tt-numeral mt-6 text-brass-soft" aria-hidden data-fx="rise">
            40<span className="align-top text-[0.28em] tracking-[0.1em]">%</span>
          </p>
          <h2 id="oil-title" className="tt-2 mt-4 max-w-[18ch] text-paper" data-fx="words">
            Concentrate in oil. No alcohol, no water, nothing added to keep it uniform.
          </h2>
          <dl className="mt-10 grid max-w-xl gap-6 sm:grid-cols-3">
            {[
              ['Oil, not spray', 'It sits on the skin instead of evaporating from it.'],
              ['Shake to awaken', 'Natural resins settle. Turn the flacon twice before you wear it.'],
              ['Poured by weight', 'Every flacon is filled by hand on a balance, then numbered.'],
            ].map(([k, v]) => (
              <div key={k} data-fx="rise">
                <dt className="tt-caps text-brass-soft">{k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-paper/75">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
