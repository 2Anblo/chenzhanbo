# Agent Guidelines

## Project Overview
- This repository contains a personal portfolio and technical writing site.
- This directory is the project root; run project commands from here.
- Tech stack: Next.js App Router, React 19, TypeScript, Tailwind CSS, Radix UI primitives, lucide-react, Markdown content, and Vercel serverless functions.
- Main public routes are defined under `app/`.
- Shared components, hooks, data, and utilities live under `src/`.
- Blog posts and project case studies are Markdown files under `content/`.
- Vercel API functions live under `api/` and are separate from the static App Router pages.

## Build And Test Commands
Run these from the project root:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

- `npm run dev` starts the local Next.js development server.
- `npm run lint` runs ESLint over the project.
- `npm run build` builds the Next.js app.
- There is currently no dedicated unit or e2e test script in `package.json`.

## Code Style Guidelines
- Prefer TypeScript and keep `strict` compatibility. The project enables `noUnusedLocals` and `noUnusedParameters`.
- Use the `@/*` path alias for imports from `src`.
- Follow the existing React component style: functional components, hooks, and client components only when browser APIs or interactivity are needed.
- Keep server-side content reading in library modules such as `src/lib/blog.ts` and `src/lib/projects.ts`.
- Use Tailwind utility classes and the existing design tokens from `src/index.css` and `tailwind.config.js`.
- Reuse existing UI primitives in `src/components/ui/` before adding new component patterns.
- Use `cn()` from `src/lib/utils.ts` for conditional class composition.
- Keep Markdown frontmatter compatible with the shapes documented in `README.md`.

## Testing Instructions
- Before handing off code changes, run `npm run lint`.
- For behavior, routing, content, i18n, or build-related changes, also run `npm run build`.
- When changing UI, verify the affected pages manually with `npm run dev`.
- When editing Markdown content, check that frontmatter fields are valid and that static routes still build.
- When changing API functions in `api/`, test both success and missing-configuration paths because Redis and Vercel credentials may not exist locally.
- Before running any git operation, confirm the current working directory is the Git repository root with `git rev-parse --show-toplevel`.
- After completing each task, commit the relevant changes when appropriate and run `git push`.

## Security Considerations
- Do not commit secrets, tokens, Redis URLs, or Vercel credentials.
- Runtime analytics counters depend on environment variables such as `REDIS_URL`, `BASE_URL`, `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID`.
- Treat Markdown content as user-visible site content; avoid unsafe raw HTML unless the renderer explicitly supports and sanitizes it.
- Keep admin authentication changes isolated to `src/lib/admin/` and related admin routes.
- Do not loosen TypeScript, ESLint, or authentication checks to work around a local failure.
- Avoid logging secrets or full request headers in serverless functions.

## Deployment Notes
- The site is configured for static-friendly deployment, while `api/` contains Vercel Serverless Functions for counters.
- Public pages should continue to render even if analytics APIs or Redis are unavailable.
- When changing routes, update sitemap and robots behavior if the change affects discoverability.
