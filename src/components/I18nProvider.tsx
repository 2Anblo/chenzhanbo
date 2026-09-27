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
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function persistLocale(locale: Locale) {
  window.localStorage.setItem(STORAGE_KEY, locale);
  document.cookie = `${STORAGE_KEY}=${locale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.lang = localeHtmlLangs[locale];
}

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
  hasLocaleCookie = false,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
  hasLocaleCookie?: boolean;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!hasLocaleCookie) {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && locales.includes(saved)) {
        setLocaleState(saved);
      }
    }
    setMounted(true);
  }, [hasLocaleCookie]);

  useEffect(() => {
    if (!mounted) return;
    persistLocale(locale);
  }, [locale, mounted]);

  const setLocale = (next: Locale) => {
    persistLocale(next);
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
