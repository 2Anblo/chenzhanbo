'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Tag, Eye } from 'lucide-react';
import { useBlogViews } from '@/hooks/useBlogViews';
import { useTranslation } from '@/hooks/useTranslation';
import { assetUrl } from '@/lib/assets';
import { cn } from '@/lib/utils';
import { extractMarkdownHeadings, type MarkdownHeading } from '@/lib/markdown-headings';
import type { BlogPost } from '@/types';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ReadingProgressButton from '@/components/ReadingProgressButton';
import WalineComments from '@/components/WalineComments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlogPostPageProps {
  post: BlogPost;
}

function TableOfContents({
  activeHeadingId,
  headings,
  title,
}: {
  activeHeadingId: string | null;
  headings: MarkdownHeading[];
  title: string;
}) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block self-stretch">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-border pl-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
          {title}
        </p>
        <nav aria-label={title}>
          <ol className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  aria-current={activeHeadingId === heading.id ? 'true' : undefined}
                  className={cn(
                    'block text-xs leading-relaxed text-muted-foreground transition-colors hover:text-foreground',
                    activeHeadingId === heading.id && 'font-semibold text-primary',
                    heading.depth === 2 && 'pl-3',
                    heading.depth === 3 && 'pl-6',
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </aside>
  );
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const { t } = useTranslation();
  const views = useBlogViews(post.slug);
  const headings = useMemo(() => extractMarkdownHeadings(post.content), [post.content]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    if (headings.length === 0) {
      setActiveHeadingId(null);
      return;
    }

    let frame = 0;
    const activationOffset = 112;

    const updateActiveHeading = () => {
      frame = 0;
      let currentHeadingId = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= activationOffset) {
          currentHeadingId = heading.id;
          continue;
        }

        break;
      }

      setActiveHeadingId((current) => (
        current === currentHeadingId ? current : currentHeadingId
      ));
    };

    const scheduleUpdate = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(updateActiveHeading);
    };

    updateActiveHeading();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [headings]);

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 xl:grid-cols-[minmax(0,48rem)_16rem] xl:items-stretch">
          <div className="mx-auto w-full min-w-0 max-w-3xl xl:mx-0 xl:max-w-none">
            <div>
              {/* Back Link */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={14} />
                {t('common.backToHome')}
              </Link>

              {/* Hero Cover */}
              {post.cover && (
                <div className="relative w-full h-56 md:h-72 mt-8 mb-8 rounded-xl overflow-hidden border border-border bg-muted">
                  <Image
                    src={assetUrl(post.cover)}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Post Header */}
              <header className="mb-12">
                <span className="mb-4 block text-[11px] font-medium text-muted-foreground">
                  {t(`categories.${post.category}`)}
                </span>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-tight font-display">
                  {post.title}
                </h1>

                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye size={12} />
                  {t('common.views', { views })}
                </div>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>

                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.publishedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {t('common.readingTime', { n: post.readingTime })}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Tag size={12} className="text-muted-foreground" />
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </header>
            </div>

            {/* Post Content */}
            <article id="blog-post-content">
              <MarkdownRenderer content={post.content} />
            </article>

            {/* Post Footer */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarImage src="/avatar.png" alt={t('blogPost.authorName')} />
                    <AvatarFallback className="bg-muted text-sm font-bold text-primary">
                      ZB
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('blogPost.authorName')}</p>
                    <p className="text-xs text-muted-foreground">{t('blogPost.authorRole')}</p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('blogPost.backToHome')}
                </Link>
              </div>
            </div>

            <WalineComments path={`/blog/${post.slug}`} />
          </div>

          <TableOfContents
            activeHeadingId={activeHeadingId}
            headings={headings}
            title={t('blogPost.tableOfContents')}
          />
        </div>
      </main>
      <ReadingProgressButton />
    </div>
  );
}
