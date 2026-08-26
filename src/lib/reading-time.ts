export interface ReadingStats {
  cjkCharacters: number;
  words: number;
  minutes: number;
}

const CJK_CHARACTER_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

function markdownToReadableText(markdown: string): string {
  return markdown
    .replace(/<!--[^]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gm, '')
    .replace(/[`*_~|]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');
}

export function getReadingStats(markdown: string): ReadingStats {
  const readableText = markdownToReadableText(markdown);
  const cjkCharacters = readableText.match(CJK_CHARACTER_PATTERN)?.length ?? 0;
  const nonCjkText = readableText.replace(CJK_CHARACTER_PATTERN, ' ');
  const words = nonCjkText.match(WORD_PATTERN)?.length ?? 0;

  if (cjkCharacters === 0 && words === 0) {
    return { cjkCharacters, words, minutes: 0 };
  }

  const minutes = Math.max(1, Math.ceil(cjkCharacters / 350 + words / 200));
  return { cjkCharacters, words, minutes };
}

export function estimateReadingTime(markdown: string): number {
  return getReadingStats(markdown).minutes;
}
