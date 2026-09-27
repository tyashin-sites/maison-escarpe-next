import type { Metadata } from 'next';
import LegalPageRenderer from '../_legal/LegalPageRenderer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Maison Escarpe collects, uses and protects your information.',
};

export default function Page() {
  return <LegalPageRenderer slug="privacy-policy" />;
}
