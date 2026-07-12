import type { Metadata } from 'next';
import type { Locale } from './config';
import { localeOgLocales } from './config';
import { getDictionary } from './dictionaries';

export function getSiteMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale).metadata;

  return {
    title: {
      default: d.title,
      template: '%s | Zhanbo',
    },
    description: d.description,
    keywords: d.keywords,
    authors: [{ name: d.authorName }],
    creator: d.authorName,
    metadataBase: new URL('https://chenzhanbo.vercel.app'),
    openGraph: {
      title: d.ogTitle,
      description: d.ogDescription,
      type: 'website',
      locale: localeOgLocales[locale],
      siteName: d.siteName,
    },
    twitter: {
      card: 'summary',
      title: d.ogTitle,
      description: d.ogDescription,
    },
    icons: {
      icon: '/favicon.png',
    },
  };
}

export function getBlogMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  const title = d.nav.blog;
  const description = d.blogList.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Zhanbo`,
      description,
      type: 'website',
      locale: localeOgLocales[locale],
      siteName: d.metadata.siteName,
    },
    twitter: {
      card: 'summary',
      title: `${title} | Zhanbo`,
      description,
    },
  };
}

export function getResumeMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  const title = 'Resume';
  const description = d.metadata.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Zhanbo`,
      description,
      type: 'website',
      locale: localeOgLocales[locale],
      siteName: d.metadata.siteName,
    },
    twitter: {
      card: 'summary',
      title: `${title} | Zhanbo`,
      description,
    },
  };
}
