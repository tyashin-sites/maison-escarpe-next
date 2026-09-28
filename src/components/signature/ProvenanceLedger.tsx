/**
 * Chapter VII — provenance. Six regions as large type rows. The notes are the
 * standard terroir descriptions, not claims about any batch.
 */
const REGIONS = [
  ['Hindi', 'Assam, India', 'Camphor lift, hay, tobacco, worn leather. The oldest style of oud and the most animalic.'],
  ['Cambodi', 'Pursat, Cambodia', 'Honey, dried fruit, balsam. The sweetest of the classic ouds; the one most people meet first.'],
  ['Trat', 'Trat, Thailand', 'Within the Cambodi family: rounder, less barnyard, a soft resinous warmth.'],
  ['Borneo', 'Kalimantan, Borneo', 'Green, airy and syrupy at once, with a vanillic edge. Cleaner than the Indian styles.'],
  ['Ceylon', 'Sri Lanka', 'Pungent-woody with a sweet drydown; lighter animalics than Assam.'],
  ['Bangladeshi', 'Sylhet, Bangladesh', 'A cousin of Hindi oud: leather and smoke, slightly softer.'],
];

export default function ProvenanceLedger() {
  return (
    <section className="on-dark grain bg-ink" aria-labelledby="prov-title">
      <div className="container-x py-[clamp(6rem,12vw,11rem)] lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow">Provenance</p>
          <h2 id="prov-title" className="tt-1 mt-5 text-paper" data-fx="words">
            Six ouds. Six characters.
          </h2>
          <p className="lead mt-6 max-w-sm" data-fx="rise">
            Two oils from the same forest can smell nothing alike, which is why every flacon names its batch, not
            just its region.
          </p>
        </div>
        <ol className="mt-12 lg:col-span-8 lg:mt-0">
          {REGIONS.map(([style, region, note], i) => (
            <li key={region} className="prov-row" data-fx="rise">
              <span className="tt-caps text-brass-soft">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="prov-name">{region}</p>
                <p className="tt-caps mt-2 text-brass-soft/80">{style}</p>
              </div>
              <p className="prov-note">{note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
