'use client';

import { useEffect, useRef, useState } from 'react';
import ReadingCover from '@/components/ReadingCover';
import type { ReadingImageCrop } from '@/types/reading';
import { useAdminTranslation } from './AdminText';
import ReadingCropEditor from './ReadingCropEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const MAX_BYTES = 2 * 1024 * 1024;

export default function ReadingImageUpload({ value, imageCrop, onChange, onBusyChange }: {
  value: string;
  imageCrop?: ReadingImageCrop | null;
  onChange: (url: string, crop?: ReadingImageCrop | null) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const { t } = useAdminTranslation();
  const [selection, setSelection] = useState<{ src: string; file?: File } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => {
    if (selection?.src.startsWith('blob:')) URL.revokeObjectURL(selection.src);
  }, [selection]);

  function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Choose a JPEG, PNG, or WebP image.'); return; }
    if (file.size > MAX_BYTES || !file.size) { setError('Image must be smaller than 2 MB.'); return; }
    setSelection({ src: URL.createObjectURL(file), file });
    onBusyChange(true);
  }

  function closeCrop() {
    setSelection(null);
    onBusyChange(false);
    setError('');
  }

  async function confirmCrop(crop: ReadingImageCrop) {
    if (!selection || busy) return;
    setBusy(true);
    setError('');
    try {
      let url = selection.src;
      if (selection.file) {
        const body = new FormData();
        body.append('file', selection.file);
        const response = await fetch('/api/admin/images', { method: 'POST', body });
        const result = await response.json();
        if (!response.ok || typeof result.url !== 'string') throw new Error(result.error ?? 'Upload failed. Please try again.');
        url = result.url;
      }
      onChange(url, crop);
      closeCrop();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const validPreview = value && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value));
  return (
    <div className="space-y-3 md:col-span-2">
      <Label htmlFor="cover-upload">{t('Cover image')}</Label>
      <input ref={fileInput} id="cover-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={choose} disabled={busy || Boolean(selection)} hidden />
      <div><Button type="button" variant="outline" disabled={busy || Boolean(selection)} onClick={() => fileInput.current?.click()}>{t('Choose image')}</Button></div>
      <p className="text-xs text-muted-foreground">{t('JPEG, PNG, or WebP, up to 2 MB. Select an image to upload and preview.')}</p>
      {error && <p role="alert" className="text-sm text-destructive">{t(error)}</p>}
      {selection ? (
        <ReadingCropEditor key={selection.src} src={selection.src} initial={selection.file ? null : imageCrop} busy={busy} onConfirm={confirmCrop} onCancel={closeCrop} />
      ) : validPreview ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('List cover preview')}</p>
          <div className="group w-24 sm:w-60"><ReadingCover key={value} item={{ kind: 'paper', image: value, imageCrop }} alt={t('Cover preview')} /></div>
          <p className="text-xs text-muted-foreground">{t('The 4:3 preview matches the public list. Desktop 240 × 180; mobile 96 × 72.')}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => { setSelection({ src: value }); setError(''); onBusyChange(true); }}>{t('Adjust cover crop')}</Button>
            {imageCrop && <Button type="button" size="sm" variant="outline" onClick={() => onChange(value, null)}>{t('Reset crop')}</Button>}
          </div>
        </div>
      ) : null}
      <Label htmlFor="image">{t('封面图片链接')}</Label>
      <Input id="image" maxLength={2000} value={value} disabled={busy || Boolean(selection)} placeholder="https://… /images/…" onChange={(event) => { setError(''); onChange(event.target.value, null); }} />
      <p className="text-xs text-muted-foreground">{t('填写图片网址或站内图片路径，留空则显示默认图标。')}</p>
      {value && <Button type="button" size="sm" variant="outline" disabled={busy || Boolean(selection)} onClick={() => { onChange('', null); setError(''); }}>{t('Remove cover')}</Button>}
    </div>
  );
}
