import { zhDictionary } from './zh';
import { enDictionary } from './en';
import type { Dictionary } from '../types';
import type { Locale } from '../config';

export const dictionaries: Record<Locale, Dictionary> = {
  zh: zhDictionary,
  en: enDictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? zhDictionary;
}
