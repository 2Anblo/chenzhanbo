export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  background: string;
  techStack: string[];
  contributions: string[];
  highlights: string[];
  githubUrl: string;
  demoUrl?: string;
  category: 'ai' | 'microservices' | 'personal';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  slug: string;
}

export interface Education {
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  name: string;
  description: string;
  category: 'backend' | 'ai' | 'tools';
  proficiency?: number;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  education: Education[];
  skills: Skill[];
  projects: Project[];
  experience?: {
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}
