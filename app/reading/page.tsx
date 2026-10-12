import type { Metadata } from 'next';
import ReadingListPage from '@/components/ReadingListPage';
import { readingItems } from '@/data/reading';
import { getDictionary } from '@/lib/i18n/dictionaries';

const dictionary = getDictionary('en');

export const metadata: Metadata = {
  title: dictionary.nav.reading,
  description: dictionary.reading.description,
  alternates: { canonical: '/reading' },
  openGraph: {
    title: 'Reading | Zhanbo',
    description: dictionary.reading.description,
    url: '/reading',
    type: 'website',
  },
};

export default function ReadingPage() {
  return <ReadingListPage items={readingItems} />;
}
