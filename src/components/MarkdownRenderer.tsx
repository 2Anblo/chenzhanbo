import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownCode from '@/components/MarkdownCode';
import { createHeadingId } from '@/lib/markdown-headings';

interface MarkdownRendererProps {
  content: string;
}

function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }

  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as { props?: { children?: ReactNode } };
    return getNodeText(element.props?.children);
  }

  return '';
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const headingCounts = new Map<string, number>();

  return (
    <article className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const id = createHeadingId(getNodeText(children), headingCounts);

            return (
              <h1
                id={id}
                className="scroll-mt-24 text-2xl font-semibold text-foreground dark:text-foreground mt-12 mb-5 tracking-tight font-display"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = createHeadingId(getNodeText(children), headingCounts);

            return (
              <h2
                id={id}
                className="scroll-mt-24 text-xl font-semibold text-foreground dark:text-foreground mt-10 mb-4 tracking-tight font-display"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = createHeadingId(getNodeText(children), headingCounts);

            return (
              <h3
                id={id}
                className="scroll-mt-24 text-lg font-medium text-foreground dark:text-foreground mt-8 mb-3"
              >
                {children}
              </h3>
            );
          },
          code: MarkdownCode,
          p: ({ children }) => (
            <p className="text-sm text-muted-foreground dark:text-muted-foreground leading-[1.8] mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground dark:text-muted-foreground mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground dark:text-muted-foreground mb-4">
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
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
