// Optional test runtime: install @electric-sql/pglite in a temporary directory,
// then set NODE_PATH to that directory's node_modules before running this file.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { PGlite } = require('@electric-sql/pglite');
const { drizzle } = require('drizzle-orm/pglite');
const pg = new PGlite();

// Load real application modules, replacing only session/cache framework boundaries
// and the database transport. Queries still run against a real Postgres engine.
function load(file, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, require: (name) => dependencies[name] ?? require(name), URL, Date, console,
  }, { filename: file });
  return exports;
}

try {
  await pg.exec(fs.readFileSync('drizzle/0002_reading_entries.sql', 'utf8'));
  const schema = load('src/lib/db/schema.ts');
  const db = drizzle(pg, { schema });
  const invalidated = [];
  const cache = {
    unstable_cache: (fn) => fn,
    revalidateTag: (tag) => invalidated.push(tag),
    revalidatePath: (route) => invalidated.push(route),
  };
  const dependencies = { '@/lib/db': { db }, '@/lib/db/schema': schema, 'next/cache': cache };
  const reading = load('src/lib/reading.ts', dependencies);
  const validation = load('src/lib/admin/reading-validation.ts');
  let authenticated = false;
  const actions = load('src/lib/admin/reading-actions.ts', {
    ...dependencies, '@/lib/reading': reading, './reading-validation': validation,
    './auth': { isAuthenticated: async () => authenticated },
  });
  for (const [name, args] of [
    ['listReadingEntries', []], ['getReadingEntry', ['test']],
    ['saveReadingEntry', [{}]], ['deleteReadingEntry', ['test']],
  ]) await assert.rejects(actions[name](...args), /Unauthorized/);
  authenticated = true;
  const original = (await actions.listReadingEntries())[0];
  assert.equal(original.id, 'effective-red-teaming-policy-adherent-agents');
  assert.ok(original.summary.zh.includes('CRAFT'));
  assert.ok(original.summary.en.includes('CRAFT'));
  const draft = { kind: 'blog', title: 'Test article', source: 'Test', url: 'https://example.com/post', image: '', summary: { zh: '测试', en: 'Test summary' }, sortOrder: -10 };
  for (const input of [
    { ...draft, url: 'javascript:alert(1)' }, { ...draft, url: 'bad-url' },
    { ...draft, image: '//example.com/image' }, { ...draft, image: 'data:image/svg+xml,bad' },
    { ...draft, summary: { zh: '', en: 'Test' } }, { ...draft, sortOrder: 1.5 },
    { ...draft, kind: 'invalid' },
  ]) assert.equal((await actions.saveReadingEntry(input)).success, false);
  assert.equal((await actions.listReadingEntries()).length, 1);
  assert.equal((await actions.saveReadingEntry(draft)).success, true);
  let items = await reading.getReadingItems();
  assert.equal(items.length, 2);
  assert.equal(items[0].title, draft.title);
  const created = items[0];
  assert.equal((await actions.saveReadingEntry({ ...created, title: 'Edited', image: '/images/reading/craft.svg', sortOrder: 10 })).success, true);
  items = await reading.getReadingItems();
  assert.equal(items[0].id, original.id);
  assert.equal(items[1].title, 'Edited');
  assert.equal((await actions.getReadingEntry(created.id)).image, '/images/reading/craft.svg');
  assert.equal((await actions.saveReadingEntry({ ...created, image: '' })).success, true);
  assert.equal((await actions.getReadingEntry(created.id)).image, '');
  assert.equal((await actions.saveReadingEntry({ ...created, id: 'missing' })).success, false);
  for (const item of items) assert.equal((await actions.deleteReadingEntry(item.id)).success, true);
  assert.equal((await reading.getReadingItems()).length, 0, 'Deleted seed must not reappear');
  assert.equal(await actions.getReadingEntry(created.id), null);
  assert.ok(invalidated.includes('reading-items') && invalidated.includes('/reading'));
  await pg.exec('DROP TABLE reading_entries');
  assert.equal((await actions.saveReadingEntry(draft)).success, false);
  assert.equal((await actions.deleteReadingEntry(created.id)).success, false);
  console.log('PASS: migration, seed, async authorization, validation, CRUD, ordering, cache invalidation, empty list, database failures');
} finally {
  await pg.close();
}
