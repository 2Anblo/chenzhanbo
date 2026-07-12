'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  defaultLocale,
  Locale,
  locales,
  localeHtmlLangs,
} from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getTranslation } from '@/lib/i18n/utils';
import type { I18nContextValue } from '@/lib/i18n/types';

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved =
      typeof window !== 'undefined'
        ? (window.localStorage.getItem(STORAGE_KEY) as Locale)
        : null;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = localeHtmlLangs[locale];
  }, [locale, mounted]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
  };

  const value = useMemo(() => {
    const dictionary = getDictionary(locale);
    return {
      locale,
      setLocale,
      dictionary,
      t: (key: string, values?: Record<string, string | number>) =>
        getTranslation(dictionary as unknown as Record<string, unknown>, key, values),
    };
  }, [locale]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
