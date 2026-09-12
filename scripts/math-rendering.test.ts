import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MarkdownRenderer from '../src/components/MarkdownRenderer';

const render = (content: string) => renderToStaticMarkup(createElement(MarkdownRenderer, { content }));
const html = render('Inline $x^2$\n\n$$\n\\frac{1}{2}\n$$');
assert.equal((html.match(/class="katex"/g) ?? []).length, 2);
assert.equal((html.match(/class="katex-display"/g) ?? []).length, 1);
assert.match(html, /<math /, 'Accessible MathML is emitted');
assert.doesNotMatch(render('`$x^2$`\n\n```text\n$x^2$\n```'), /class="katex"/, 'Code stays literal');
assert.doesNotMatch(render('Price: \\$5 and \\$10'), /class="katex"/, 'Escaped dollar signs stay literal');
assert.match(render('$\\notARealCommand$'), /notARealCommand/, 'Invalid math does not crash the article');
assert.match(render('| A | B |\n| - | - |\n| $x$ | **bold** |'), /<table/, 'GFM tables still render');
console.log('Math rendering regression checks passed');

