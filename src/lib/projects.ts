import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Project } from '@/types';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/projects');

function readProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  const projects = files.map((file) => {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const frontmatter = data as {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      background: string;
      techStack: string[];
      contributions: string[];
      highlights: string[];
      githubUrl: string;
      demoUrl?: string;
      category: 'ai' | 'microservices' | 'personal';
      slug?: string;
      date?: string;
      image?: string;
    };

    const slug = frontmatter.slug ?? path.basename(file, '.md');

    return {
      id: frontmatter.id,
      slug,
      title: frontmatter.title,
      subtitle: frontmatter.subtitle,
      description: frontmatter.description,
      background: frontmatter.background,
      techStack: frontmatter.techStack,
      contributions: frontmatter.contributions,
      highlights: frontmatter.highlights,
      githubUrl: frontmatter.githubUrl,
      demoUrl: frontmatter.demoUrl,
      category: frontmatter.category,
      content,
      date: frontmatter.date,
      image: frontmatter.image,
    };
  });

  projects.sort((a, b) => {
    const dateA = a.date ?? '';
    const dateB = b.date ?? '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return projects;
}

let projectsCache: Project[] | null = null;

export function getAllProjects(): Project[] {
  if (projectsCache) return projectsCache;
  projectsCache = readProjects();
  return projectsCache;
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find((project) => project.id === id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getAllProjectIds(): string[] {
  return getAllProjects().map((project) => project.id);
}

export function getAllProjectSlugs(): string[] {
  return getAllProjects().map((project) => project.slug);
}
