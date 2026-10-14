'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminTranslation } from '@/components/admin/AdminText';
import { useRouter } from 'next/navigation';
import type { ReadingItem } from '@/types/reading';
import { deleteReadingEntry } from '@/lib/admin/reading-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ReadingAdminList({ items }: { items: ReadingItem[] }) {
  const { t } = useAdminTranslation();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  async function remove(id: string) {
    setBusy(true);
    setError('');
    try {
      const result = await deleteReadingEntry(id);
      if (!result.success) { setError(result.error ?? "删除失败"); return; }
      setConfirmId(null);
      router.refresh();
    } catch { setError("删除失败，请稍后重试。"); }
    finally { setBusy(false); }
  }
  return (
    <Card><CardContent className="p-6">
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{t(error)}</p>}
      {!items.length ? <p className="text-muted-foreground"> {t("还没有内容，添加第一篇论文或文章吧。")} </p> : (
        <ul className="divide-y divide-border">{items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="min-w-0 flex-1"><p className="break-words font-medium">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{item.kind === 'paper' ? t("论文") : t("文章")} · {item.source} · {t("排序")} {item.sortOrder}</p></div>
            <div className="flex flex-wrap items-center gap-2">
              {confirmId === item.id ? <><span className="text-sm"> {t("确认删除？")} </span><Button disabled={busy} variant="destructive" size="sm" onClick={() => remove(item.id)}>{busy ? t("删除中…") : t("确认删除")}</Button><Button disabled={busy} variant="outline" size="sm" onClick={() => setConfirmId(null)}> {t("取消")} </Button></> : <><Button asChild variant="outline" size="sm"><Link href={`/admin/reading/edit?id=${encodeURIComponent(item.id)}`}> {t("编辑")} </Link></Button><Button disabled={busy} variant="destructive" size="sm" onClick={() => setConfirmId(item.id)}> {t("删除")} </Button></>}
            </div>
          </li>
        ))}</ul>
      )}
    </CardContent></Card>
  );
}
