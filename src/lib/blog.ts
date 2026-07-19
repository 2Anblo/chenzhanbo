import { unstable_cache } from 'next/cache';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import type { BlogPost } from '@/types';
import { blogCategories } from '@/data/blogCategories';

function estimateReadingTime(content: string): number {
  const cleaned = content.replace(/\s/g, '');
  const minutes = Math.ceil(cleaned.length / 350);
  return Math.max(1, minutes);
}

export const getAllBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category,
      tags: row.tags ?? [],
      publishedAt: row.publishedAt,
      readingTime: row.readingTime ?? estimateReadingTime(row.content),
      cover: row.cover ?? undefined,
    }));
  },
  ['blog-posts'],
  { revalidate: 60, tags: ['blog-posts'] }
);

export const getBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | undefined> => {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category,
      tags: row.tags ?? [],
      publishedAt: row.publishedAt,
      readingTime: row.readingTime ?? estimateReadingTime(row.content),
      cover: row.cover ?? undefined,
    };
  },
  ['blog-post'],
  { revalidate: 60, tags: ['blog-posts'] }
);

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  return posts.map((post) => post.slug);
}

export function getBlogCategories(): string[] {
  return blogCategories;
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  if (category === 'All') return getAllBlogPosts();
  const posts = await getAllBlogPosts();
  return posts.filter((post) => post.category === category);
}
