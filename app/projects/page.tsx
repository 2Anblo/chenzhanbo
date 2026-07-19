import type { Metadata } from 'next';
import ProjectsListPage from '@/components/ProjectsListPage';
import { getAllProjects } from '@/lib/projects';
import { getProjectsMetadata } from '@/lib/i18n/metadata';

export const metadata: Metadata = getProjectsMetadata('zh');
export const revalidate = 60;

export default async function ProjectsRoute() {
  const projects = await getAllProjects();
  return <ProjectsListPage projects={projects} />;
}
