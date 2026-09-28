import PageFrame from '@/components/PageFrame';
import { notFound } from 'next/navigation';

const PROJECT_ID = process.env.PROJECT_ID || '6ab98d8af53db5cdd5d093f3';
const API_URL = process.env.TYASHIN_API_URL || 'https://website-api.tyashin.com';

interface LegalPageData {
  title: string;
  content: string;
  updatedAt?: string;
}

async function loadLegalPage(slug: string): Promise<LegalPageData | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/public/legal/${slug}?projectId=${PROJECT_ID}&format=json`, {
      headers: { 'X-API-Key': process.env.TYASHIN_API_KEY || '' },
      next: { revalidate: 300 },
    });
    const json = (await res.json()) as { success: boolean; data?: LegalPageData };
    return json.success ? (json.data ?? null) : null;
  } catch {
    return null;
  }
}

/** Admin-edited legal page (T&C / Privacy / Returns) inside the site chrome. */
export default async function LegalPageRenderer({ slug }: { slug: string }) {
  const page = await loadLegalPage(slug);
  if (!page) notFound();

  return (
    <PageFrame>
        <section className="bg-paper">
          <div className="container-x pb-[clamp(2rem,4vw,3.5rem)] pt-[clamp(3rem,7vw,6rem)]">
            <p className="eyebrow">Terms</p>
            <h1 className="tt-1 mt-5 text-ink">{page.title}</h1>
          </div>
        </section>
        <section className="section">
          <div className="container-x max-w-3xl">
            <div className="prose-escarpe text-base leading-relaxed text-ink/85" dangerouslySetInnerHTML={{ __html: page.content }} />
            {page.updatedAt && (
              <p className="mt-10 text-xs text-muted-foreground">Last updated {new Date(page.updatedAt).toLocaleDateString('en-CA')}</p>
            )}
          </div>
        </section>
      </PageFrame>
  );
}
