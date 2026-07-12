'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/I18nProvider';
import { localeLabels } from '@/lib/i18n/config';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  const next = locale === 'zh' ? 'en' : 'zh';
  const label = localeLabels[next];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      aria-label={`Switch to ${next === 'en' ? 'English' : '中文'}`}
      className="text-sm font-medium"
    >
      {label}
    </Button>
  );
}
