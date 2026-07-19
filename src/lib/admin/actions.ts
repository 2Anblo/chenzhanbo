'use server';

import { eq, desc } from 'drizzle-orm';
import { revalidateTag, revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { blogPosts, projects } from '@/lib/db/schema';
import type { BlogPostForm, ProjectForm, AdminListItem } from './types';
import { isAuthenticated } from './auth';

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9一-龥-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureAuth(): void {
  if (!isAuthenticated()) {
    throw new Error('Unauthorized');
  }
}

function parseTags(input: string): string[] {
  return input
    .split(/[,，\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseList(input: string): string[] {
  return input
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function listAdminItems(): Promise<AdminListItem[]> {
  ensureAuth();

  const [blogRows, projectRows] = await Promise.all([
    db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt)),
    db.select().from(projects).orderBy(desc(projects.date)),
  ]);

  const blogItems = blogRows.map((row) => ({
    slug: row.slug,
    title: row.title,
    date: row.publishedAt,
    type: 'blog' as const,
  }));

  const projectItems = projectRows.map((row) => ({
    slug: row.slug,
    title: row.title,
    date: row.date ?? '',
    type: 'project' as const,
  }));

  return [...blogItems, ...projectItems].sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );
}

export async function getBlogPost(slug: string): Promise<BlogPostForm | null> {
  ensureAuth();

  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags.join(', ') : String(row.tags ?? ''),
    publishedAt: row.publishedAt,
    readingTime: row.readingTime ? String(row.readingTime) : undefined,
    slug: row.slug,
    cover: row.cover ? String(row.cover) : undefined,
  };
}

export async function getProject(slug: string): Promise<ProjectForm | null> {
  ensureAuth();

  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    background: row.background,
    content: row.content,
    techStack: Array.isArray(row.techStack) ? row.techStack.join('\n') : String(row.techStack ?? ''),
    contributions: Array.isArray(row.contributions) ? row.contributions.join('\n') : String(row.contributions ?? ''),
    highlights: Array.isArray(row.highlights) ? row.highlights.join('\n') : String(row.highlights ?? ''),
    githubUrl: row.githubUrl,
    demoUrl: row.demoUrl ? String(row.demoUrl) : undefined,
    category: row.category as 'ai' | 'microservices' | 'personal',
    slug: row.slug,
    date: row.date ? String(row.date) : undefined,
    image: row.image ? String(row.image) : undefined,
  };
}

export async function saveBlogPost(form: BlogPostForm): Promise<{ success: boolean; error?: string }> {
  ensureAuth();

  const slug = sanitizeSlug(form.slug);
  if (!slug) {
    return { success: false, error: 'Invalid slug' };
  }

  const readingTime = form.readingTime ? parseInt(form.readingTime, 10) : undefined;

  try {
    await db
      .insert(blogPosts)
      .values({
        id: form.id || slug,
        slug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        tags: parseTags(form.tags),
        publishedAt: form.publishedAt,
        readingTime: readingTime && !Number.isNaN(readingTime) ? readingTime : 0,
        cover: form.cover,
      })
      .onConflictDoUpdate({
        target: blogPosts.slug,
        set: {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          category: form.category,
          tags: parseTags(form.tags),
          publishedAt: form.publishedAt,
          readingTime: readingTime && !Number.isNaN(readingTime) ? readingTime : 0,
          cover: form.cover,
          updatedAt: new Date(),
        },
      });

    revalidateTag('blog-posts', 'default');
    revalidatePath('/blog');
    revalidatePath('/');
    revalidatePath(`/blog/${slug}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' };
  }
}

export async function saveProject(form: ProjectForm): Promise<{ success: boolean; error?: string }> {
  ensureAuth();

  const slug = sanitizeSlug(form.slug);
  if (!slug) {
    return { success: false, error: 'Invalid slug' };
  }

  try {
    await db
      .insert(projects)
      .values({
        id: form.id || slug,
        slug,
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        background: form.background,
        content: form.content,
        techStack: parseList(form.techStack),
        contributions: parseList(form.contributions),
        highlights: parseList(form.highlights),
        githubUrl: form.githubUrl,
        demoUrl: form.demoUrl,
        category: form.category,
        date: form.date,
        image: form.image,
      })
      .onConflictDoUpdate({
        target: projects.slug,
        set: {
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          background: form.background,
          content: form.content,
          techStack: parseList(form.techStack),
          contributions: parseList(form.contributions),
          highlights: parseList(form.highlights),
          githubUrl: form.githubUrl,
          demoUrl: form.demoUrl,
          category: form.category,
          date: form.date,
          image: form.image,
          updatedAt: new Date(),
        },
      });

    revalidateTag('projects', 'default');
    revalidatePath('/projects');
    revalidatePath('/');
    revalidatePath(`/projects/${slug}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' };
  }
}

export async function deleteBlogPost(slug: string): Promise<void> {
  ensureAuth();
  await db.delete(blogPosts).where(eq(blogPosts.slug, slug));

  revalidateTag('blog-posts', 'default');
  revalidatePath('/blog');
  revalidatePath('/');
}

export async function deleteProject(slug: string): Promise<void> {
  ensureAuth();
  await db.delete(projects).where(eq(projects.slug, slug));

  revalidateTag('projects', 'default');
  revalidatePath('/projects');
  revalidatePath('/');
}
