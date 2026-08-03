'use client';

import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownCode from '@/components/MarkdownCode';
import { extractMarkdownHeadingIdByLine } from '@/lib/markdown-headings';

interface MarkdownRendererProps {
  content: string;
}

type HeadingNode = { position?: { start?: { line?: number } } };

function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // components 对象必须保持稳定：每次渲染新建内联组件会导致
  // React 卸载并重建整棵文章子树（代码块、mermaid 图全部重渲染）。
  const components = useMemo<Components>(() => {
    const headingIdByLine = extractMarkdownHeadingIdByLine(content);
    const getHeadingId = (node?: HeadingNode) => {
      const line = node?.position?.start?.line;
      return line == null ? undefined : headingIdByLine.get(line);
    };

    return {
      h1: ({ children, node }) => (
        <h1
          id={getHeadingId(node as HeadingNode)}
          className="scroll-mt-24 text-2xl font-semibold text-foreground dark:text-foreground mt-12 mb-5 tracking-tight font-display"
        >
          {children}
        </h1>
      ),
      h2: ({ children, node }) => (
        <h2
          id={getHeadingId(node as HeadingNode)}
          className="scroll-mt-24 text-xl font-semibold text-foreground dark:text-foreground mt-10 mb-4 tracking-tight font-display"
        >
          {children}
        </h2>
      ),
      h3: ({ children, node }) => (
        <h3
          id={getHeadingId(node as HeadingNode)}
          className="scroll-mt-24 text-lg font-medium text-foreground dark:text-foreground mt-8 mb-3"
        >
          {children}
        </h3>
      ),
      code: MarkdownCode,
      pre: ({ children }) => <>{children}</>,
      p: ({ children }) => (
        <p className="text-sm text-muted-foreground dark:text-muted-foreground leading-[1.8] mb-4">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-muted-foreground dark:text-muted-foreground mb-4">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-outside pl-5 space-y-1 text-sm text-muted-foreground dark:text-muted-foreground mb-4">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="text-sm text-muted-foreground dark:text-muted-foreground leading-relaxed">
          {children}
        </li>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto mb-6 rounded-lg border border-border dark:border-border">
          <table className="w-full text-sm text-muted-foreground dark:text-muted-foreground border-collapse">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="bg-card dark:bg-muted">{children}</thead>
      ),
      tbody: ({ children }) => <tbody>{children}</tbody>,
      tr: ({ children }) => (
        <tr className="border-b border-border dark:border-border last:border-b-0">
          {children}
        </tr>
      ),
      th: ({ children }) => (
        <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground dark:text-foreground border-b border-border dark:border-border">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-2.5 text-sm text-muted-foreground dark:text-muted-foreground">
          {children}
        </td>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-primary pl-4 py-1 my-4 text-sm text-muted-foreground dark:text-muted-foreground italic bg-card dark:bg-muted rounded-r-lg">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-8 border-border" />,
      a: ({ children, href }) => (
        <a
          href={href}
          className="text-primary hover:underline"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ),
      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
    };
  }, [content]);

  return (
    <article className="prose prose-sm max-w-none prose-pre:my-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}

export default memo(MarkdownRenderer);
