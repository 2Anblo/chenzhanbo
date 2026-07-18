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
    <section id="blog" className="w-full py-32 md:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`mb-16 transition-[opacity,transform] duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight font-display">
            {t('blog.title')}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl">
            {t('blog.description')}
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap gap-2 mb-10 transition-[opacity,transform] duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
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

        {/* Blog Posts */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={`glass-panel glass-panel-hover group p-6 transition-[opacity,transform,background-color,border-color] duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {t(`categories.${post.category}`)}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock size={10} />
                  {t('common.readingTime', { n: post.readingTime })}
                </div>
              </div>

              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={10} className="text-muted-foreground" />
                  <div className="flex gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] text-muted-foreground">{post.publishedAt}</span>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {t('blog.readMore')}
                <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm text-muted-foreground rounded-lg hover:border-primary/30 hover:text-primary transition-colors duration-150"
          >
            {t('common.viewMore')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
