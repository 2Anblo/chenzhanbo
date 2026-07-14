import { notFound } from 'next/navigation';
import { getBlogPost } from '@/lib/admin/actions';
import BlogPostEditor from '@/components/admin/BlogPostEditor';

interface EditBlogPageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function EditBlogPage({ searchParams }: EditBlogPageProps) {
  const params = await searchParams;
  const initial = params.slug ? await getBlogPost(params.slug) : undefined;

  if (params.slug && !initial) {
    notFound();
  }

  return <BlogPostEditor initial={initial ?? undefined} />;
}
