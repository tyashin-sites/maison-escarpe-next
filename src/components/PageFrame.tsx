import Header from './Header';
import Footer from './Footer';

/**
 * Page chrome. The header is fixed; pages with a light opening pad the top by
 * the header height, pages with a dark cinematic opening let it sit over the
 * image (`tone="dark"`).
 */
export default function PageFrame({ tone = 'light', children }: { tone?: 'light' | 'dark'; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header tone={tone} />
      <main id="main" tabIndex={-1} className={`flex-1 ${tone === 'light' ? 'pt-[var(--header-h)]' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
