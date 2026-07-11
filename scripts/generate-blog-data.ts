import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawFrontmatter {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readingTime?: number;
  slug?: string;
}

const CONTENT_DIR = path.resolve(__dirname, '../content/blog');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/generatedPosts.ts');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const BASE_URL = process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://chenzhanbo.vercel.app';

function estimateReadingTime(content: string): number {
  const cleaned = content.replace(/\s/g, '');
  const minutes = Math.ceil(cleaned.length / 350);
  return Math.max(1, minutes);
}

function generateSitemap(posts: Array<{ slug: string; publishedAt: string }>) {
  const routes = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/resume', priority: '0.6', changefreq: 'monthly' },
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: post.publishedAt,
    })),
  ];

  const urls = routes
    .map(
      (route) => `  <url>\n    <loc>${BASE_URL}${route.path}</loc>${
        route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ''
      }\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function generateRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
}

function generatePosts() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  const posts = files.map((file) => {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const frontmatter = data as RawFrontmatter;

    const slug = frontmatter.slug ?? path.basename(file, '.md');
    const readingTime = frontmatter.readingTime ?? estimateReadingTime(content);

    return {
      id: String(frontmatter.id),
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      content,
      category: frontmatter.category,
      tags: frontmatter.tags,
      publishedAt: frontmatter.date,
      readingTime,
      slug,
    };
  });

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const output = `import type { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};

export { blogCategories } from './blogCategories';
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateSitemap(posts), 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), generateRobots(), 'utf-8');

  console.log(`Generated ${posts.length} blog posts to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  console.log(`Generated sitemap.xml and robots.txt to ${path.relative(process.cwd(), PUBLIC_DIR)}`);
}

generatePosts();
