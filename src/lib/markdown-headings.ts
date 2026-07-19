export interface MarkdownHeading {
  id: string;
  depth: 1 | 2 | 3;
  text: string;
}

export function slugifyHeading(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'section';
}

export function createHeadingId(text: string, counts: Map<string, number>): string {
  const baseId = slugifyHeading(text);
  const count = counts.get(baseId) ?? 0;
  counts.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const counts = new Map<string, number>();
  let inFence = false;

  for (const line of content.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const text = match[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~]/g, '')
      .trim();

    if (!text) {
      continue;
    }

    headings.push({
      id: createHeadingId(text, counts),
      depth: match[1].length as MarkdownHeading['depth'],
      text,
    });
  }

  return headings;
}
