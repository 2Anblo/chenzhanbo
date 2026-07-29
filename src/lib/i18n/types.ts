import type { Locale } from './config';

export type TranslationValue = string | TranslationDictionary;

export interface TranslationDictionary {
  [key: string]: TranslationValue;
}

export interface Dictionary {
  common: {
    name: string;
    siteTitle: string;
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
  };
  hero: {
    bento: {
      greeting: string;
      name: string;
      role: string;
      bio: string;
      sectionLabel: string;
      cta: {
        projects: string;
        blog: string;
        resume: string;
      };
      latestProject: {
        label: string;
        view: string;
      };
      latestPost: {
        label: string;
        read: string;
      };
    };
    notebook: {
      tagline: string;
      heading: string;
      description: string;
      cta: {
        readNotes: string;
        viewResume: string;
        selectedSystems: string;
      };
      sidebar: {
        latestNote: string;
        notesComingSoon: string;
        currentSystem: string;
        systemsComingSoon: string;
      };
    };
  };
  intro: {
    skip: string;
    skipAria: string;
    replay: string;
    replayAria: string;
    mark: string;
    titlePrefix: string;
    titleEm: string;
    sub: string;
    enter: string;
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
  activityStats: {
    title: string;
    publicActivity: string;
    description: string;
    repos: string;
    stars: string;
    followers: string;
    forks: string;
    contributionsPeriod: string;
    contributionsCount: string;
    contributionTitle: string;
    activeDays: string;
    activeDaysLabel: string;
    lessMore: string;
    leetcode: string;
    problemsSolved: string;
    leetcodeCn: string;
    easy: string;
    medium: string;
    hard: string;
    rank: string;
    latestAccepted: string;
    loadingLeetcode: string;
    solvedFromLeetcode: string;
    loading: string;
  };
  projects: {
    title: string;
    description: string;
    contributions: string;
    moreOnGitHub: string;
    viewOnGithub: string;
  };
  blog: {
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
    tableOfContents: string;
  };
  techStack: {
    title: string;
    description: string;
    categories: {
      backend: string;
      ai: string;
      tools: string;
    };
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
    title: string;
    description: string;
    fullBioTitle: string;
    educationTitle: string;
    experienceTitle: string;
    projectsTitle: string;
    techStackTitle: string;
    contactTitle: string;
    viewResume: string;
    contactCta: string;
  };
  projectsList: {
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
  blogSection: {
    tagline: string;
    heading: string;
    description: string;
    readNote: string;
    noNotesYet: string;
    allWriting: string;
    minRead: string;
  };
  projectsSection: {
    tagline: string;
    heading: string;
    description: string;
    implementationNotes: string;
    caseStudy: string;
    github: string;
    allSystems: string;
    categories: {
      ai: string;
      microservices: string;
      personal: string;
    };
  };
  aboutSection: {
    tagline: string;
    heading: string;
    description: string;
    fullResume: string;
    profile: string;
    current: string;
    currentSubtitle: string;
    education: string;
    focus: string;
  };
  categories: Record<string, string>;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: Dictionary;
  t: (key: string, values?: Record<string, string | number>) => string;
}
