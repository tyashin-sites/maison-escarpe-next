import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Questions',
  description:
    'How to wear an oil attar, why the bottle separates, how long it lasts, shipping to Canada and the United States, allergens and returns — answered by Maison Escarpe.',
  path: '/faq',
});

interface FaqEntry {
  _id: string;
  question: string;
  answer: string;
  order?: number;
}

const PROJECT_ID = process.env.PROJECT_ID || '6ab98d8af53db5cdd5d093f3';
const API_URL = process.env.TYASHIN_API_URL || 'https://website-api.tyashin.com';

async function loadFaqs(): Promise<FaqEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/public/faq?projectId=${PROJECT_ID}`, {
      headers: { 'X-API-Key': process.env.TYASHIN_API_KEY || '' },
      next: { revalidate: 300 },
    });
    const json = (await res.json()) as { success: boolean; data?: FaqEntry[] };
    return json.success ? (json.data ?? []) : [];
  } catch (err) {
    console.error('[faq]', err);
    return [];
  }
}

export default async function FaqPage() {
  const faqs = await loadFaqs();
  const jsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/<[^>]+>/g, ' ') },
        })),
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-b border-brass/20 bg-paper">
          <div className="container-x py-14 md:py-20">
            <p className="eyebrow">Questions</p>
            <h1 className="tt-1 mt-5 max-w-3xl text-ink">Everything we are asked, answered once.</h1>
          </div>
        </section>
        <section className="section">
          <div className="container-x max-w-3xl">
            {faqs.length === 0 ? (
              <p className="text-muted-foreground">
                The questions page is being written. In the meantime,{' '}
                <Link href="/contact" className="text-brass underline underline-offset-2">
                  write to the house
                </Link>
                .
              </p>
            ) : (
              <div className="divide-y divide-border border-y border-border">
                {faqs.map((f) => (
                  <details key={f._id} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-xl text-ink">
                      {f.question}
                      <span className="mt-1 shrink-0 text-brass transition-transform group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <div className="prose-escarpe mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: f.answer }} />
                  </details>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />}
    </div>
  );
}
