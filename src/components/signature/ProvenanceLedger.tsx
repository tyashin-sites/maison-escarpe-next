import SectionHeading from '@/components/SectionHeading';

/**
 * Provenance ledger — the oud regions the house composes with and how each
 * one smells. Editorial, not sales: these are the standard terroir
 * descriptions (Assam/Hindi, Cambodi/Trat, Borneo, Sri Lanka, Bangladesh),
 * not claims about specific batches.
 */
const REGIONS = [
  { region: 'Assam, India', style: 'Hindi', notes: 'Camphor lift, hay, tobacco, worn leather. The oldest style of oud and the most animalic.' },
  { region: 'Pursat, Cambodia', style: 'Cambodi', notes: 'Honey, dried fruit, balsam. The sweetest of the classic ouds; the one most people meet first.' },
  { region: 'Trat, Thailand', style: 'Trat', notes: 'Within the Cambodi family: rounder, less barnyard, a soft resinous warmth.' },
  { region: 'Kalimantan, Borneo', style: 'Borneo', notes: 'Green, airy and syrupy at once, with a vanillic edge. Cleaner than the Indian styles.' },
  { region: 'Sri Lanka', style: 'Ceylon', notes: 'Pungent-woody with a sweet drydown; lighter animalics than Assam.' },
  { region: 'Sylhet, Bangladesh', style: 'Bangladeshi', notes: 'A cousin of Hindi oud: leather and smoke, slightly softer.' },
];

export default function ProvenanceLedger() {
  return (
    <section className="on-dark grain bg-ink">
      <div className="container-x py-[clamp(5.5rem,11vw,9.5rem)]">
        <SectionHeading
          eyebrow="Provenance"
          title="Six ouds. Six characters."
          subtitle="Two oils from the same forest can smell nothing alike, which is why every bottle names its batch, not just its region."
        />
        <div className="grid gap-px overflow-hidden rounded-md border border-brass-soft/15 bg-brass-soft/15 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => (
            <div key={r.region} className="spot relative bg-ink p-7" data-fx="rise">
              <p className="tt-caps text-[0.625rem] text-brass-soft">{r.style}</p>
              <h3 className="mt-2 font-display text-2xl text-paper">{r.region}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-dark">{r.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
