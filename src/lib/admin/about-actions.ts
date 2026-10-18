'use server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isAuthenticated } from './auth';
import { aboutDocumentSchema } from '@/lib/about-content';
import { aboutPages } from '@/lib/db/schema';
export async function saveAboutDocument(input: unknown) {
  if (!(await isAuthenticated())) throw new Error('Unauthorized');
  const parsed = aboutDocumentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: '请检查内容格式、邮箱和链接。' };
  try {
    const { db } = await import('@/lib/db');
    await db.insert(aboutPages).values({ id: 'about', content: parsed.data }).onConflictDoUpdate({ target: aboutPages.id, set: { content: parsed.data, updatedAt: new Date() } });
    revalidateTag('about-page', 'default'); revalidatePath('/about'); revalidatePath('/admin/about');
    return { success: true };
  } catch { return { success: false, error: '保存失败，请稍后重试。' }; }
}
