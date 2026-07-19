import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { db } from '../src/lib/db';
import { blogPosts, projects } from '../src/lib/db/schema';

const BLOG_DIR = path.resolve(process.cwd(), 'content/blog');
const PROJECTS_DIR = path.resolve(process.cwd(), 'content/projects');

async function seedBlogPosts() {
  const files = await fs.readdir(BLOG_DIR).catch(() => [] as string[]);
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  for (const file of mdFiles) {
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const slug = (data.slug as string) || path.basename(file, '.md');

    await db
      .insert(blogPosts)
      .values({
        id: (data.id as string) || slug,
        slug,
        title: String(data.title ?? ''),
        excerpt: String(data.excerpt ?? ''),
        content,
        category: String(data.category ?? ''),
        tags: Array.isArray(data.tags) ? data.tags : [],
        publishedAt: String(data.date ?? ''),
        readingTime: typeof data.readingTime === 'number' ? data.readingTime : 0,
        cover: data.cover ? String(data.cover) : undefined,
      })
      .onConflictDoNothing();

    console.log(`Seeded blog post: ${slug}`);
  }
}

async function seedProjects() {
  const files = await fs.readdir(PROJECTS_DIR).catch(() => [] as string[]);
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  for (const file of mdFiles) {
    const raw = await fs.readFile(path.join(PROJECTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const slug = (data.slug as string) || path.basename(file, '.md');

    await db
      .insert(projects)
      .values({
        id: (data.id as string) || slug,
        slug,
        title: String(data.title ?? ''),
        subtitle: String(data.subtitle ?? ''),
        description: String(data.description ?? ''),
        background: String(data.background ?? ''),
        content,
        techStack: Array.isArray(data.techStack) ? data.techStack : [],
        contributions: Array.isArray(data.contributions) ? data.contributions : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        githubUrl: String(data.githubUrl ?? ''),
        demoUrl: data.demoUrl ? String(data.demoUrl) : undefined,
        category: String(data.category ?? 'personal'),
        date: data.date ? String(data.date) : undefined,
        image: data.image ? String(data.image) : undefined,
      })
      .onConflictDoNothing();

    console.log(`Seeded project: ${slug}`);
  }
}

async function main() {
  console.log('Seeding database...');
  await seedBlogPosts();
  await seedProjects();
  console.log('Done!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
