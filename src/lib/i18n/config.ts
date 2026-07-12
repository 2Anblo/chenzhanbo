export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

export const localeLabels: Record<Locale, string> = {
  zh: '中',
  en: 'En',
};

export const localeHtmlLangs: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
};

export const localeOgLocales: Record<Locale, string> = {
  zh: 'zh_CN',
  en: 'en_US',
};
