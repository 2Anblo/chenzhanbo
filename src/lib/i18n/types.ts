import type { Locale } from './config';

export type TranslationValue = string | TranslationDictionary;

export interface TranslationDictionary {
  [key: string]: TranslationValue;
}

export interface Dictionary {
  common: {
    name: string;
    backToHome: string;
    readingTime: string;
    views: string;
    sendEmail: string;
    printPdf: string;
    all: string;
    location: string;
    toggleMenu: string;
    siteVisits: string;
    viewMore: string;
    viewDetails: string;
  };
  nav: {
    home: string;
    about: string;
    projects: string;
    blog: string;
    contact: string;
  };
  hero: {
    title: string;
    tagline: string;
    description: string;
    viewProjects: string;
    readBlog: string;
    viewResume: string;
    scroll: string;
  };
  about: {
    title: string;
    educationTitle: string;
    workTitle: string;
    workItems: Array<{
      title: string;
      desc: string;
      icon: string;
    }>;
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    contributions: string;
    moreOnGitHub: string;
    viewOnGithub: string;
  };
  blog: {
    eyebrow: string;
    title: string;
    description: string;
    readMore: string;
    viewAllPosts: string;
  };
  blogList: {
    title: string;
    description: string;
  };
  blogPost: {
    authorName: string;
    authorRole: string;
    backToHome: string;
  };
  techStack: {
    eyebrow: string;
    title: string;
    description: string;
    categories: {
      backend: string;
      ai: string;
      tools: string;
    };
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    sendEmail: string;
    labels: string[];
  };
  resume: {
    summaryTitle: string;
    educationTitle: string;
    skillsTitle: string;
    projectsTitle: string;
    contactTitle: string;
    rights: string;
  };
  aboutPage: {
    eyebrow: string;
    title: string;
    description: string;
    fullBioTitle: string;
    experienceTitle: string;
    projectsTitle: string;
    techStackTitle: string;
    contactTitle: string;
    viewResume: string;
    contactCta: string;
  };
  projectsList: {
    eyebrow: string;
    title: string;
    description: string;
    demo: string;
  };
  projectPost: {
    backToHome: string;
    backToProjects: string;
    backgroundTitle: string;
    techStackTitle: string;
    contributionsTitle: string;
    highlightsTitle: string;
    demoLink: string;
    githubLink: string;
    noDemo: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    authorName: string;
    ogTitle: string;
    ogDescription: string;
    siteName: string;
  };
  categories: Record<string, string>;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: Dictionary;
  t: (key: string, values?: Record<string, string | number>) => string;
}
