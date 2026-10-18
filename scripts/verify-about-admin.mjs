// Optional runtime: use the PGlite NODE_PATH setup in verify-reading-admin.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const { PGlite } = require('@electric-sql/pglite');
const { drizzle } = require('drizzle-orm/pglite');
const pg = new PGlite();
let authenticated = false;
const invalidated = [];
const modules = new Map();
const boundaries = {
  'server-only': {},
  'next/cache': { unstable_cache: fn => fn, revalidateTag: tag => invalidated.push(tag), revalidatePath: route => invalidated.push(route) },
};
function load(file) {
  file = path.resolve(file);
  if (modules.has(file)) return modules.get(file);
  const exports = {};
  modules.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports, process, console, Date, require: name => {
    if (name in boundaries) return boundaries[name];
    if (name === './auth') return { isAuthenticated: async () => authenticated };
    if (name.startsWith('@/') || name.startsWith('.')) {
      let target = name.startsWith('@/') ? path.resolve('src', name.slice(2)) : path.resolve(path.dirname(file), name);
      target = fs.existsSync(target + '.ts') ? target + '.ts' : path.join(target, 'index.ts');
      return load(target);
    }
    return require(name);
  } }, { filename: file });
  return exports;
}
const originalUrl = process.env.DATABASE_URL;
try {
  await pg.exec(fs.readFileSync('drizzle/0005_about_pages.sql', 'utf8'));
  const schema = load('src/lib/db/schema.ts');
  boundaries['@/lib/db'] = { db: drizzle(pg, { schema }) };
  process.env.DATABASE_URL = 'postgres://local-test';
  const { defaultAboutDocument } = load('src/lib/about-content.ts');
  const reader = load('src/lib/about.ts');
  const { saveAboutDocument } = load('src/lib/admin/about-actions.ts');
  const document = JSON.parse(JSON.stringify(defaultAboutDocument()));
  assert.deepEqual(JSON.parse(JSON.stringify(await reader.readAboutDocument())), document);
  await assert.rejects(saveAboutDocument(document), /Unauthorized/);
  authenticated = true;
  document.zh.name = '修改后的名字';
  document.en.summary = 'Edited English summary';
  document.zh.learning = [{ name: 'Rust', description: '想学的方向' }];
  document.en.learning = [{ name: 'Rust', description: 'Learning goal' }];
  document.zh.labels.learningTitle = '我的学习雷达';
  assert.equal((await saveAboutDocument(document)).success, true);
  assert.deepEqual(JSON.parse(JSON.stringify(await reader.readAboutDocument())), document);
  const invalid = structuredClone(document);
  invalid.en.contact.github = 'javascript:alert(1)';
  assert.equal((await saveAboutDocument(invalid)).success, false);
  assert.deepEqual(JSON.parse(JSON.stringify(await reader.readAboutDocument())), document);
  document.zh.education = []; document.zh.experience = []; document.zh.skills = []; document.zh.learning = [];
  assert.equal((await saveAboutDocument(document)).success, true);
  assert.deepEqual(JSON.parse(JSON.stringify(await reader.readAboutDocument())), document);
  assert.ok(invalidated.includes('about-page') && invalidated.includes('/about'));
  await pg.exec('DROP TABLE about_pages');
  assert.equal((await saveAboutDocument(document)).success, false);
  assert.deepEqual(JSON.parse(JSON.stringify(await reader.getAboutDocument())), JSON.parse(JSON.stringify(defaultAboutDocument())));
  console.log('PASS: migration, defaults, authorization, bilingual persistence, edits and removals, URL validation, cache invalidation, database failure fallback');
} finally {
  if (originalUrl === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = originalUrl;
  await pg.close();
}
