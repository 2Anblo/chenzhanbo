'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAdminTranslation } from './AdminText';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const MAX_BYTES = 2 * 1024 * 1024;

function CoverPreview({ src }: { src: string }) {
  const { t } = useAdminTranslation();
  const [failed, setFailed] = useState(false);
  return failed ? <p className="text-sm text-destructive">{t('Image preview unavailable. Check the URL.')}</p> : (
    <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-md border border-border bg-muted">
      <Image src={src} alt={t('Cover preview')} fill unoptimized className="object-contain" onError={() => setFailed(true)} />
    </div>
  );
}

export default function ReadingImageUpload({ value, onChange, onBusyChange }: {
  value: string;
  onChange: (url: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const { t } = useAdminTranslation();
  const [localPreview, setLocalPreview] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => { if (localPreview) URL.revokeObjectURL(localPreview); }, [localPreview]);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Choose a JPEG, PNG, or WebP image.'); return; }
    if (file.size > MAX_BYTES || !file.size) { setError('Image must be smaller than 2 MB.'); return; }
    setLocalPreview(URL.createObjectURL(file));
    setBusy(true);
    onBusyChange(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/images', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok || typeof result.url !== 'string') throw new Error(result.error ?? 'Upload failed. Please try again.');
      onChange(result.url);
      setLocalPreview('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed. Please try again.');
      setLocalPreview('');
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }
  const preview = localPreview || value;
  const validPreview = preview && (/^https?:\/\//i.test(preview) || /^\/(?!\/)/.test(preview) || preview.startsWith('blob:'));
  return (
    <div className="space-y-3 md:col-span-2">
      <Label htmlFor="cover-upload">{t('Cover image')}</Label>
      <input ref={fileInput} id="cover-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} hidden />
      <div><Button type="button" variant="outline" disabled={busy} onClick={() => fileInput.current?.click()}>{t('Choose image')}</Button></div>
      <p className="text-xs text-muted-foreground">{t('JPEG, PNG, or WebP, up to 2 MB. Select an image to upload and preview.')}</p>
      {busy && <p role="status" className="text-sm text-muted-foreground">{t('Uploading…')}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}
      {validPreview && <CoverPreview key={preview} src={preview} />}
      <Label htmlFor="image">{t('封面图片链接')}</Label>
      <Input id="image" maxLength={2000} value={value} disabled={busy} placeholder="https://… /images/…" onChange={(event) => { setError(''); onChange(event.target.value); }} />
      <p className="text-xs text-muted-foreground">{t('填写图片网址或站内图片路径，留空则显示默认图标。')}</p>
      {value && <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => { onChange(''); setError(''); }}>{t('Remove cover')}</Button>}
    </div>
  );
}
