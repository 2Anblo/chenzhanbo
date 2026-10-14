'use client';

import { useState } from 'react';
import Cropper from 'react-easy-crop';
import type { ReadingImageCrop } from '@/types/reading';
import ReadingCover from '@/components/ReadingCover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAdminTranslation } from './AdminText';

export default function ReadingCropEditor({ src, initial, busy, onConfirm, onCancel }: {
  src: string;
  initial?: ReadingImageCrop | null;
  busy: boolean;
  onConfirm: (crop: ReadingImageCrop) => void;
  onCancel: () => void;
}) {
  const { t } = useAdminTranslation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<ReadingImageCrop | null>(initial ?? null);
  const [failed, setFailed] = useState(false);

  return (
    <div className="space-y-3 rounded-md border border-border p-4">
      <p className="font-medium">{t('Adjust cover crop')}</p>
      <p className="text-xs text-muted-foreground">{t('Drag the image and adjust zoom to choose the area shown in the 4:3 list frame.')}</p>
      <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden bg-muted" role="group" aria-label={t('Adjust cover crop')}>
        <Cropper image={src} crop={position} zoom={zoom} aspect={4 / 3} objectFit="cover"
          initialCroppedAreaPercentages={initial ?? undefined}
          onCropChange={setPosition} onZoomChange={setZoom} onCropAreaChange={setArea}
          zoomWithScroll={false} restrictPosition
          mediaProps={{ onError: () => setFailed(true) }}
        />
      </div>
      {failed && <p role="alert" className="text-sm text-destructive">{t('Image preview unavailable. Check the URL.')}</p>}
      <div className="max-w-md space-y-2">
        <Label htmlFor="cover-zoom">{t('Zoom')} · {zoom.toFixed(2)}×</Label>
        <input id="cover-zoom" type="range" min={1} max={3} step={0.01} value={zoom} disabled={busy || failed}
          onChange={(event) => setZoom(Number(event.target.value))} className="w-full accent-primary" />
      </div>
      {area && !failed && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t('List cover preview')}</p>
          <div className="w-24 sm:w-60"><ReadingCover item={{ kind: 'paper', image: src, imageCrop: area }} alt={t('Cover preview')} /></div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={busy || !area || failed} onClick={() => area && onConfirm(area)}>{t(busy ? 'Uploading…' : 'Use this crop')}</Button>
        <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>{t('Cancel')}</Button>
      </div>
      <p className="text-xs text-muted-foreground">{t('Confirm the crop, then save the entry to publish your changes.')}</p>
    </div>
  );
}
