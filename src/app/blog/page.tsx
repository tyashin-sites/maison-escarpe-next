import Link from 'next/link';
import PageFrame from '@/components/PageFrame';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import PaginationNav from '@/components/PaginationNav';
import { api } from '@/lib/api';
import { pageMetadata } from '@/lib/seo';
import type { BlogPost, ApiMeta } from '@/lib/types';

export const metadata = pageMetadata({
  title: 'Journal',
  description:
    'Notes from Maison Escarpe: how to wear oil attars, what oud costs and why, provenance by region, and the house’s own batches.',
  path: '/blog',
});

const PAGE_SIZE = 12;

interface SearchParams {
  page?: string;
  category?: string;
  tag?: string;
}

export default async function BlogIndexPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const page = parseInt(sp.page || '1', 10);
  let posts: BlogPost[] = [];
  let meta: ApiMeta = { total: 0, page, limit: PAGE_SIZE, totalPages: 1 };
  try {
    const params: Record<string, string | number> = { limit: PAGE_SIZE, page };
    if (sp.category) params.category = sp.category;
    if (sp.tag) params.tag = sp.tag;
    const res = await api.getBlogPosts(params);
    posts = res.data ?? [];
    meta = res.meta ?? meta;
  } catch (err) {
    console.error('[blog]', err);
  }

  return (
    <PageFrame>
        <section className="bg-paper">
          <div className="container-x pb-[clamp(2rem,4vw,3.5rem)] pt-[clamp(3rem,7vw,6rem)]">
            <p className="eyebrow">Journal</p>
            <h1 className="tt-1 mt-5 max-w-3xl text-ink">
              {sp.tag ? `Entries tagged “${sp.tag}”` : sp.category ? sp.category : 'Notes from the house.'}
            </h1>
            {!sp.tag && !sp.category && (
              <p className="lead mt-4 max-w-2xl">On wearing oil, on what oud costs, on the batches as they are poured.</p>
            )}
          </div>
        </section>
        <section className="section">
          <div className="container-x">
            {posts.length === 0 ? (
              <p className="text-muted-foreground">The first entries are being written.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="card group flex flex-col overflow-hidden">
                    {post.featuredImage && (
                      <div className="media-frame aspect-[16/10]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.featuredImage} alt="" loading="lazy" width={800} height={500} />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {post.pinned && <span className="tt-caps mb-2 text-[0.625rem] text-brass">Featured</span>}
                      <h2 className="font-display text-xl leading-snug text-ink">{post.title}</h2>
                      {post.excerpt && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>}
                      {post.publishedAt && (
                        <time className="mt-auto pt-4 text-xs text-muted-foreground" dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <PaginationNav currentPage={meta.page} totalPages={meta.totalPages} basePath="/blog" params={{ ...(sp.tag ? { tag: sp.tag } : {}), ...(sp.category ? { category: sp.category } : {}) }} />
          </div>
        </section>
      <KnowledgeGraph
        path="/blog"
        type="CollectionPage"
        title="Journal"
        description="Notes from Maison Escarpe: how to wear oil attars, what oud costs and why, provenance by region."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Journal' }]}
      />
    </PageFrame>
  );
}
