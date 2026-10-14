'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { translateAdmin } from '@/lib/i18n/admin';

export function useAdminTranslation() {
  const { locale } = useTranslation();
  return { t: (key: string) => translateAdmin(locale, key), locale };
}

export default function AdminText({ text }: { text: string }) {
  const { t } = useAdminTranslation();
  return <>{t(text)}</>;
}
