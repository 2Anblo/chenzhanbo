import { z } from 'zod';

const webUrl = z.string().trim().max(2000).url().refine((value) => {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}, '请输入有效的 HTTP 或 HTTPS 链接');

export const readingFormSchema = z.object({
  id: z.string().max(255).optional(),
  kind: z.enum(['paper', 'blog']),
  title: z.string().trim().min(1, '请填写标题').max(500),
  summary: z.object({
    zh: z.string().trim().min(1, '请填写中文概要').max(10000),
    en: z.string().trim().min(1, '请填写英文概要').max(10000),
  }),
  url: webUrl,
  source: z.string().trim().min(1, '请填写来源').max(255),
  image: z.union([
    z.literal(''),
    webUrl,
    z.string().trim().max(2000).regex(/^\/(?!\/)[^\\\s]*$/, '请输入图片链接或站内路径'),
  ]).optional(),
  sortOrder: z.number().int().min(-2147483648).max(2147483647),
});

export type ReadingForm = z.infer<typeof readingFormSchema>;
