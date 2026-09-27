import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const origin = 'https://www.chenzhanbo.com';
const outputDir = path.resolve('src/data/blog-translations/en');
const model = 'claude-haiku-4-5-20251001';
const headers = {
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'content-type': 'application/json',
};

function readObject(text, start) {
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (escaped) { escaped = false; continue; }
    if (char === '\\' && quoted) { escaped = true; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (quoted) continue;
    if (char === '{') depth++;
    if (char === '}' && --depth === 0) return JSON.parse(text.slice(start, i + 1));
  }
  throw new Error('Could not parse post data');
}

export async function fetchPost(slug) {
  const response = await fetch(`${origin}/blog/${slug}`);
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  const html = await response.text();
  const chunks = [...html.matchAll(/<script>self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
  const flight = chunks.join('');
  const postStart = flight.indexOf('"post":{"id":');
  if (postStart < 0) throw new Error(`${slug}: post not found in response`);
  const post = readObject(flight, postStart + '"post":'.length);
  if (post.slug !== slug) throw new Error(`${slug}: mismatched post`);
  if (post.content.startsWith('$')) {
    const id = post.content.slice(1);
    const match = new RegExp(`(?:^|\\n)${id}:T([0-9a-f]+),`).exec(flight);
    if (!match) throw new Error(`${slug}: Markdown stream not found`);
    const offset = match.index + match[0].length;
    post.content = Buffer.from(flight.slice(offset)).subarray(0, parseInt(match[1], 16)).toString('utf8');
  }
  return post;
}

async function translate(source, instruction) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        system: 'You translate Chinese technical writing into accurate, natural English. Return only the translation, with no introduction, explanation, or outer code fence. Preserve the Markdown structure, heading levels, links, image URLs, tables, code blocks, inline code, math notation, citations, examples, and technical meaning. Do not summarize or add information. Text already in English can stay in English.',
        messages: [{ role: 'user', content: `${instruction}\n\n${source}` }],
      }),
    });
    const result = await response.json();
    if (response.ok && result.stop_reason === 'end_turn') {
      const text = result.content.filter((item) => item.type === 'text').map((item) => item.text).join('').trim();
      if (text) return text;
    }
    if (response.status !== 429 && response.status < 500 && result.stop_reason !== 'max_tokens') {
      throw new Error(`Translation failed: ${response.status} ${result.error?.type ?? result.stop_reason}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
  }
  throw new Error('Translation retries exhausted');
}

function sections(markdown, limit = 4800) {
  const lines = markdown.split('\n');
  const chunks = [];
  let current = '';
  let fenced = false;
  for (const line of lines) {
    const next = `${line}\n`;
    if (current.length + next.length > limit && !fenced && current) {
      chunks.push(current);
      current = '';
    }
    current += next;
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is required');
  await fs.mkdir(outputDir, { recursive: true });
  const list = await (await fetch(`${origin}/blog`)).text();
  const slugs = [...new Set([...list.matchAll(/href="\/blog\/([^"?#]+)"/g)].map((match) => match[1]))];
  for (const slug of slugs) {
    const destination = path.join(outputDir, `${slug}.json`);
    const post = await fetchPost(slug);
    const hash = crypto.createHash('sha256').update(post.title + post.excerpt + post.content).digest('hex');
    const existing = await fs.readFile(destination, 'utf8').then(JSON.parse).catch(() => null);
    if (existing?.sourceHash === hash) { console.log(`skip ${slug}`); continue; }
    console.log(`translate ${slug}: ${post.content.length} chars`);
    const metadata = await translate(JSON.stringify({ title: post.title, excerpt: post.excerpt }), 'Translate the JSON string values to English. Return a valid JSON object with exactly title and excerpt keys.');
    const fields = JSON.parse(metadata.replace(/^```(?:json)?\s*|\s*```$/g, ''));
    const chunks = sections(post.content);
    const translated = [];
    for (let i = 0; i < chunks.length; i++) {
      translated.push(await translate(chunks[i], `Translate Markdown chunk ${i + 1} of ${chunks.length}. Preserve leading and trailing structure.`));
    }
    const content = translated.join('\n');
    if (!fields.title || !fields.excerpt || content.length < post.content.length * 0.3) {
      throw new Error(`${slug}: suspiciously incomplete translation`);
    }
    await fs.writeFile(destination, JSON.stringify({ sourceHash: hash, title: fields.title, excerpt: fields.excerpt, content }, null, 2) + '\n');
    console.log(`done ${slug}: ${translated.length} chunks`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
