'use server';

import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { readingEntries } from '@/lib/db/schema';
import { readReadingItems } from '@/lib/reading';
import { isAuthenticated } from './auth';
import { readingFormSchema } from './reading-validation';

async function requireAdmin() {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
}

function refreshReading() {
  revalidateTag('reading-items', { expire: 0 });
  revalidatePath('/reading');
  revalidatePath('/admin/reading');
  revalidatePath('/admin');
}

export async function listReadingEntries() {
  await requireAdmin();
  return readReadingItems();
}

export async function getReadingEntry(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(readingEntries).where(eq(readingEntries.id, id)).limit(1);
  return row ? { ...row, image: row.image ?? '' } : null;
}

export async function saveReadingEntry(input: unknown) {
  await requireAdmin();
  const parsed = readingFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { id, ...data } = parsed.data;
  const values = { ...data, image: data.image || null, updatedAt: new Date() };
  try {
    if (id) {
      const changed = await db.update(readingEntries).set(values).where(eq(readingEntries.id, id)).returning({ id: readingEntries.id });
      if (!changed.length) return { success: false, error: '这条内容已不存在，请返回列表刷新。' };
    } else {
      await db.insert(readingEntries).values({ ...values, id: randomUUID() });
    }
  } catch {
    return { success: false, error: '保存失败，请稍后重试。' };
  }
  refreshReading();
  return { success: true };
}

export async function deleteReadingEntry(id: string) {
  await requireAdmin();
  if (typeof id !== 'string' || !id || id.length > 255) return { success: false, error: '无效的内容编号。' };
  try {
    await db.delete(readingEntries).where(eq(readingEntries.id, id));
  } catch {
    return { success: false, error: '删除失败，请稍后重试。' };
  }
  refreshReading();
  return { success: true };
}
