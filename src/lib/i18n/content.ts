import type { BlogPost, Project } from '@/types';
import type { Locale } from './config';
import { estimateReadingTime } from '@/lib/reading-time';

export function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale !== 'en' || !post.en) return post;
  return {
    ...post,
    title: post.en.title,
    excerpt: post.en.excerpt,
    content: post.en.content,
    readingTime: estimateReadingTime(post.en.content),
  };
}

export function localizeProject(project: Project, locale: Locale): Project {
  if (locale !== 'en' || !project.en) return project;
  return { ...project, ...project.en };
}
