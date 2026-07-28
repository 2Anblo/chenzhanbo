# Personal Site Redesign Plan

## Background

The current site is functional and clean, but the visual direction is too generic. It sits between a minimal portfolio, a card-based dashboard, and a personal blog without making a clear stylistic commitment.

The redesign goal is to make the site feel like a personal technical publication: polished enough for interviewers, detailed enough for design-sensitive viewers, and structured enough for open-source/community readers.

## Audience

Primary audience:

- Interviewers and hiring reviewers
- Open-source/community visitors

Secondary audience:

- Frontend/UIUX-aware viewers who will judge visual taste quickly
- Readers coming from technical blog posts

The site should communicate:

- Taste and attention to detail in the interface
- Technical seriousness through writing, resume structure, and project framing
- A clear personal identity without becoming gimmicky

## Reference

Main layout reference:

- Helena Zhang: https://www.helenazhang.com/?ref=onepagelove

What to learn from this reference:

- Strong personal identity area instead of a generic hero card
- Editorial rhythm: intro, articles, work sections, snapshots
- Text-first confidence with clear section dividers
- Avatar used as a central identity asset
- Links presented as part of the typography instead of oversized CTA buttons
- Content blocks arranged like a personal publication, not a SaaS landing page

What not to copy:

- Do not copy the exact visual style, serif-heavy personality, monochrome cartoon tone, or retro blog aesthetics.
- Do not turn the site into a direct imitation.
- Use the layout logic, not the skin.

## Direction

Working style name:

**Technical Notebook Editorial**

This direction combines:

- Personal technical blog
- Structured resume/dossier
- Editorial grid
- Engineer's notebook details

It should not become:

- A generic shadcn/Tailwind portfolio
- A full pixel-art site
- A terminal gimmick
- A heavy animated showcase
- A plain Astro Pure clone

## Visual Principles

Use:

- English-first or English-dominant layout, with Chinese kept available but visually secondary when both appear together
- White, near-white, black, muted gray, and restrained green
- Thin rules, section dividers, tables, annotations, and metadata
- Typography-led hierarchy
- Fewer cards, more editorial sections
- Text links and small icon links instead of large CTA buttons
- Stable, deliberate spacing
- Avatar as a first-screen identity anchor

Avoid:

- Generic hero card + project card + blog card layout
- Excessive rounded cards
- Button-heavy calls to action
- Tag clutter in the first viewport
- Gradient decoration
- Visual effects that do not support the site's identity
- Making GitHub/LeetCode stats visually louder than writing and resume

## Information Architecture

Recommended page priority:

1. Identity
2. Articles / Notes
3. Resume / Dossier
4. Selected Systems
5. Activity / Signals

Current issue:

- Latest project and latest article compete with the intro.
- Activity stats are useful but too prominent as a homepage visual object.
- The homepage reads more like a dashboard than a personal publication.

Target:

- Blog and resume become the core assets.
- Projects become supporting evidence, framed as systems or case studies.
- Activity becomes a compact credibility signal.

## Homepage Structure

### 1. Top Identity Bar

Replace the standard navigation-heavy opening with a compact identity strip inspired by the reference.

Possible content:

- `Currently: UIUC CS MS`
- `Zhanbo Chen`
- `GitHub - Blog - Resume - Email - LinkedIn`
- `@2Anblo`

The nav can still exist, but it should feel integrated into the typographic system.

### 2. Intro Section

Keep the existing anime avatar and make it a key identity asset.

Use an English-first intro:

```text
Zhanbo is a computer science student building backend systems and AI applications.
He writes about the engineering tradeoffs behind microservices, agents, RAG, and infrastructure.
```

Chinese can appear in a secondary line or through the existing language switch.

Avoid a typical button row. Prefer text links:

- `Read notes`
- `View resume`
- `Selected systems`

### 3. Articles / Notes

Move articles above projects.

Layout direction:

- Editorial grid
- Article title, short excerpt, reading time, date, topic
- Optional thumbnail or diagram if available
- Thin vertical/horizontal separators instead of heavy cards

Goal:

- Make technical writing feel like the site's main product.

### 4. Resume / Dossier

Reframe resume content as a structured dossier.

Possible sections:

- Education
- Focus areas
- Experience
- Technical stack
- Current status

Use metadata blocks, tables, and short annotations rather than large card panels.

### 5. Selected Systems

Rename projects to `Selected Systems` or `Case Studies`.

Each item should explain:

- What the system does
- Technical scope
- Architecture
- Tradeoffs
- What was personally implemented

Avoid making project cards look like product marketing cards.

### 6. Activity / Signals

Keep GitHub and LeetCode, but reduce their visual weight.

Use them as a compact signal panel:

- GitHub: repos, stars, contribution rhythm
- LeetCode: solved count and distribution

They should support the story, not dominate the page.

## Intro Animation

Keep the intro animation, but make it part of the site's identity system.

Current concern:

- The intro feels separate from the page and currently causes a hydration mismatch in development.

Target behavior:

- 1 to 1.5 seconds
- Skippable
- Respects reduced motion
- Does not block the user for too long
- Transitions into the actual homepage layout
- Feels like loading a personal technical notebook, not playing a detached splash animation

Possible animation concept:

1. `Zhanbo` appears.
2. The word resolves into fine lines, metadata, or layout guides.
3. The page grid fades in.
4. The avatar and intro text settle into place.

Technical requirement:

- Fix hydration mismatch before polishing the animation.

## Language Strategy

Use English as the primary visual language.

Recommended behavior:

- Default homepage can lean English.
- Keep Chinese available through the existing language switch.
- Avoid rendering long Chinese and English blocks with equal weight in the same viewport unless the layout explicitly supports it.

Reason:

- The target audience includes interviewers and open-source visitors.
- English-dominant presentation increases international readability.
- Chinese content can still be strong inside blog posts and localized pages.

## Implementation Phases

### Phase 1: Fix Current Runtime Issues

- Fix homepage intro hydration mismatch.
- Fix React warning caused by rendering a raw `script` tag in the blog detail page.
- Confirm dev overlay no longer shows issues.
- Re-run `npm run lint` and `npm run build`.

### Phase 2: Homepage Information Architecture

- Move articles above projects.
- Reduce project card dominance.
- Reframe activity stats as supporting signals.
- Replace CTA-heavy hero with identity-led intro.

### Phase 3: Visual System

- Define typography scale and section rhythm.
- Replace heavy cards with dividers and editorial blocks where appropriate.
- Reduce border radius and shadow usage.
- Limit green to links, state, and small emphasis.
- Make avatar treatment consistent with the new identity section.

### Phase 4: Content Rewrite

- Rewrite intro in English-first voice.
- Rename `Projects` framing to `Selected Systems` or `Case Studies`.
- Make project descriptions more architecture/tradeoff-focused.
- Tighten resume copy so it feels like a structured dossier.

### Phase 5: Interaction And Polish

- Rework intro animation to match the new layout.
- Add small hover/focus details to links and section headers.
- Verify mobile spacing and text wrapping.
- Test dark mode only if it remains part of the intended design.

## Acceptance Criteria

The redesign is successful if:

- The first viewport has a clear identity and does not look like a template portfolio.
- A viewer understands that writing and resume are the core assets.
- Projects support technical credibility without hijacking the homepage.
- The style is memorable but still appropriate for interviewers.
- The intro animation feels connected to the page instead of decorative.
- There are no React hydration/runtime warnings in dev.
- `npm run lint` passes.
- `npm run build` passes.
- Desktop and mobile screenshots show no overlapping floating controls or broken spacing.

## Open Decisions

- Final section name: `Articles`, `Notes`, or `Writing`
- Final project section name: `Selected Systems`, `Case Studies`, or `Projects`
- Whether the homepage default language should be English regardless of locale
- Whether to keep the current dark mode toggle after the redesign
- How much of the current activity stats visualization should remain on the homepage

