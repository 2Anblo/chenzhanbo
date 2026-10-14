import type { CSSProperties } from 'react';
import type { ReadingImageCrop } from '@/types/reading';

// Percentages of the source image keep the crop consistent after image resizing
// and across the desktop and mobile cover frames.
export function readingCropStyle(crop?: ReadingImageCrop | null): CSSProperties | undefined {
  if (!crop) return undefined;
  return {
    width: `${10000 / crop.width}%`,
    height: `${10000 / crop.height}%`,
    left: `${-100 * crop.x / crop.width}%`,
    top: `${-100 * crop.y / crop.height}%`,
  };
}
