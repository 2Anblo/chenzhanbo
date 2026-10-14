'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminTranslation } from '@/components/admin/AdminText';
import { useRouter } from 'next/navigation';
import { saveReadingEntry } from '@/lib/admin/reading-actions';
import type { ReadingForm } from '@/lib/admin/reading-validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ReadingImageUpload from './ReadingImageUpload';

const emptyForm: ReadingForm = { kind: 'paper', title: '', summary: { zh: '', en: '' }, url: '', source: '', image: '', sortOrder: 0 };

export default function ReadingEditor({ initial }: { initial?: ReadingForm }) {
  const { t } = useAdminTranslation();
  const [form, setForm] = useState(initial ?? emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (uploading) return;
    setSaving(true);
    setError('');
    try {
      const result = await saveReadingEntry(form);
      if (!result.success) { setError(result.error ?? '保存失败'); return; }
      router.push('/admin/reading');
      router.refresh();
    } catch { setError("保存失败，请检查连接后重试。"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm"><Link href="/admin/reading"> {t("← 返回阅览")} </Link></Button>
      <h1 className="font-display text-3xl font-bold">{initial ? t("编辑阅览") : t("新增阅览")}</h1>
      <form onSubmit={submit}>
        <fieldset disabled={saving} className="space-y-6">
          <Card><CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="kind"> {t("类型")} </Label><select id="kind" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ReadingForm['kind'] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="paper"> {t("论文")} </option><option value="blog"> {t("Blog / 文章")} </option></select></div>
            <div className="space-y-2"><Label htmlFor="sortOrder"> {t("排序（越小越靠前）")} </Label><Input id="sortOrder" type="number" required step={1} min={-2147483648} max={2147483647} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.valueAsNumber })} /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="title"> {t("标题 *")} </Label><Input id="title" required maxLength={500} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="source"> {t("来源 *")} </Label><Input id="source" required maxLength={255} placeholder="arXiv · 2025" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="url"> {t("原文链接 *")} </Label><Input id="url" type="url" required maxLength={2000} placeholder="https://…" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></div>
            <ReadingImageUpload value={form.image ?? ""} onChange={(image) => setForm((previous) => ({ ...previous, image }))} onBusyChange={setUploading} />
            <div className="space-y-2"><Label htmlFor="summary-zh"> {t("中文概要 *")} </Label><Textarea id="summary-zh" required maxLength={10000} rows={7} value={form.summary.zh} onChange={(e) => setForm({ ...form, summary: { ...form.summary, zh: e.target.value } })} /></div>
            <div className="space-y-2"><Label htmlFor="summary-en"> {t("英文概要 *")} </Label><Textarea id="summary-en" required maxLength={10000} rows={7} value={form.summary.en} onChange={(e) => setForm({ ...form, summary: { ...form.summary, en: e.target.value } })} /></div>
          </CardContent></Card>
          {error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}
          <Button type="submit" disabled={uploading}>{saving ? t("保存中…") : t("保存")}</Button>
        </fieldset>
      </form>
    </div>
  );
}
