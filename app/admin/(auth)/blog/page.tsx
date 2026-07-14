import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { listAdminItems, deleteBlogPost } from '@/lib/admin/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminBlogListPage() {
  const items = (await listAdminItems()).filter((i) => i.type === 'blog');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog posts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/edit" className="flex items-center gap-1">
            <Plus size={16} /> New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">No blog posts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.slug} className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.slug} · {item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/blog/edit?slug=${item.slug}`} className="flex items-center gap-1">
                        <Pencil size={14} /> Edit
                      </Link>
                    </Button>
                    <form action={deleteBlogPost.bind(null, item.slug)}>
                      <Button type="submit" variant="destructive" size="sm" className="flex items-center gap-1">
                        <Trash2 size={14} /> Delete
                      </Button>
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
