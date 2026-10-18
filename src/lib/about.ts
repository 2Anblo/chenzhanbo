import 'server-only';
import { unstable_cache } from 'next/cache';
import { eq } from 'drizzle-orm';
import { aboutDocumentSchema, defaultAboutDocument } from '@/lib/about-content';
export async function readAboutDocument() {
  if (!process.env.DATABASE_URL) return defaultAboutDocument();
  const { db } = await import('@/lib/db');
  const { aboutPages } = await import('@/lib/db/schema');
  const [row] = await db.select().from(aboutPages).where(eq(aboutPages.id, 'about')).limit(1);
  return row ? aboutDocumentSchema.parse(row.content) : defaultAboutDocument();
}
const readCached = unstable_cache(readAboutDocument, ['about-page'], { revalidate: 60, tags: ['about-page'] });
export async function getAboutDocument() {
  try { return await readCached(); } catch { return defaultAboutDocument(); }
}
