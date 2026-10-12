import { notFound } from 'next/navigation';
import { getReadingEntry } from '@/lib/admin/reading-actions';
import ReadingEditor from '@/components/admin/ReadingEditor';

export default async function EditReadingPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const initial = id ? await getReadingEntry(id) : undefined;
  if (id && !initial) notFound();
  return <ReadingEditor initial={initial ?? undefined} />;
}
