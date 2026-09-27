import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fetchPost } from './translate-live-blog.mjs';

const directory = path.resolve('src/data/blog-translations/en');
const files = (await fs.readdir(directory)).filter((file) => file.endsWith('.json'));
let failures = 0;

function fencedBlocks(text) {
  return [...text.matchAll(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm)].map((match) => match[0]);
}

for (const file of files) {
  const slug = file.slice(0, -5);
  const original = await fetchPost(slug);
  const translated = JSON.parse(await fs.readFile(path.join(directory, file), 'utf8'));
  const hash = crypto.createHash('sha256').update(original.title + original.excerpt + original.content).digest('hex');
  const issues = [];
  if (translated.sourceHash !== hash) issues.push('source changed');
  if (!translated.title || !translated.excerpt || !translated.content) issues.push('missing translated field');
  const originalCode = fencedBlocks(original.content);
  const translatedCode = fencedBlocks(translated.content);
  if (originalCode.length !== translatedCode.length) issues.push(`fenced blocks ${originalCode.length} -> ${translatedCode.length}`);
  for (let i = 0; i < Math.min(originalCode.length, translatedCode.length); i++) {
    const sourceLines = originalCode[i].split('\n');
    const targetLines = translatedCode[i].split('\n');
    if (sourceLines.length !== targetLines.length) issues.push(`fenced block ${i + 1} line count changed`);
    for (let j = 0; j < Math.min(sourceLines.length, targetLines.length); j++) {
      if (!/[\u3400-\u9fff]/.test(sourceLines[j])
        && sourceLines[j] !== targetLines[j]) issues.push(`fenced block ${i + 1} line ${j + 1} changed`);
    }
  }
  const originalHeadings = [...original.content.matchAll(/^(#{1,6})\s+.+$/gm)].map((match) => match[1].length);
  const translatedHeadings = [...translated.content.matchAll(/^(#{1,6})\s+.+$/gm)].map((match) => match[1].length);
  if (JSON.stringify(originalHeadings) !== JSON.stringify(translatedHeadings)) issues.push('heading structure changed');
  const originalImages = [...original.content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
  for (const image of originalImages) {
    if (!translated.content.includes(image)) issues.push(`missing image ${image}`);
  }
  const originalLinks = [...original.content.matchAll(/\]\((https?:[^)]+)\)/g)].map((match) => match[1]);
  for (const link of originalLinks) {
    if (!translated.content.includes(link)) issues.push(`missing link ${link}`);
  }
  const originalDisplays = (original.content.match(/\$\$/g) ?? []).length;
  const translatedDisplays = (translated.content.match(/\$\$/g) ?? []).length;
  if (originalDisplays !== translatedDisplays) issues.push(`display math ${originalDisplays} -> ${translatedDisplays}`);
  const originalFormulae = [...original.content.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => match[1].trim());
  const translatedFormulae = [...translated.content.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => match[1].trim());
  for (let i = 0; i < Math.min(originalFormulae.length, translatedFormulae.length); i++) {
    const normalize = (formula) => formula.replace(/\\text\{[^}]*\}/g, '\\text{}');
    if (normalize(originalFormulae[i]) !== normalize(translatedFormulae[i])) issues.push(`display formula ${i + 1} changed`);
  }
  if (/[\u3400-\u9fff]/.test(translated.title + translated.excerpt + translated.content)) issues.push('Chinese text remains');
  if (issues.length) {
    failures++;
    console.error(`${slug}: ${issues.join('; ')}`);
  } else {
    console.log(`${slug}: OK`);
  }
}

if (files.length === 0 || failures) process.exitCode = 1;
