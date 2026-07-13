import { notFound } from 'next/navigation';
import { getProject } from '@/lib/admin/actions';
import ProjectEditor from '@/components/admin/ProjectEditor';

interface EditProjectPageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function EditProjectPage({ searchParams }: EditProjectPageProps) {
  const params = await searchParams;
  const initial = params.slug ? await getProject(params.slug) : undefined;

  if (params.slug && !initial) {
    notFound();
  }

  return <ProjectEditor initial={initial ?? undefined} />;
}
