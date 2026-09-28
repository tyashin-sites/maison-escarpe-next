export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="attar-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse bg-paper-deep" />
      ))}
    </div>
  );
}
