import type { Metadata } from 'next';
import LegalPageRenderer from '../_legal/LegalPageRenderer';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Shipping across Canada and the United States, and how returns on sealed bottles work.',
};

export default function Page() {
  return <LegalPageRenderer slug="return-policy" />;
}
