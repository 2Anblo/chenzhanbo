import type { Locale } from '@/lib/i18n/config';

export interface ReadingImageCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ReadingItem {
  id: string;
  kind: 'paper' | 'blog';
  title: string;
  summary: Record<Locale, string>;
  url: string;
  source: string;
  image?: string;
  imageCrop?: ReadingImageCrop | null;
  sortOrder: number;
}
