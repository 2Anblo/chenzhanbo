# Zhanbo Chen Portfolio

[中文文档](./README.zh.md)

A personal portfolio and technical writing site built with Next.js App Router. The site presents profile information, education, projects, blog posts, resume content, bilingual UI text, SEO metadata, lightweight analytics counters, and an admin dashboard for content management.

## Features

- App Router pages for home, about, projects, blog, and resume
- Markdown-driven blog and project detail pages
- Static generation for content routes with `generateStaticParams`
- Smart header with scroll-aware expanded / floating / hidden states
- Chinese and English UI dictionaries with a client-side locale switcher
- Resume data and SEO metadata managed through typed data modules
- Blog view counts and site visit counts through Vercel Serverless Functions and Redis
- GitHub contribution heatmap and LeetCode stats via App Router API route
- Sticky table of contents for blog posts with active section highlighting
- Waline comments on blog posts
- Immersive portfolio intro animation
- Custom cursor
- Admin dashboard for blog and project management
- Sitemap and robots metadata generated from local content
- Tailwind CSS UI with shadcn-style component primitives and lucide icons
- Dark / light theme switching

## Tech Stack

- Framework: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS, custom global CSS
- Content: Markdown, gray-matter, react-markdown, react-syntax-highlighter
- UI: Radix UI primitives, lucide-react, shadcn/ui components
- Motion/graphics: Three.js, @react-three/fiber, Lenis (smooth scrolling)
- Comments: Waline client
- Forms: react-hook-form, zod
- Analytics/runtime: Vercel Analytics, Vercel Serverless Functions
- Storage: Redis through `ioredis`

## Architecture

```text
app/                         Next.js App Router routes and metadata routes
  page.tsx                   Home page composition
  about/                     About detail page
  blog/                      Blog list and static blog post routes
  projects/                  Project list and static project detail routes
  resume/                    Resume page
  admin/                     Admin dashboard (login, blog editor, project editor)
  api/activity/              App Router API: GitHub/LeetCode activity stats
  robots.ts                  Generated robots metadata
  sitemap.ts                 Generated sitemap from blog and project content

api/                         Vercel Serverless Functions
  visits.ts                  Site visit counter
  views/[slug].ts            Blog post view counter

content/                     Markdown content source
  blog/                      Blog posts with frontmatter
  projects/                  Project case studies with frontmatter

src/
  components/                Shared page components, UI primitives, and admin components
  sections/                  Home page sections (Hero, About, Projects, Blog, TechStack)
  hooks/                     Client hooks for translations, scroll direction, analytics calls
  lib/                       Content readers, assets, utilities, i18n metadata, admin auth
  data/                      Static categories and legacy/project data
  types/                     Shared TypeScript domain types
```

### Request/Data Flow

1. Page routes under `app/` compose server-rendered pages and import typed readers from `src/lib`.
2. `src/lib/blog.ts` and `src/lib/projects.ts` read Markdown files from `content/`, parse frontmatter with `gray-matter`, and expose sorted typed records.
3. Dynamic detail pages use local content slugs through `generateStaticParams`, so blog and project pages can be statically generated.
4. `I18nProvider` loads dictionaries from `src/lib/i18n/dictionaries` and exposes `t()` through `useTranslation()`.
5. Client components call `/api/visits` and `/api/views/[slug]`; those endpoints persist counters in Redis when deployed with the required environment variables.
6. `/api/activity` fetches GitHub profile stats, contribution calendar, and LeetCode solved questions, cached with `revalidate`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio landing page with hero, about summary, projects, and blog sections |
| `/about` | Detailed profile, education, experience, tech stack, and activity stats |
| `/projects` | All project case studies |
| `/projects/[slug]` | Static project detail page generated from `content/projects` |
| `/blog` | All blog posts with categories |
| `/blog/[slug]` | Static blog detail page generated from `content/blog` |
| `/resume` | Printable resume view |
| `/admin` | Admin dashboard for managing blog posts and projects |
| `/admin/login` | Admin login page |
| `/api/visits` | Site visit counter API |
| `/api/views/[slug]` | Blog view counter API |
| `/api/activity` | GitHub/LeetCode activity stats API |

## Getting Started

```bash
npm install
npm run dev
```

The development server starts with Next.js:

```bash
http://localhost:3000
```

## Scripts

```bash
npm run dev      # Start the local Next.js dev server
npm run build    # Build the Next.js app
npm run start    # Start Next.js production server
npm run lint     # Run ESLint
```

## Environment Variables

The core static pages can build without runtime analytics credentials. The counter APIs and activity API require these variables when deployed:

```env
REDIS_URL=redis://...
BASE_URL=https://your-domain.example
VERCEL_TOKEN=...
VERCEL_TEAM_ID=...
VERCEL_PROJECT_ID=...
GITHUB_USERNAME=2Anblo
LEETCODE_USERNAME=zanblo
NEXT_PUBLIC_WALINE_SERVER_URL=https://your-waline-server.example
```

- `REDIS_URL` is required by both counter endpoints.
- The Vercel variables (`VERCEL_TOKEN`, `VERCEL_TEAM_ID`, `VERCEL_PROJECT_ID`) are used only by `api/visits.ts` to seed the visit counter from Vercel Web Analytics when available.
- `GITHUB_USERNAME` and `LEETCODE_USERNAME` are used by `/api/activity` to fetch contribution stats.
- `NEXT_PUBLIC_WALINE_SERVER_URL` overrides the default Waline server for blog comments. When unset, the site uses `https://waline-zb3.vercel.app`.

## Content Editing

### Blog Posts

Add a Markdown file under `content/blog`. Required frontmatter:

```yaml
---
id: '1'
title: 'Post title'
excerpt: 'Short summary'
category: 'AI Agent'
tags: ['Java', 'RAG']
date: '2024-12-15'
slug: 'post-slug'
cover: 'blog/post-cover.png'
---
```

`readingTime` is optional. If omitted, it is estimated from the Markdown body.

### Projects

Add a Markdown file under `content/projects`. Required frontmatter:

```yaml
---
id: 'project-id'
title: 'Project title'
subtitle: 'Short subtitle'
description: 'Project summary'
background: 'Why this project exists'
techStack: ['Spring Boot', 'FastAPI']
contributions:
  - 'Key contribution'
highlights:
  - 'Key highlight'
githubUrl: 'https://github.com/...'
category: 'ai'
slug: 'project-slug'
date: '2025-01-01'
image: 'projects/project.png'
---
```

Supported project categories are `ai`, `microservices`, and `personal`.

## Internationalization

The locale system is defined in `src/lib/i18n`:

- `config.ts` defines supported locales and the default locale.
- `dictionaries/zh.ts` and `dictionaries/en.ts` store translated UI strings.
- `types.ts` keeps dictionary shape type-safe.
- `metadata.ts` derives localized SEO metadata.
- `resume-data.ts` stores localized resume/profile data.

Client components read translations through `useTranslation()`.

## Deployment Notes

`next.config.ts` uses:

```ts
images: { unoptimized: true }
```

The `api/` directory is intended for Vercel Serverless Functions, and `app/api/` uses Next.js App Router API routes. Public pages should continue to render even if analytics APIs or Redis are unavailable.
