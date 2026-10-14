import AdminText from '@/components/admin/AdminText';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { listReadingEntries } from '@/lib/admin/reading-actions';
import { Button } from '@/components/ui/button';
import ReadingAdminList from '@/components/admin/ReadingAdminList';

export default async function AdminReadingPage() {
  const items = await listReadingEntries();
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm"><Link href="/admin"><ArrowLeft size={16} /> <AdminText text="返回后台" /> </Link></Button>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-display text-3xl font-bold"> <AdminText text="阅览" /> </h1><p className="mt-2 text-sm text-muted-foreground"> <AdminText text="管理论文与文章。排序数字越小越靠前，相同时新增内容在前。" /> </p></div>
        <Button asChild><Link href="/admin/reading/edit"><Plus size={16} /> <AdminText text="新增内容" /> </Link></Button>
      </div>
      <ReadingAdminList items={items} />
      <Link href="/reading" className="text-sm text-primary"> <AdminText text="查看前台列表 →" /> </Link>
    </div>
  );
}
