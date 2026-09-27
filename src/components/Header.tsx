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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  return (
    <header className="site-header sticky top-0 z-50 bg-paper/80 backdrop-blur-md">
      <div className="container-x flex h-full items-center justify-between">
        <Link href="/" className="header-logo text-ink">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative p-2 text-muted-foreground transition-colors hover:text-ink"
            aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brass px-1 text-[10px] font-semibold text-ink">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="p-2 text-muted-foreground lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-full border-t border-brass/20 bg-paper lg:hidden">
          <nav className="flex flex-col py-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-paper-deep hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-paper-deep hover:text-ink"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
