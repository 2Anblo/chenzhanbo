'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { BlogPost } from '@/types';

interface BlogSectionProps {
  posts: BlogPost[];
  categories: string[];
}

export default function Blog({ posts, categories }: BlogSectionProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const allLabel = 'All';
  const filtered = activeCategory === allLabel
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const categoryItems = [allLabel, ...categories];

  return (
    <section id="blog" className="w-full py-32 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A2E] tracking-tight">
            {t('blog.title')}
          </h2>
          <p className="mt-4 text-sm text-[#5F6368] max-w-xl">
            {t('blog.description')}
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap gap-2 mb-10 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          {categoryItems.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                activeCategory === cat
                  ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                  : 'text-[#5F6368] border-black/[0.08] hover:border-[#3B82F6]/30 hover:text-[#1A1A2E]'
              }`}
            >
              {cat === allLabel ? t('common.all') : t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`group p-6 rounded-xl border border-black/[0.08] bg-[#F8F9FA] hover:bg-[#F1F3F4] hover:border-[#3B82F6]/20 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 text-[9px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 rounded uppercase tracking-wider">
                  {t(`categories.${post.category}`)}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-[#5F6368]">
                  <Clock size={10} />
                  {t('common.readingTime', { n: post.readingTime })}
                </div>
              </div>

              <h3 className="text-lg font-medium text-[#1A1A2E] group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="mt-2 text-sm text-[#5F6368] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={10} className="text-[#5F6368]" />
                  <div className="flex gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] text-[#5F6368]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] text-[#5F6368]">{post.publishedAt}</span>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity">
                {t('blog.readMore')}
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-black/[0.08] text-sm text-[#5F6368] rounded-lg hover:border-[#3B82F6]/30 hover:text-[#3B82F6] transition-all duration-300"
          >
            {t('common.viewMore')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
