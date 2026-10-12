import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise Next's actual font loader with the options used by the root layout.
// Google font URLs without file extensions crashed the production build.
const require = createRequire(import.meta.url);
const localLoader = require('next/dist/compiled/@next/font/dist/local/loader.js').default;
const layoutPath = path.resolve(process.argv[2] ?? 'app/layout.tsx');
const source = fs.readFileSync(layoutPath, 'utf8');
assert.ok(!source.includes('next/font/google'), 'Fonts must build without Google Fonts requests');
const ast = ts.createSourceFile(layoutPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const fonts = [];
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)
      && node.initializer.expression.getText(ast) === 'localFont') {
    fonts.push({ name: node.name.getText(ast), options: vm.runInNewContext(`(${node.initializer.arguments[0].getText(ast)})`) });
  }
  ts.forEachChild(node, visit);
}
visit(ast);
assert.equal(fonts.length, 3, 'All three site fonts must use local files');
let emitted = 0;
for (const { name, options } of fonts) {
  const result = await localLoader({
    functionName: '', variableName: name, data: [options],
    resolve: async (file) => path.resolve(path.dirname(layoutPath), file),
    loaderContext: { fs },
    emitFontFile(buffer, extension) {
      assert.ok(buffer.length > 1000, 'Font file must contain real font data');
      assert.equal(buffer.readUInt32BE(0), 0x00010000, 'Expected a TrueType font');
      emitted++;
      return `/fonts/${name}.${extension}`;
    },
  });
  assert.ok(result.css.includes('@font-face'));
  assert.ok(!result.css.includes('https://'));
  console.log(`PASS ${name}: local font loaded and CSS generated`);
}
assert.equal(emitted, 4, 'Includes both normal and italic Cormorant Garamond');
