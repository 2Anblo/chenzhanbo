# 陈展博个人主页

[English](./README.md)

这是一个基于 Next.js App Router 构建的个人作品集与技术博客站点。项目用于展示个人简介、教育经历、项目案例、博客文章、简历信息、中英文界面文案、SEO 元数据、轻量级访问统计，以及后台管理功能。

## 功能特性

- 基于 App Router 的首页、关于、项目、博客、简历页面
- 博客与项目详情由 Markdown 内容驱动
- 使用 `generateStaticParams` 静态生成博客和项目详情页
- 智能导航栏：滚动感知下的展开 / 浮动 / 隐藏三种状态
- 中英文 UI 字典与客户端语言切换
- 简历数据、站点元数据通过类型化模块维护
- 基于 Vercel Serverless Functions + Redis 的站点访问量和文章阅读量统计
- GitHub 贡献热力图与 LeetCode 刷题统计（通过 App Router API）
- 博客文章粘性目录与当前章节高亮
- 博客文章 Waline 评论
- 沉浸式首页开场动画
- 自定义光标
- 后台管理面板，支持博客与项目管理
- 根据本地博客和项目内容生成 sitemap 与 robots 元数据
- Tailwind CSS、shadcn 风格 UI 原语、lucide 图标
- 深色 / 浅色主题切换

## 技术栈

- 框架：Next.js 16、React 19、TypeScript
- 样式：Tailwind CSS、自定义全局 CSS
- 内容：Markdown、gray-matter、react-markdown、react-syntax-highlighter
- UI：Radix UI primitives、lucide-react、shadcn/ui 组件
- 图形/交互：Three.js、@react-three/fiber、Lenis（平滑滚动）
- 评论：Waline client
- 表单：react-hook-form、zod
- 分析/运行时：Vercel Analytics、Vercel Serverless Functions
- 存储：Redis，通过 `ioredis` 访问

## 项目架构

```text
app/                         Next.js App Router 路由与元数据路由
  page.tsx                   首页组合入口
  about/                     关于详情页
  blog/                      博客列表与静态博客详情路由
  projects/                  项目列表与静态项目详情路由
  resume/                    简历页
  admin/                     后台管理面板（登录、博客编辑、项目编辑）
  api/activity/              App Router API：GitHub/LeetCode 活动统计
  robots.ts                  robots 元数据生成
  sitemap.ts                 基于博客和项目内容生成 sitemap

api/                         Vercel Serverless Functions
  visits.ts                  站点访问量统计
  views/[slug].ts            博客文章阅读量统计

content/                     Markdown 内容源
  blog/                      博客文章及 frontmatter
  projects/                  项目案例及 frontmatter

src/
  components/                页面组件、UI 基础组件、后台管理组件
  sections/                  首页各个内容区块（Hero、About、Projects、Blog、TechStack）
  hooks/                     翻译、滚动方向、阅读量等客户端 hooks
  lib/                       内容读取、资源路径、工具函数、i18n 元数据、后台认证
  data/                      静态分类和项目/简历相关数据
  types/                     项目共享 TypeScript 类型
```

### 数据流

1. `app/` 下的页面负责路由和页面组合，并从 `src/lib` 读取类型化数据。
2. `src/lib/blog.ts` 和 `src/lib/projects.ts` 从 `content/` 读取 Markdown，通过 `gray-matter` 解析 frontmatter，并返回排序后的数据。
3. 博客和项目详情页通过 `generateStaticParams` 使用本地 slug 静态生成。
4. `I18nProvider` 从 `src/lib/i18n/dictionaries` 加载字典，并通过 `useTranslation()` 暴露 `t()`。
5. 客户端组件请求 `/api/visits` 和 `/api/views/[slug]`，部署时由 Serverless Function 将计数写入 Redis。
6. `/api/activity` 获取 GitHub 个人资料、贡献日历与 LeetCode 刷题数据，并带有 `revalidate` 缓存。

## 路由说明

| 路由 | 用途 |
| --- | --- |
| `/` | 首页，包含 Hero、关于摘要、项目、博客等区块 |
| `/about` | 关于详情页，包含个人简介、教育经历、工作经历、技术栈和活动统计 |
| `/projects` | 项目案例列表 |
| `/projects/[slug]` | 从 `content/projects` 静态生成的项目详情页 |
| `/blog` | 博客列表与分类 |
| `/blog/[slug]` | 从 `content/blog` 静态生成的博客详情页 |
| `/resume` | 可打印简历页 |
| `/admin` | 后台管理面板，用于管理博客和项目 |
| `/admin/login` | 后台登录页 |
| `/api/visits` | 站点访问量统计接口 |
| `/api/views/[slug]` | 博客文章阅读量统计接口 |
| `/api/activity` | GitHub/LeetCode 活动统计接口 |

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址：

```bash
http://localhost:3000
```

## 常用脚本

```bash
npm run dev      # 启动本地 Next.js 开发服务
npm run build    # 构建 Next.js 应用
npm run start    # 启动 Next.js 生产服务
npm run lint     # 运行 ESLint
```

## 环境变量

核心静态页面不依赖统计服务即可构建。访问量和阅读量接口以及活动统计接口在部署时需要以下变量：

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

- `REDIS_URL` 被两个计数接口使用。
- `VERCEL_TOKEN`、`VERCEL_TEAM_ID`、`VERCEL_PROJECT_ID` 只用于 `api/visits.ts`，在可用时从 Vercel Web Analytics 初始化站点访问量。
- `GITHUB_USERNAME` 和 `LEETCODE_USERNAME` 用于 `/api/activity` 获取贡献统计。
- `NEXT_PUBLIC_WALINE_SERVER_URL` 覆盖博客评论的默认 Waline 服务器。未设置时，站点使用 `https://waline-zb3.vercel.app`。

## 内容维护

### 新增博客

在 `content/blog` 下新增 Markdown 文件。frontmatter 示例：

```yaml
---
id: '1'
title: '文章标题'
excerpt: '文章摘要'
category: 'AI Agent'
tags: ['Java', 'RAG']
date: '2024-12-15'
slug: 'post-slug'
cover: 'blog/post-cover.png'
---
```

`readingTime` 是可选字段；不填写时会根据正文长度自动估算。

### 新增项目

在 `content/projects` 下新增 Markdown 文件。frontmatter 示例：

```yaml
---
id: 'project-id'
title: '项目标题'
subtitle: '项目副标题'
description: '项目摘要'
background: '项目背景'
techStack: ['Spring Boot', 'FastAPI']
contributions:
  - '主要贡献'
highlights:
  - '项目亮点'
githubUrl: 'https://github.com/...'
category: 'ai'
slug: 'project-slug'
date: '2025-01-01'
image: 'projects/project.png'
---
```

项目分类支持 `ai`、`microservices`、`personal`。

## 国际化

国际化相关代码集中在 `src/lib/i18n`：

- `config.ts` 定义支持的语言和默认语言。
- `dictionaries/zh.ts`、`dictionaries/en.ts` 存放 UI 文案。
- `types.ts` 维护字典结构类型。
- `metadata.ts` 生成本地化 SEO 元数据。
- `resume-data.ts` 存放本地化简历和个人资料数据。

客户端组件通过 `useTranslation()` 读取翻译。

## 部署说明

`next.config.ts` 当前配置：

```ts
images: { unoptimized: true }
```

`api/` 目录用于 Vercel Serverless Functions，`app/api/` 使用 Next.js App Router API 路由。如果统计 API 或 Redis 不可用，公开页面仍可正常渲染并自动降级。
