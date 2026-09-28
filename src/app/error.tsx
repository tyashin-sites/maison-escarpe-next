'use client';

import Link from 'next/link';

/** User-facing fallback only (addendum §8). Reporting is the platform's (§3h). */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="on-dark flex min-h-[100svh] flex-col items-center justify-center bg-ink px-6 py-32 text-center">
      <p className="eyebrow eyebrow-center">Something slipped</p>
      <h1 className="tt-1 mt-6 max-w-[16ch] text-paper">The page did not pour correctly.</h1>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to the house
        </Link>
      </div>
    </div>
  );
}
