import PageFrame from '@/components/PageFrame';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';

export default function ProductsLoading() {
  return (
    <PageFrame>
      <section className="bg-paper">
        <div className="container-x pb-[clamp(2rem,4vw,3.5rem)] pt-[clamp(3rem,7vw,6rem)]">
          <div className="h-3 w-24 animate-pulse bg-paper-deep" />
          <div className="mt-6 h-12 w-2/3 max-w-xl animate-pulse bg-paper-deep" />
        </div>
      </section>
      <section className="pb-[clamp(6rem,12vw,11rem)] pt-4">
        <div className="container-x">
          <ProductGridSkeleton count={6} />
        </div>
      </section>
    </PageFrame>
  );
}
