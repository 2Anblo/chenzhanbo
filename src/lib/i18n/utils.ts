export function getTranslation(
  dict: Record<string, unknown>,
  key: string,
  values?: Record<string, string | number>
): string {
  const raw = key.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, dict);

  if (typeof raw !== 'string') {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(`Missing i18n key: ${key}`);
    }
    return key;
  }

  if (!values) return raw;

  return raw.replace(/\{(\w+)\}/g, (_, k) =>
    values[k] !== undefined ? String(values[k]) : `{${k}}`
  );
}
