import PageFrame from '@/components/PageFrame';

export default function ProductLoading() {
  return (
    <PageFrame>
        <div className="container-x py-8 md:py-12">
          <div className="mb-6 h-4 w-40 animate-pulse rounded bg-paper-deep" />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="aspect-[3/4] w-full animate-pulse rounded-md bg-paper-deep lg:col-span-7" />
            <div className="space-y-4 lg:col-span-5">
              <div className="h-3 w-24 animate-pulse rounded bg-paper-deep" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-paper-deep" />
              <div className="h-5 w-full animate-pulse rounded bg-paper-deep" />
              <div className="h-8 w-32 animate-pulse rounded bg-paper-deep" />
              <div className="h-12 w-full animate-pulse rounded bg-paper-deep" />
            </div>
          </div>
        </div>
      </PageFrame>
  );
}
