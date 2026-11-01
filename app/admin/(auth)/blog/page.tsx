import AdminText from '@/components/admin/AdminText';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { listAdminItems, deleteBlogPost } from '@/lib/admin/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminBlogListPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const drafts = status === 'draft';
  const posts = (await listAdminItems()).filter((i) => i.type === 'blog');
  const items = posts.filter((i) => (i.status === 'draft') === drafts);

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link href="/admin">
          <ArrowLeft size={16} aria-hidden="true" /> <AdminText text="Back to Dashboard" /> </Link>
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display"> <AdminText text="Blog Posts" /> </h1>
          <p className="text-muted-foreground mt-1"> <AdminText text="Manage your blog posts." /> </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/edit" className="flex items-center gap-1">
            <Plus size={16} /> <AdminText text="New Post" /> </Link>
        </Button>
      </div>

      <nav className="flex flex-wrap gap-3" aria-label="Blog status">
        <Button asChild variant={drafts ? 'outline' : 'default'}><Link href="/admin/blog"><AdminText text="Published" /> ({posts.filter((i) => i.status === 'published').length})</Link></Button>
        <Button asChild variant={drafts ? 'default' : 'outline'}><Link href="/admin/blog?status=draft"><AdminText text="Drafts" /> ({posts.filter((i) => i.status === 'draft').length})</Link></Button>
      </nav>
      <Card>
        <CardHeader>
          <CardTitle className="font-display"> <AdminText text={drafts ? "Drafts" : "Published"} /> </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground"> <AdminText text={drafts ? "No drafts yet." : "No blog posts yet."} /> </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.slug} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.title || <AdminText text="Untitled Draft" />}</p>
                    <p className="text-sm text-muted-foreground">{item.slug} · {item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/blog/edit?slug=${item.slug}`} className="flex items-center gap-1">
                        <Pencil size={14} /> <AdminText text="Edit" /> </Link>
                    </Button>
                    <form action={deleteBlogPost.bind(null, item.slug)}>
                      <Button type="submit" variant="destructive" size="sm" className="flex items-center gap-1">
                        <Trash2 size={14} /> <AdminText text="Delete" /> </Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
