import type { Metadata } from 'next';
import ProjectsListPage from '@/components/ProjectsListPage';
import { getAllProjects } from '@/lib/projects';
import { getProjectsMetadata } from '@/lib/i18n/metadata';

export const metadata: Metadata = getProjectsMetadata('zh');

export default function ProjectsRoute() {
  const projects = getAllProjects();
  return <ProjectsListPage projects={projects} />;
}
