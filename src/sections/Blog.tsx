'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { BlogPost } from '@/types';

interface BlogSectionProps {
  posts: BlogPost[];
  categories: string[];
}

export default function Blog({ posts, categories }: BlogSectionProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryItems = useMemo(
    () => [t('common.all'), ...categories],
    [categories, t]
  );
  const filtered = activeCategory === 'All'
    ? posts.slice(0, 6)
    : posts.filter((post) => post.categories.includes(activeCategory)).slice(0, 6);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section id="blog" className="w-full bg-background px-5 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl border-t border-foreground">
        <div className="grid gap-6 border-b border-border py-6 md:grid-cols-[260px_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {t('blogSection.tagline')}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t('blogSection.heading')}
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            {t('blogSection.description')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border py-4">
          {categoryItems.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {category === t('common.all')
                  ? t('common.all')
                  : t(`categories.${category}`)}
              </button>
            );
          })}
        </div>

        {featured ? (
          <div className="grid gap-0 md:grid-cols-[1.08fr_1fr]">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block border-b border-border py-8 md:border-b-0 md:border-r md:pr-8"
            >
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                {featured.categories.map((cat, index) => (
                  <span key={cat}>
                    {t(`categories.${cat}`)}
                    {index < featured.categories.length - 1 && (
                      <span className="mx-2">/</span>
                    )}
                  </span>
                ))}
                <span>/</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" />
                  {t('common.readingTime', { n: featured.readingTime })}
                </span>
                <span>/</span>
                <span>{featured.publishedAt}</span>
              </div>
              <h3 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary md:text-5xl">
                {featured.title}
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                {featured.excerpt}
              </p>
              <span className="mt-7 inline-flex items-center gap-1 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground group-hover:border-primary group-hover:text-primary">
                {t('blogSection.readNote')}
                <ArrowUpRight size={13} aria-hidden="true" />
              </span>
            </Link>

            <div className="grid">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group border-b border-border py-6 md:px-8"
                >
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    {post.categories.map((cat, index) => (
                      <span key={cat}>
                        {t(`categories.${cat}`)}
                        {index < post.categories.length - 1 && (
                          <span className="mx-1">/</span>
                        )}
                      </span>
                    ))}
                    <span>/</span>
                    <span>
                      {post.readingTime} {t('blogSection.minRead')}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-8 text-sm text-muted-foreground">
            {t('blogSection.noNotesYet')}
          </p>
        )}

        <div className="flex justify-end py-6">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {t('blogSection.allWriting')}
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
