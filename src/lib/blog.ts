import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from '@/types';
import { blogCategories } from '@/data/blogCategories';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/blog');

function estimateReadingTime(content: string): number {
  const cleaned = content.replace(/\s/g, '');
  const minutes = Math.ceil(cleaned.length / 350);
  return Math.max(1, minutes);
}

function readPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  const posts = files.map((file) => {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const frontmatter = data as {
      id: string;
      title: string;
      excerpt: string;
      category: string;
      tags: string[];
      date: string;
      readingTime?: number;
      slug?: string;
      cover?: string;
    };

    const slug = frontmatter.slug ?? path.basename(file, '.md');
    const readingTime = frontmatter.readingTime ?? estimateReadingTime(content);

    return {
      id: String(frontmatter.id),
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      content,
      category: frontmatter.category,
      tags: frontmatter.tags,
      publishedAt: frontmatter.date,
      readingTime,
      slug,
      cover: frontmatter.cover,
    };
  });

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return posts;
}

let postsCache: BlogPost[] | null = null;

export function getAllBlogPosts(): BlogPost[] {
  if (postsCache) return postsCache;
  postsCache = readPosts();
  return postsCache;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}

export function getBlogCategories(): string[] {
  return blogCategories;
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'All') return getAllBlogPosts();
  return getAllBlogPosts().filter((post) => post.category === category);
}
