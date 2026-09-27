import type { BlogPost, Project, BlogPostTranslation, ProjectTranslation } from '@/types';

export interface BlogPostForm {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string;
  publishedAt: string;
  readingTime?: string;
  slug: string;
  cover?: string;
  en?: BlogPostTranslation;
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
  en?: ProjectTranslation;
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
