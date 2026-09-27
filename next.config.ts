import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();

const PROJECT_ID = process.env.PROJECT_ID || '6ab98d8af53db5cdd5d093f3';
const PROJECT_SLUG = process.env.PROJECT_SLUG || 'escarpe-website';

const nextConfig = {
  // The storefront public API key is public by design (X-API-Key sent from the
  // browser); it is inlined here from the build env so it never lives in source.
  env: {
    NEXT_PUBLIC_TYASHIN_API_KEY: process.env.TYASHIN_API_KEY || '',
    NEXT_PUBLIC_TYASHIN_STOREFRONT_URL:
      process.env.TYASHIN_STOREFRONT_URL ||
      'https://website-api.tyashin.com/api/v1/public/ecommerce',
    NEXT_PUBLIC_PROJECT_ID: PROJECT_ID,
    NEXT_PUBLIC_TYASHIN_API_URL: process.env.TYASHIN_API_URL || 'https://website-api.tyashin.com',
    NEXT_PUBLIC_SITE_DOMAIN: process.env.SITE_DOMAIN || '',
  },
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'website-api.tyashin.com' },
      { protocol: 'https' as const, hostname: '**' },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: '/shop', destination: '/products', permanent: true },
      { source: '/attars', destination: '/products', permanent: true },
      { source: '/order-confirmation', destination: '/order-status', permanent: false },
    ];
  },
  async rewrites() {
    // Platform-owned paths are intercepted by Tyashin dispatch on customer
    // hosts. On direct *.workers.dev access they would 404, so proxy them to
    // the project's slug subdomain (which IS dispatched). No-op in production.
    const STOREFRONT_ORIGIN =
      process.env.TYASHIN_STOREFRONT_ORIGIN || `https://${PROJECT_SLUG}.sites.tyashin.com`;
    return [
      { source: '/brand-kit.css', destination: `${STOREFRONT_ORIGIN}/brand-kit.css` },
      { source: '/tyashin-runtime.js', destination: `${STOREFRONT_ORIGIN}/tyashin-runtime.js` },
      {
        source: '/brand/:path*',
        destination: `https://website-api.tyashin.com/api/v1/public/media/projects/${PROJECT_SLUG}/brand/:path*`,
      },
      { source: '/sitemap.xml', destination: `${STOREFRONT_ORIGIN}/sitemap.xml` },
      { source: '/robots.txt', destination: `${STOREFRONT_ORIGIN}/robots.txt` },
      { source: '/blog/rss.xml', destination: `${STOREFRONT_ORIGIN}/blog/rss.xml` },
      { source: '/rss.xml', destination: `${STOREFRONT_ORIGIN}/rss.xml` },
      { source: '/feed', destination: `${STOREFRONT_ORIGIN}/feed` },
      { source: '/feed.xml', destination: `${STOREFRONT_ORIGIN}/feed.xml` },
    ];
  },
};

export default nextConfig;
