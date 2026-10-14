'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, FileText } from 'lucide-react';
import type { ReadingItem } from '@/types/reading';
import { readingCropStyle } from '@/lib/reading-crop';

export default function ReadingCover({ item, alt = '' }: {
  item: Pick<ReadingItem, 'kind' | 'image' | 'imageCrop'>;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = item.kind === 'paper' ? FileText : BookOpen;

  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-border bg-muted">
      {item.image && !failed ? (
        <div className="absolute inset-0" style={readingCropStyle(item.imageCrop)}>
          <Image src={item.image} alt={alt} fill sizes="(max-width: 640px) 96px, 240px" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" onError={() => setFailed(true)} />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <Icon className="h-8 w-8 sm:h-12 sm:w-12" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
