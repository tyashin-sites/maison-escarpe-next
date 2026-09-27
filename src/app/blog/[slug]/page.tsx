import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, ApiError } from '@/lib/api';
import { pageMetadata, siteUrl, SITE } from '@/lib/seo';
import type { BlogPost } from '@/lib/types';

const SITE_ORIGIN = siteUrl('/').replace(/\/+$/, '');

// Pre-render every published post at build → served instantly from cache, so
// clicking a post in the list is immediate (no on-demand SSR round-trip). ISR
// keeps them fresh; dynamicParams lets posts added after build render on first
// hit then cache.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await api.getBlogPosts({ limit: 100 });
    return (res.data ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.getBlogPost(slug);
    const p = res.data;
    const title = p.seo?.metaTitle || p.title;
    const description =
      p.seo?.metaDescription ||
      p.excerpt ||
      (p.content ? p.content.replace(/<[^>]+>/g, ' ').slice(0, 160) : title);
    const img = p.seo?.ogImage || p.featuredImage;
    // Base OG/Twitter/canonical via the shared helper, then layer the
    // article-specific OG fields (BlogPosting JSON-LD comes from the edge).
    const base = pageMetadata({ title, description, path: `/blog/${slug}`, image: img, type: 'article' });
    return {
      ...base,
      openGraph: {
        ...base.openGraph,
        type: 'article',
        publishedTime: p.publishedAt,
        authors: p.authorName ? [p.authorName] : undefined,
        tags: p.tags,
      },
    };
  } catch {
    return { title: 'Blog post' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: BlogPost;
  try {
    const res = await api.getBlogPost(slug);
    post = res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    console.error('[blog post]', err);
    notFound();
  }

  const date = post.publishedAt ? new Date(post.publishedAt) : null;

  // schema.org BlogPosting — GEO/AEO surface for ChatGPT/Perplexity citations.
  const plainTextBody = (post.content || '').replace(/<[^>]+>/g, ' ').slice(0, 1000);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || plainTextBody.slice(0, 200),
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.authorName
      ? { '@type': 'Person', name: post.authorName }
      : { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_ORIGIN}/blog/${post.slug}` },
    keywords: post.tags?.join(', '),
  };

  // Render content. The backend says `contentFormat` is either 'html' or
  // 'markdown'. For markdown we'd need a renderer; for now treat both as
  // HTML — that matches what the admin RTE produces for this store today.
  const html =
    post.contentFormat === 'markdown'
      ? // Trivial markdown→HTML fallback (paragraphs only) so unwrapped MD doesn't
        // appear as one giant blob. Upgrade to a real parser later if we ever
        // start authoring in markdown.
        post.content
          .split(/\n{2,}/)
          .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
          .join('')
      : post.content;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <article className="container-x max-w-3xl py-10 md:py-16">
          <Link
            href="/blog"
            className="btn-link mb-8 text-muted-foreground hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" /> Journal
          </Link>

          <header className="mb-8">
            {date && (
              <time
                dateTime={date.toISOString()}
                className="eyebrow"
              >
                {date.toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            <h1 className="tt-1 mt-5 text-ink">
              {post.title}
            </h1>
            {post.authorName && (
              <p className="mt-3 text-sm text-muted-foreground">By {post.authorName}</p>
            )}
            {post.excerpt && (
              <p className="lead mt-4">{post.excerpt}</p>
            )}
          </header>

          {/* Only show a standalone hero when the body doesn't already lead with
              it. Auto-generated posts inline the featured image at the top of
              `content`, so rendering featuredImage again here showed it twice. */}
          {post.featuredImage && !post.content?.includes(post.featuredImage) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featuredImage}
              alt={post.title}
              className="mb-10 aspect-[16/9] w-full rounded-md object-cover"
            />
          )}

          <div
            // Same prose styling as the legal pages so admin-edited RTE content
            // renders cleanly without bringing in @tailwindcss/typography.
            className="prose-escarpe text-base leading-relaxed text-ink/85"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="tt-caps rounded-sm border border-border px-3 py-1.5 text-[0.625rem] text-muted-foreground hover:border-brass hover:text-ink"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <MoreFromTheBlog currentSlug={post.slug} />
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </div>
  );
}

/**
 * Related-posts strip — every post links its siblings so no post is a
 * one-inlink orphan, and readers have somewhere to go next.
 */
async function MoreFromTheBlog({ currentSlug }: { currentSlug: string }) {
  let posts;
  try {
    const res = await api.getBlogPosts({ limit: 4, page: 1 });
    posts = (res.data ?? []).filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return null;
  }
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="font-display text-xl font-semibold text-foreground">More from the blog</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {posts.map((p) => (
          <a
            key={p.slug}
            href={`/blog/${encodeURIComponent(p.slug)}`}
            className="group rounded-lg border border-border p-4 transition-colors hover:border-primary"
          >
            <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
              {p.title}
            </h3>
            {p.excerpt && (
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
