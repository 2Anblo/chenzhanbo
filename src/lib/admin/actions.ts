'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPostForm, ProjectForm, AdminListItem } from './types';
import { isAuthenticated } from './auth';

const BLOG_DIR = path.resolve(process.cwd(), 'content/blog');
const PROJECTS_DIR = path.resolve(process.cwd(), 'content/projects');

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

  const [blogFiles, projectFiles] = await Promise.all([
    fs.readdir(BLOG_DIR).catch(() => [] as string[]),
    fs.readdir(PROJECTS_DIR).catch(() => [] as string[]),
  ]);

  const blogItems = await Promise.all(
    blogFiles
      .filter((f) => f.endsWith('.md'))
      .map(async (file) => {
        const slug = path.basename(file, '.md');
        const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8');
        const { data } = matter(raw);
        return {
          slug,
          title: String(data.title ?? slug),
          date: String(data.date ?? ''),
          type: 'blog' as const,
        };
      })
  );

  const projectItems = await Promise.all(
    projectFiles
      .filter((f) => f.endsWith('.md'))
      .map(async (file) => {
        const slug = path.basename(file, '.md');
        const raw = await fs.readFile(path.join(PROJECTS_DIR, file), 'utf-8');
        const { data } = matter(raw);
        return {
          slug,
          title: String(data.title ?? slug),
          date: String(data.date ?? ''),
          type: 'project' as const,
        };
      })
  );

  return [...blogItems, ...projectItems].sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );
}

export async function getBlogPost(slug: string): Promise<BlogPostForm | null> {
  ensureAuth();
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      id: String(data.id ?? ''),
      title: String(data.title ?? ''),
      excerpt: String(data.excerpt ?? ''),
      content,
      category: String(data.category ?? ''),
      tags: Array.isArray(data.tags) ? data.tags.join(', ') : String(data.tags ?? ''),
      publishedAt: String(data.date ?? ''),
      readingTime: data.readingTime ? String(data.readingTime) : undefined,
      slug,
      cover: data.cover ? String(data.cover) : undefined,
    };
  } catch {
    return null;
  }
}

export async function getProject(slug: string): Promise<ProjectForm | null> {
  ensureAuth();
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      id: String(data.id ?? ''),
      title: String(data.title ?? ''),
      subtitle: String(data.subtitle ?? ''),
      description: String(data.description ?? ''),
      background: String(data.background ?? ''),
      content,
      techStack: Array.isArray(data.techStack) ? data.techStack.join('\n') : String(data.techStack ?? ''),
      contributions: Array.isArray(data.contributions) ? data.contributions.join('\n') : String(data.contributions ?? ''),
      highlights: Array.isArray(data.highlights) ? data.highlights.join('\n') : String(data.highlights ?? ''),
      githubUrl: String(data.githubUrl ?? ''),
      demoUrl: data.demoUrl ? String(data.demoUrl) : undefined,
      category: data.category ?? 'personal',
      slug,
      date: data.date ? String(data.date) : undefined,
      image: data.image ? String(data.image) : undefined,
    };
  } catch {
    return null;
  }
}

export async function saveBlogPost(form: BlogPostForm): Promise<{ success: boolean; error?: string }> {
  ensureAuth();

  const slug = sanitizeSlug(form.slug);
  if (!slug) {
    return { success: false, error: 'Invalid slug' };
  }

  const readingTime = form.readingTime ? parseInt(form.readingTime, 10) : undefined;

  const frontmatter: Record<string, unknown> = {
    id: form.id || slug,
    title: form.title,
    excerpt: form.excerpt,
    category: form.category,
    tags: parseTags(form.tags),
    date: form.publishedAt,
    slug,
  };

  if (form.cover) frontmatter.cover = form.cover;
  if (readingTime && !Number.isNaN(readingTime)) frontmatter.readingTime = readingTime;

  const fileContent = matter.stringify(form.content, frontmatter);

  try {
    await fs.mkdir(BLOG_DIR, { recursive: true });
    await fs.writeFile(path.join(BLOG_DIR, `${slug}.md`), fileContent, 'utf-8');
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

  const frontmatter: Record<string, unknown> = {
    id: form.id || slug,
    title: form.title,
    subtitle: form.subtitle,
    description: form.description,
    background: form.background,
    techStack: parseList(form.techStack),
    contributions: parseList(form.contributions),
    highlights: parseList(form.highlights),
    githubUrl: form.githubUrl,
    category: form.category,
    slug,
  };

  if (form.demoUrl) frontmatter.demoUrl = form.demoUrl;
  if (form.date) frontmatter.date = form.date;
  if (form.image) frontmatter.image = form.image;

  const fileContent = matter.stringify(form.content, frontmatter);

  try {
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
    await fs.writeFile(path.join(PROJECTS_DIR, `${slug}.md`), fileContent, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' };
  }
}

export async function deleteBlogPost(slug: string): Promise<void> {
  ensureAuth();
  await fs.unlink(path.join(BLOG_DIR, `${slug}.md`));
}

export async function deleteProject(slug: string): Promise<void> {
  ensureAuth();
  await fs.unlink(path.join(PROJECTS_DIR, `${slug}.md`));
}
