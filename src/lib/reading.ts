import { unstable_cache } from 'next/cache';
import { asc, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { readingEntries } from '@/lib/db/schema';
import type { ReadingItem } from '@/types/reading';

export async function readReadingItems(): Promise<ReadingItem[]> {
  const rows = await db.select().from(readingEntries).orderBy(
    asc(readingEntries.sortOrder), desc(readingEntries.createdAt), asc(readingEntries.id),
  );
  return rows.map((row) => ({ ...row, image: row.image ?? undefined }));
}

export const getReadingItems = unstable_cache(readReadingItems, ['reading-items'], {
  revalidate: 60,
  tags: ['reading-items'],
});
