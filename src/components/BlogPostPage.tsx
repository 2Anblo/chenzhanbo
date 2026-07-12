'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag, Eye } from 'lucide-react';
import { useBlogViews } from '@/hooks/useBlogViews';
import type { BlogPost } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BlogPostPageProps {
  post: BlogPost;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const views = useBlogViews(post.slug);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          返回首页
        </Link>

        {/* Post Header */}
        <header className="mb-12">
          <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-medium text-[#3B82F6] bg-[#3B82F6]/10 rounded uppercase tracking-wider mb-4">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A2E] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mt-3 flex items-center gap-1 text-xs text-[#5F6368] font-mono">
            <Eye size={12} />
            {views} 次阅读
          </div>

          <p className="mt-4 text-sm text-[#5F6368] leading-relaxed">{post.excerpt}</p>

          <div className="mt-6 flex items-center gap-4 text-xs text-[#5F6368] font-mono">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {post.publishedAt}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} 分钟阅读
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Tag size={12} className="text-[#5F6368]" />
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono text-[#5F6368]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Post Content */}
        <article className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as Record<string, React.CSSProperties>}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className}>
                    {children}
                  </code>
                );
              },
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-[#1A1A2E] mt-10 mb-4 tracking-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium text-[#1A1A2E] mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-sm text-[#5F6368] leading-[1.8] mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 text-sm text-[#5F6368] mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 text-sm text-[#5F6368] mb-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-sm text-[#5F6368] leading-relaxed">
                  {children}
                </li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm text-[#5F6368] border border-black/[0.08] rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[#F8F9FA]">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left text-xs font-mono font-medium text-[#1A1A2E] border-b border-black/[0.08]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-sm text-[#5F6368] border-b border-black/[0.05]">
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[#3B82F6] pl-4 py-1 my-4 text-sm text-[#5F6368] italic bg-[#F8F9FA] rounded-r-lg">
                  {children}
                </blockquote>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Post Footer */}
        <div className="mt-16 pt-8 border-t border-black/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F1F3F4] border border-black/[0.08] flex items-center justify-center">
                <span className="text-sm font-bold text-[#3B82F6] font-mono">ZB</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A2E]">陈展博</p>
                <p className="text-xs text-[#5F6368]">Java 后端 & AI Agent Developer</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
