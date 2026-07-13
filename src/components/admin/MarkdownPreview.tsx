'use client';

import ReactMarkdown from 'react-markdown';
import MarkdownCode from '@/components/MarkdownCode';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <article className="prose prose-sm max-w-none">
      <ReactMarkdown
        components={{
          code: MarkdownCode,
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-[#1A1A2E] mt-10 mb-4 tracking-tight font-display">
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
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#3B82F6] pl-4 py-1 my-4 text-sm text-[#5F6368] italic bg-[#F8F9FA] rounded-r-lg">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
