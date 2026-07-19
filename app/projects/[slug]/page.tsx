import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectPostPage from '@/components/ProjectPostPage';
import { getProjectBySlug } from '@/lib/projects';
import { getProjectPostMetadata } from '@/lib/i18n/metadata';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return {};
  }
  return getProjectPostMetadata(project, 'zh');
}

export default async function ProjectPostRoute({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }
  return <ProjectPostPage project={project} />;
}
