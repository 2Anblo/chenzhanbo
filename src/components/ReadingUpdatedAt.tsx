'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { formatReadingUpdatedAt } from '@/lib/reading-date';

export default function ReadingUpdatedAt({ value }: { value: string | null }) {
  const { t } = useTranslation();
  const date = formatReadingUpdatedAt(value);
  if (!date || !value) return null;
  return <time dateTime={value} className="whitespace-nowrap">{t('reading.updatedAt')} {date}</time>;
}
