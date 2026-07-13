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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {t('common.backToHome')}
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
            {t('blogList.title')}
          </h1>
          <p className="mt-4 text-sm text-[#5F6368] max-w-xl">
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
                  ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                  : 'text-[#5F6368] border-black/[0.08] hover:border-[#3B82F6]/30 hover:text-[#1A1A2E]'
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
              className="group block p-6 rounded-xl border border-black/[0.08] bg-[#F8F9FA] hover:bg-[#F1F3F4] hover:border-[#3B82F6]/20 transition-colors duration-150"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {post.cover && (
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 border border-black/[0.08] bg-[#F1F3F4]">
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
                    <span className="px-2 py-0.5 text-[9px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 rounded uppercase tracking-wider">
                      {t(`categories.${post.category}`)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[#5F6368]">
                      <Calendar size={10} />
                      {post.publishedAt}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#5F6368]">
                      <Clock size={10} />
                      {t('common.readingTime', { n: post.readingTime })}
                    </div>
                  </div>

                  <h2 className="text-lg font-medium text-[#1A1A2E] group-hover:text-[#3B82F6] transition-colors">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-sm text-[#5F6368] leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <Tag size={10} className="text-[#5F6368]" />
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-[#5F6368]">
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
