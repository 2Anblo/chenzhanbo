import type { Metadata } from 'next';
import { getAboutDocument } from '@/lib/about';
import AboutPage from '@/components/AboutPage';
import { getAboutMetadata } from '@/lib/i18n/metadata';

export const metadata: Metadata = getAboutMetadata('en');

export default async function AboutRoute() {
  return <AboutPage content={await getAboutDocument()} />;
}
