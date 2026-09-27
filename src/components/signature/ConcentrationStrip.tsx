/**
 * Concentration strip — four quiet facts with brass hairline columns. Every
 * line is a fact the customer supplied at intake or a design decision of the
 * house; there are no statistics here to invent.
 */
const FACTS = [
  { k: '40%', v: 'oil concentrate' },
  { k: 'Oil', v: 'no alcohol, no water' },
  { k: 'Ontario', v: 'composed in Burlington' },
  { k: 'Numbered', v: 'small batches, by allocation' },
];

export default function ConcentrationStrip() {
  return (
    <section className="border-b border-brass/20 bg-paper" aria-label="The house in four facts">
      <div className="container-x grid grid-cols-2 divide-brass/20 md:grid-cols-4 md:divide-x">
        {FACTS.map((f, i) => (
          <div key={f.k} className={`py-8 md:py-10 ${i > 0 ? 'md:pl-8' : ''}`} data-fx="rise">
            <p className="font-display text-3xl text-ink md:text-4xl">{f.k}</p>
            <p className="tt-caps mt-2 text-[0.6875rem] text-muted-foreground">{f.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
