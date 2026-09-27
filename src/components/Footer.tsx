'use client';

import Link from 'next/link';
import { useCategories } from './Providers';
import Wordmark from './Wordmark';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { SITE } from '@/lib/seo';

/**
 * Footer — the site-wide inbound-link safety net (addendum §3e): every
 * collection, every legal page, FAQ, journal, contact. Client component so it
 * reads the live category list. No email / phone / street address is shown —
 * none has been supplied (docs/ASSET-DEBT.md #7). Never invent one.
 */
export default function Footer() {
  const { categories } = useCategories();

  return (
    <footer className="on-dark grain bg-ink text-paper">
      <div className="container-x relative py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark className="text-paper" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-dark">
              A Canadian house of oil-based oud attars at forty percent concentrate. Composed in{' '}
              {SITE.city}, {SITE.region}. Shipped across Canada and the United States.
            </p>
            <p className="mt-6 font-display text-lg italic text-brass-soft">{SITE.tagline}</p>
          </div>

          <div className="md:col-span-2">
            <h4 className="tt-caps mb-5 text-brass-soft">Collections</h4>
            <nav className="flex flex-col gap-2.5">
              <Link href="/products" className="text-sm text-paper/80 transition-colors hover:text-paper">
                All attars
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={getCategoryLandingHref(cat.slug)}
                  className="text-sm text-paper/80 transition-colors hover:text-paper"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-2">
            <h4 className="tt-caps mb-5 text-brass-soft">The house</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Journal', href: '/blog' },
                { label: 'Questions', href: '/faq' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-paper/80 transition-colors hover:text-paper">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <h4 className="tt-caps mb-5 text-brass-soft">Terms</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: 'Shipping & returns', href: '/return-policy' },
                { label: 'Privacy', href: '/privacy-policy' },
                { label: 'Terms & conditions', href: '/terms-and-conditions' },
                { label: 'Order status', href: '/order-status' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-paper/80 transition-colors hover:text-paper">
                  {l.label}
                </Link>
              ))}
            </nav>
            <p className="mt-8 text-xs leading-relaxed text-muted-dark">
              For external use only. Natural oils settle; shake gently before each wear. Patch-test on the inner arm
              before first use.
            </p>
          </div>
        </div>

        <div className="hairline mt-14" aria-hidden />
        {/* Platform attribution (addendum §3f) — last line, centred, inherits the footer's own type. */}
        <p className="mt-6 text-center text-xs text-muted-dark">
          Powered by{' '}
          <a href="https://tyashin.com" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            Tyashin
          </a>
        </p>
      </div>
    </footer>
  );
}
