import type { Metadata } from 'next';
import type { Project } from '@/types';
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

export function getAboutMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  const title = d.nav.about;
  const description = d.aboutPage.description;

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

export function getProjectsMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  const title = d.nav.projects;
  const description = d.projectsList.description;

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

export function getProjectPostMetadata(project: Project, locale: Locale): Metadata {
  const d = getDictionary(locale);

  return {
    title: project.title,
    description: project.description,
    keywords: project.techStack,
    openGraph: {
      title: `${project.title} | Zhanbo`,
      description: project.description,
      type: 'article',
      locale: localeOgLocales[locale],
      siteName: d.metadata.siteName,
      images: project.image ? [project.image] : undefined,
    },
    twitter: {
      card: 'summary',
      title: project.title,
      description: project.description,
    },
  };
}
