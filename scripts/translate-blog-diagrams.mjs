import fs from 'node:fs/promises';
import path from 'node:path';

const directory = path.resolve('src/data/blog-translations/en');
const files = (await fs.readdir(directory)).filter((file) => file.endsWith('.json'));
const han = /[\u3400-\u9fff]/;

async function translateLines(lines) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      system: 'Translate Chinese-language text inside these technical diagrams and code examples to accurate English. Return ONLY a JSON array of strings with exactly the same length and order as the input. Preserve all syntax, indentation, ASCII diagrams, Mermaid structure, code identifiers, punctuation, and non-Chinese content. Do not add or remove lines. Translate comments, labels, and prose, but do not alter code behavior.',
      messages: [{ role: 'user', content: JSON.stringify(lines) }],
    }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`API ${response.status}: ${result.error?.type}`);
  const output = result.content.filter((item) => item.type === 'text').map((item) => item.text).join('');
  const translated = JSON.parse(output.replace(/^```(?:json)?\s*|\s*```$/g, ''));
  if (!Array.isArray(translated) || translated.length !== lines.length || translated.some((line) => typeof line !== 'string')) {
    throw new Error('Translation did not return the same number of lines');
  }
  return translated;
}

for (const file of files) {
  const destination = path.join(directory, file);
  const data = JSON.parse(await fs.readFile(destination, 'utf8'));
  const blocks = [...data.content.matchAll(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm)];
  const originalLines = blocks.flatMap((block) => block[0].split('\n').filter((line) => han.test(line)));
  if (!originalLines.length) continue;
  const translatedLines = [];
  for (let index = 0; index < originalLines.length; index += 25) {
    translatedLines.push(...await translateLines(originalLines.slice(index, index + 25)));
  }
  let lineIndex = 0;
  data.content = data.content.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm, (block) =>
    block.split('\n').map((line) => han.test(line) ? translatedLines[lineIndex++] : line).join('\n'));
  if (lineIndex !== originalLines.length) throw new Error(`${file}: line replacement mismatch`);
  await fs.writeFile(destination, JSON.stringify(data, null, 2) + '\n');
  console.log(`${file}: translated ${lineIndex} diagram/code lines`);
}
