/**
 * The wordmark is TYPE, never an image (DESIGN-SPEC): "MAISON" small above
 * "ESCARPE" in Bodoni small caps. Inherits currentColor so it works on paper
 * and on ink.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark-top">Maison</span>
      <span className="wordmark-main">Escarpe</span>
    </span>
  );
}
