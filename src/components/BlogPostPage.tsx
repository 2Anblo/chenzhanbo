'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Tag, Eye } from 'lucide-react';
import { useBlogViews } from '@/hooks/useBlogViews';
import { useTranslation } from '@/hooks/useTranslation';
import { assetUrl } from '@/lib/assets';
import type { BlogPost } from '@/types';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlogPostPageProps {
  post: BlogPost;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const { t } = useTranslation();
  const views = useBlogViews(post.slug);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24">
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
          <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-primary bg-primary/10 rounded uppercase tracking-wider mb-4">
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

        {/* Post Content */}
        <MarkdownRenderer content={post.content} />

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
      </div>
    </div>
  );
}
