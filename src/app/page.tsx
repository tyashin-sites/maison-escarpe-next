import Link from 'next/link';
import PageFrame from '@/components/PageFrame';
import ProductCard from '@/components/ProductCard';
import OilChapter from '@/components/signature/OilChapter';
import CollectionRail from '@/components/signature/CollectionRail';
import RitualChapter from '@/components/signature/RitualChapter';
import ManifestoBand from '@/components/signature/ManifestoBand';
import ProvenanceLedger from '@/components/signature/ProvenanceLedger';
import ListCapture from '@/components/signature/ListCapture';
import { api } from '@/lib/api';
import { pageMetadata, SITE } from '@/lib/seo';
import type { ApiCategory, ApiProduct, BlogPost } from '@/lib/types';

export const metadata = pageMetadata({
  title: 'Maison Escarpe — Oil-Based Oud Attars, Composed in Canada',
  description: SITE.description,
  path: '/',
});

export default async function HomePage() {
  let categories: ApiCategory[] = [];
  let attars: ApiProduct[] = [];
  let posts: BlogPost[] = [];
  try {
    const [c, a, p] = await Promise.all([
      api.getCategories(),
      api.getProducts({ limit: 12, sortBy: 'createdAt', sortOrder: 'asc' }),
      api.getRecentBlogPosts(3).catch(() => null),
    ]);
    categories = c.data ?? [];
    attars = (a.data ?? []).filter((x) => !/discovery|sample/.test(x.tags.join(' ')));
    posts = p?.data ?? [];
  } catch (err) {
    console.error('[home]', err);
  }
  const bySlug = Object.fromEntries(attars.map((a) => [a.slug, a]));
  const railImage = (slug: string) => bySlug[slug]?.images?.[0]?.url;

  return (
    <PageFrame tone="dark">
      {/* ── I. The hero: full-bleed, the flacon on the ledge, the cliff behind. */}
      <section className="cinema grain" aria-label="Maison Escarpe">
        <picture>
          <source media="(max-width: 767px)" srcSet="/hero-tall.webp" type="image/webp" />
          <source media="(max-width: 767px)" srcSet="/hero-tall.jpg" />
          <source srcSet="/hero-wide.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-wide.jpg"
            alt="A Maison Escarpe flacon standing on a wet dolostone ledge, the Niagara Escarpment behind it at dusk"
            className="cinema-img"
            width={1536}
            height={1024}
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div className="cinema-veil cinema-veil-top md:cinema-veil" aria-hidden />
        <div className="container-x relative z-[2] flex min-h-[100svh] flex-col justify-start pb-[clamp(3rem,7vh,6rem)] pt-[calc(var(--header-h)+3rem)] text-paper md:justify-end md:pt-[calc(var(--header-h)+2rem)]">
          <p className="eyebrow hero-in-fade text-brass-soft">Oil-based oud attars · Burlington, Ontario</p>
          <h1 className="tt-display hero-in mt-6">
            Forty percent.
            <br />
            <em className="font-normal text-brass-soft">Four hundred</em>
            <br />
            million years.
          </h1>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="lead hero-in-fade measure text-paper/78" style={{ animationDelay: '140ms' }}>
              Oud oil at a concentration most houses would not dare, composed at the foot of the Niagara Escarpment.
              Worn close. Kept long.
            </p>
            <div className="hero-in-fade flex items-center gap-8" style={{ animationDelay: '260ms' }}>
              <Link href="/products" className="btn btn-primary">
                Explore the attars
              </Link>
              <Link href="/about" className="btn-link text-paper">
                The house
              </Link>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-[2] hidden -translate-x-1/2 md:block">
          <span className="scroll-cue">Scroll</span>
        </div>
      </section>

      {/* ── II. The oil */}
      <OilChapter />

      {/* ── III. The collections — three walls */}
      <CollectionRail
        categories={categories}
        images={{
          signature: railImage('dusk'),
          reserve: railImage('rampart'),
          'private-blend': railImage('rattlesnake-point'),
        }}
      />

      {/* ── IV. The attars */}
      <section className="section bg-paper">
        <div className="container-x">
          <div className="mb-[clamp(3rem,6vw,5rem)] flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="eyebrow">The attars</p>
              <h2 className="tt-1 mt-5 max-w-[16ch] text-ink" data-fx="words">
                One oil, worn twelve ways.
              </h2>
            </div>
            <Link href="/products" className="btn-link mb-2 text-ink">
              All attars
            </Link>
          </div>
          {attars.length > 0 ? (
            <div className="attar-grid is-staggered">
              {attars.slice(0, 6).map((p, i) => (
                <div key={p._id} data-fx="rise">
                  <ProductCard product={p} eager={i < 2} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">The first batch is being poured. Join the list below to be first.</p>
          )}
          <div className="mt-[clamp(4rem,9vw,8rem)] text-center md:mt-[clamp(6rem,12vw,10rem)]">
            <Link href="/products" className="btn btn-ghost">
              See all twelve
            </Link>
          </div>
        </div>
      </section>

      {/* ── V. The ritual */}
      <RitualChapter />

      {/* ── VI. Manifesto */}
      <ManifestoBand />

      {/* ── VII. Provenance */}
      <ProvenanceLedger />

      {/* ── VIII. Journal (only when entries exist) */}
      {posts.length > 0 && (
        <section className="section bg-paper">
          <div className="container-x">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Journal</p>
                <h2 className="tt-1 mt-5 text-ink">Notes from the house.</h2>
              </div>
              <Link href="/blog" className="btn-link mb-2 text-ink">
                All entries
              </Link>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  {post.featuredImage && (
                    <div className="bleed-img aspect-[16/10]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.featuredImage} alt="" loading="lazy" width={800} height={500} />
                    </div>
                  )}
                  <h3 className="mt-5 font-display text-2xl leading-snug text-ink">{post.title}</h3>
                  {post.excerpt && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── IX. The list */}
      <ListCapture />
    </PageFrame>
  );
}
