import type { Metadata } from 'next';
import LegalPageRenderer from '../_legal/LegalPageRenderer';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that govern orders and use of the Maison Escarpe site.',
};

export default function Page() {
  return <LegalPageRenderer slug="terms-and-conditions" />;
}
