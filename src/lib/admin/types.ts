import type { BlogPost, Project } from '@/types';

export interface BlogPostForm {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  publishedAt: string;
  readingTime?: string;
  slug: string;
  cover?: string;
}

export interface ProjectForm {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  background: string;
  content: string;
  techStack: string;
  contributions: string;
  highlights: string;
  githubUrl: string;
  demoUrl?: string;
  category: 'ai' | 'microservices' | 'personal';
  slug: string;
  date?: string;
  image?: string;
}

export type ContentItem =
  | { type: 'blog'; data: BlogPost }
  | { type: 'project'; data: Project };

export interface AdminListItem {
  slug: string;
  title: string;
  date: string;
  type: 'blog' | 'project';
}
