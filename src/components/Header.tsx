'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from './Providers';
import Wordmark from './Wordmark';

const NAV_LINKS = [
  { label: 'The Attars', href: '/products' },
  { label: 'Signature', href: '/category/signature' },
  { label: 'Reserve', href: '/category/reserve' },
  { label: 'Private Blend', href: '/category/private-blend' },
  { label: 'The House', href: '/about' },
  { label: 'Journal', href: '/blog' },
];

/**
 * Header. `tone="dark"` on pages that open with a full-bleed dark hero: the
 * bar starts transparent with paper text and becomes paper glass once the
 * visitor scrolls (HeaderFX toggles .is-scrolled). Height never changes.
 */
export default function Header({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 ${mobileOpen ? 'is-open' : ''}`} data-tone={tone}>
      <div className="container-x flex h-full items-center justify-between">
        <Link href="/" className="header-logo">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link" aria-current={pathname === link.href ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/cart" className="header-icon relative p-2 transition-colors" aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 text-[10px] font-semibold text-ink">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="header-icon p-2 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.25} /> : <Menu className="h-5 w-5" strokeWidth={1.25} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-full border-t border-brass/20 bg-paper text-ink lg:hidden">
          <nav className="flex flex-col py-3" aria-label="Mobile">
            {[...NAV_LINKS, { label: 'Contact', href: '/contact' }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-3.5 font-display text-2xl text-ink transition-colors hover:bg-paper-deep"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
