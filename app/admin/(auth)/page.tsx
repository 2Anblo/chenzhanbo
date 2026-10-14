import AdminText from '@/components/admin/AdminText';
import Link from 'next/link';
import { Home, FileText, FolderGit, Plus } from 'lucide-react';
import { listAdminItems } from '@/lib/admin/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const items = await listAdminItems();
  const blogCount = items.filter((i) => i.type === 'blog').length;
  const projectCount = items.filter((i) => i.type === 'project').length;

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" size="sm">
        <Link href="/">
          <Home size={16} aria-hidden="true" /> <AdminText text="Back to Home" /> </Link>
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display"> <AdminText text="Dashboard" /> </h1>
          <p className="text-muted-foreground mt-1"> <AdminText text="Manage your blog posts and projects." /> </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="font-display"> <AdminText text="阅览" /> </CardTitle></CardHeader>
          <CardContent>
            <CardDescription className="mb-4"> <AdminText text="管理最近在读的论文与文章。" /> </CardDescription>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm"><Link href="/admin/reading"> <AdminText text="查看全部" /> </Link></Button>
              <Button asChild size="sm"><Link href="/admin/reading/edit"><Plus size={14} /> <AdminText text="新增" /> </Link></Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <FileText size={18} /> <AdminText text="Blog Posts" /> </CardTitle>
            <span className="text-2xl font-bold">{blogCount}</span>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4"> <AdminText text="Manage technical writing and notes." /> </CardDescription>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/blog"> <AdminText text="View all" /> </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/blog/edit" className="flex items-center gap-1">
                  <Plus size={14} /> <AdminText text="New" /> </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <FolderGit size={18} /> <AdminText text="Projects" /> </CardTitle>
            <span className="text-2xl font-bold">{projectCount}</span>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4"> <AdminText text="Manage portfolio case studies." /> </CardDescription>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/projects"> <AdminText text="View all" /> </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/projects/edit" className="flex items-center gap-1">
                  <Plus size={14} /> <AdminText text="New" /> </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display"> <AdminText text="Recent Updates" /> </CardTitle>
          <CardDescription> <AdminText text="Last modified content." /> </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm"> <AdminText text="No content yet. Create your first post or project." /> </p>
          ) : (
            <ul className="space-y-2">
              {items.slice(0, 10).map((item) => (
                <li key={`${item.type}-${item.slug}`}>
                  <Link
                    href={`/admin/${item.type === 'blog' ? 'blog' : 'projects'}/edit?slug=${item.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground uppercase"><AdminText text={item.type} /> · {item.date}</span>
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
