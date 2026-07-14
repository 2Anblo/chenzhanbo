'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { assetUrl } from '@/lib/assets';
import type { BlogPost } from '@/types';

interface BlogListPageProps {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogListPage({ posts, categories }: BlogListPageProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');

  const allLabel = 'All';
  const filtered = activeCategory === allLabel
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const categoryItems = [allLabel, ...categories];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {t('common.backToHome')}
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-display">
            {t('blogList.title')}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl">
            {t('blogList.description')}
          </p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categoryItems.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors duration-150 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {cat === allLabel ? t('common.all') : t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Blog Posts List */}
        <div className="space-y-6">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block p-6 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary/20 transition-colors duration-150"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {post.cover && (
                  <div className="relative w-full md:w-48 h-32 rounded overflow-hidden flex-shrink-0 border border-border bg-muted">
                    <Image
                      src={assetUrl(post.cover)}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-0.5 text-[9px] font-medium text-primary bg-primary/10 rounded uppercase tracking-wider">
                      {t(`categories.${post.category}`)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar size={10} />
                      {post.publishedAt}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock size={10} />
                      {t('common.readingTime', { n: post.readingTime })}
                    </div>
                  </div>

                  <h2 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <Tag size={10} className="text-muted-foreground" />
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
