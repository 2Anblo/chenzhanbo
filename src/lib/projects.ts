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
    const { data } = matter(raw);
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
    };

    return {
      id: frontmatter.id,
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
    };
  });

  projects.sort((a, b) => {
    const dateA = (a as { date?: string }).date ?? '';
    const dateB = (b as { date?: string }).date ?? '';
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

export function getAllProjectIds(): string[] {
  return getAllProjects().map((project) => project.id);
}
