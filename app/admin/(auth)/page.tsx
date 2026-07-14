import Link from 'next/link';
import { FileText, FolderGit, Plus } from 'lucide-react';
import { listAdminItems } from '@/lib/admin/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const items = await listAdminItems();
  const blogCount = items.filter((i) => i.type === 'blog').length;
  const projectCount = items.filter((i) => i.type === 'project').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your blog posts and projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <FileText size={18} /> Blog Posts
            </CardTitle>
            <span className="text-2xl font-bold">{blogCount}</span>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Manage technical writing and notes.</CardDescription>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/blog">View all</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/blog/edit" className="flex items-center gap-1">
                  <Plus size={14} /> New
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <FolderGit size={18} /> Projects
            </CardTitle>
            <span className="text-2xl font-bold">{projectCount}</span>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Manage portfolio case studies.</CardDescription>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/projects">View all</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/projects/edit" className="flex items-center gap-1">
                  <Plus size={14} /> New
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Recent Updates</CardTitle>
          <CardDescription>Last modified content.</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No content yet. Create your first post or project.</p>
          ) : (
            <ul className="space-y-2">
              {items.slice(0, 10).map((item) => (
                <li key={`${item.type}-${item.slug}`}>
                  <Link
                    href={`/admin/${item.type === 'blog' ? 'blog' : 'projects'}/edit?slug=${item.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground uppercase">{item.type} · {item.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
