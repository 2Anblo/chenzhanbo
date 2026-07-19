import { unstable_cache } from 'next/cache';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import type { Project } from '@/types';

export const getAllProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db.select().from(projects).orderBy(desc(projects.date));
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      background: row.background,
      content: row.content,
      techStack: row.techStack ?? [],
      contributions: row.contributions ?? [],
      highlights: row.highlights ?? [],
      githubUrl: row.githubUrl,
      demoUrl: row.demoUrl ?? undefined,
      category: row.category as 'ai' | 'microservices' | 'personal',
      date: row.date ?? undefined,
      image: row.image ?? undefined,
    }));
  },
  ['projects'],
  { revalidate: 60, tags: ['projects'] }
);

export const getProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | undefined> => {
    const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      background: row.background,
      content: row.content,
      techStack: row.techStack ?? [],
      contributions: row.contributions ?? [],
      highlights: row.highlights ?? [],
      githubUrl: row.githubUrl,
      demoUrl: row.demoUrl ?? undefined,
      category: row.category as 'ai' | 'microservices' | 'personal',
      date: row.date ?? undefined,
      image: row.image ?? undefined,
    };
  },
  ['project'],
  { revalidate: 60, tags: ['projects'] }
);

export async function getProjectById(id: string): Promise<Project | undefined> {
  const all = await getAllProjects();
  return all.find((project) => project.id === id);
}

export async function getAllProjectIds(): Promise<string[]> {
  const all = await getAllProjects();
  return all.map((project) => project.id);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const all = await getAllProjects();
  return all.map((project) => project.slug);
}
