import { WEAR_LEVELS, type WearLevel } from '@/lib/attar';

/**
 * Wear scale — Intimate / Present / Commanding. The house never prints hours
 * (longevity claims need logged wear tests; docs/ASSET-DEBT.md #11). A scale
 * plus a sentence tells the visitor what to expect without inviting ridicule.
 */
export default function WearScale({ level }: { level: WearLevel }) {
  const idx = WEAR_LEVELS[level].index;
  return (
    <div>
      <div className="wear-scale" role="img" aria-label={`Wear: ${level}`}>
        {(Object.keys(WEAR_LEVELS) as WearLevel[]).map((k, i) => (
          <div key={k}>
            <div className={`wear-stop ${i <= idx ? 'is-on' : ''}`} />
            <p className={`mt-2 text-[0.6875rem] uppercase tracking-[0.14em] ${i === idx ? 'text-ink' : 'text-muted-foreground'}`}>
              {k}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{WEAR_LEVELS[level].blurb}</p>
    </div>
  );
}
