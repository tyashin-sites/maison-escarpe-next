import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import ProductCard from '@/components/ProductCard';
import ConcentrationStrip from '@/components/signature/ConcentrationStrip';
import CollectionTiles from '@/components/signature/CollectionTiles';
import SettleAndWake from '@/components/signature/SettleAndWake';
import ManifestoBand from '@/components/signature/ManifestoBand';
import ProvenanceLedger from '@/components/signature/ProvenanceLedger';
import ReserveBand from '@/components/signature/ReserveBand';
import { api } from '@/lib/api';
import { pageMetadata, SITE } from '@/lib/seo';
import type { ApiCategory, ApiProduct, BlogPost } from '@/lib/types';

export const metadata = pageMetadata({
  title: 'Maison Escarpe — Oil-Based Oud Attars, Composed in Canada',
  description: SITE.description,
  path: '/',
});

/** Home — server-rendered. Catalog reads are cached 60s by the API client. */
export default async function HomePage() {
  let categories: ApiCategory[] = [];
  let featured: ApiProduct[] = [];
  let posts: BlogPost[] = [];
  try {
    const [c, f, p] = await Promise.all([
      api.getCategories(),
      api.getProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'asc', category: 'signature' }),
      api.getRecentBlogPosts(3).catch(() => null),
    ]);
    categories = c.data ?? [];
    featured = f.data ?? [];
    posts = p?.data ?? [];
  } catch (err) {
    console.error('[home]', err);
  }
  if (featured.length < 4) {
    try {
      const all = await api.getProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'asc' });
      featured = all.data ?? featured;
    } catch {
      /* keep what we have */
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* ── Hero — LCP law: headline + image are transform-only, never hidden. */}
        <section className="dusk on-dark grain bg-ink" data-hero-stage>
          <div className="container-x grid grid-cols-1 items-center gap-12 py-20 md:py-24 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:gap-8 lg:py-16">
            <div className="lg:col-span-6">
              <p className="eyebrow hero-in-fade">Oil-based oud attars · Burlington, Ontario</p>
              <h1 className="tt-display hero-in mt-6 text-paper">
                Forty percent.
                <br />
                <em className="font-normal text-brass-soft">Four hundred</em> million years.
              </h1>
              <p className="lead hero-in-fade mt-7 max-w-md" style={{ animationDelay: '120ms' }}>
                Oud oil at a concentration most houses would not dare, composed at the foot of the Niagara
                Escarpment. Worn close. Kept long.
              </p>
              <div className="hero-in-fade mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '220ms' }}>
                <Link href="/products" className="btn btn-primary">
                  Explore the attars
                </Link>
                <Link href="/about" className="btn-link text-paper">
                  The house
                </Link>
              </div>
            </div>
            <div className="hero-in lg:col-span-6" style={{ animationDelay: '60ms' }}>
              <div className="media-frame mx-auto aspect-[3/4] max-w-[520px] lg:aspect-[4/5]">
                <picture>
                  <source srcSet="/hero.webp" type="image/webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero.jpg"
                    alt="A Maison Escarpe attar bottle on wet dolostone, the escarpment behind it at dusk"
                    width={1024}
                    height={1280}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    sizes="(max-width: 1024px) 90vw, 45vw"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>

        <ConcentrationStrip />

        {/* ── Collections */}
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="The collections"
              title="Three walls, one oil."
              subtitle="Every attar in the house is the same forty percent. What changes is the oud behind it and how far the batch goes."
            />
            <CollectionTiles categories={categories} />
          </div>
        </section>

        {/* ── Featured attars */}
        <section className="section bg-paper-deep/50 pt-0">
          <div className="container-x pt-[clamp(5.5rem,11vw,9.5rem)]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Signature" title="The entry to the wall." />
              <Link href="/products" className="btn-link mb-12 text-ink">
                All attars
              </Link>
            </div>
            {featured.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {featured.map((p, i) => (
                  <ProductCard key={p._id} product={p} eager={i < 2} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">The first batch is being poured. Join the list below to be first.</p>
            )}
          </div>
        </section>

        <SettleAndWake />

        <ManifestoBand />

        <ProvenanceLedger />

        {/* ── Journal teaser (renders only when posts exist — no ghost section) */}
        {posts.length > 0 && (
          <section className="section pt-0">
            <div className="container-x">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionHeading eyebrow="Journal" title="Notes from the house." />
                <Link href="/blog" className="btn-link mb-12 text-ink">
                  All entries
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="card group overflow-hidden">
                    {post.featuredImage && (
                      <div className="media-frame aspect-[16/10]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.featuredImage} alt="" loading="lazy" width={800} height={500} />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-display text-xl leading-snug text-ink">{post.title}</h3>
                      {post.excerpt && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ReserveBand />
      </main>
      <Footer />
    </div>
  );
}
