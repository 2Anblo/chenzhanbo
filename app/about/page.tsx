import type { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';
import { getAboutMetadata } from '@/lib/i18n/metadata';

export const metadata: Metadata = getAboutMetadata('zh');

export default function AboutRoute() {
  return <AboutPage />;
}
