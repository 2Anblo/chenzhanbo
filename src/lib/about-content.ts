import { z } from 'zod';
import { getResumeData } from '@/lib/i18n/resume-data';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
const text = z.string().max(20000);
const url = z.string().max(2000).refine(v => !v || /^https?:\/\//i.test(v), '请输入 http 或 https 链接');
export const aboutSchema = z.object({
  name: text, title: text, summary: text,
  avatar: z.string().max(2000).refine(v => /^\/(?!\/)/.test(v) || /^https?:\/\//i.test(v)),
  contact: z.object({ email: z.email(), github: url, linkedin: url }),
  education: z.array(z.object({ school: text, major: text, degree: text, startDate: text, endDate: text, description: text })).max(100),
  experience: z.array(z.object({ company: text, role: text, period: text, description: text })).max(100),
  skills: z.array(z.object({ name: text, description: text, category: z.enum(['ai', 'backend', 'tools']) })).max(200),
  learning: z.array(z.object({ name: text, description: text })).max(200),
  labels: z.object({ backToHome: text, fullBioTitle: text, educationTitle: text, experienceTitle: text, projectsTitle: text, techStackTitle: text, contactTitle: text, viewResume: text, contactCta: text, learningTitle: text, learningDescription: text, learningEmpty: text, github: text, linkedin: text }),
  categories: z.object({ ai: text, backend: text, tools: text }),
});
export type AboutContent = z.infer<typeof aboutSchema>;
export const aboutDocumentSchema = z.object({ zh: aboutSchema, en: aboutSchema });
export type AboutDocument = z.infer<typeof aboutDocumentSchema>;
export function defaultAboutContent(locale: Locale): AboutContent {
  const r = getResumeData(locale), d = getDictionary(locale);
  return {
    name: r.name, title: r.title, summary: r.summary, avatar: '/favicon.png', contact: { ...r.contact },
    education: r.education.map(e => ({ ...e, description: e.description ?? '' })), experience: r.experience ?? [],
    skills: r.skills.map(({ name, description, category }) => ({ name, description, category })), learning: [],
    labels: { fullBioTitle: d.aboutPage.fullBioTitle, educationTitle: d.aboutPage.educationTitle, experienceTitle: d.aboutPage.experienceTitle, projectsTitle: d.aboutPage.projectsTitle, techStackTitle: d.aboutPage.techStackTitle, contactTitle: d.aboutPage.contactTitle, viewResume: d.aboutPage.viewResume, contactCta: d.aboutPage.contactCta, backToHome: d.common.backToHome, github: 'GitHub', linkedin: 'LinkedIn',
      learningTitle: locale === 'zh' ? '学习雷达' : 'Learning Radar',
      learningDescription: locale === 'zh' ? '值得学习、尚未掌握的技术与方向。' : 'Technologies and directions I want to learn but haven’t mastered yet.',
      learningEmpty: locale === 'zh' ? '正在整理下一步想学的技术。' : 'Putting together what I want to learn next.' },
    categories: { ...d.techStack.categories },
  };
}
export function defaultAboutDocument(): AboutDocument { return { zh: defaultAboutContent('zh'), en: defaultAboutContent('en') }; }
