import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="on-dark grain flex flex-1 flex-col items-center justify-center bg-ink px-6 py-32 text-center">
        <p className="eyebrow eyebrow-center">Not here</p>
        <h1 className="tt-display mt-6 text-paper" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
          This wall has no door.
        </h1>
        <p className="lead mt-5 max-w-md">The page you were looking for is not part of the house.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            Back to the house
          </Link>
          <Link href="/products" className="btn btn-ghost">
            The attars
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
