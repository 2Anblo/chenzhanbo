'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return <MarkdownRenderer content={content} />;
}
