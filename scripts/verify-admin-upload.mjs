// Uses the same optional PGlite runtime as verify-reading-admin.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
function load(file, dependencies = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => dependencies[name] ?? require(name), URL, Buffer, File, Response, Request, Date, console, ...globals }, { filename: file });
  return exports;
}
const session = load('src/lib/admin/session.ts');
const token = session.signSession('test-password', 1_790_000_000_000);
assert.ok(session.validateSession(token, 'test-password', 1_790_000_001_000));
for (const invalid of ['a'.repeat(64), `${token.slice(0, -1)}z`, token.replace(/^[a-f0-9]/, (c) => c === 'a' ? 'b' : 'a')]) assert.equal(session.validateSession(invalid, 'test-password', 1_790_000_001_000), false);
assert.equal(session.validateSession(token, 'wrong', 1_790_000_001_000), false);
assert.equal(session.validateSession(token, 'test-password', 1_790_028_800_000), false);
let cookie;
const auth = load('src/lib/admin/auth.ts', {
  './session': session,
  'next/headers': { cookies: async () => ({ get: () => cookie ? { value: cookie } : undefined, set: (_name, value) => { cookie = value; }, delete: () => { cookie = undefined; } }) },
}, { process: { env: { ADMIN_PASSWORD: 'test-password', NODE_ENV: 'test' } } });
await assert.rejects(auth.createSession('wrong'), /Unauthorized/);
cookie = 'a'.repeat(64);
assert.equal(await auth.isAuthenticated(), false);
await auth.createSession('test-password');
assert.equal(await auth.isAuthenticated(), true);
await auth.clearSession();
assert.equal(await auth.isAuthenticated(), false);

const { PGlite } = require('@electric-sql/pglite');
const { drizzle } = require('drizzle-orm/pglite');
const pg = new PGlite();
try {
  await pg.exec(fs.readFileSync('drizzle/0003_uploaded_images.sql', 'utf8'));
  const schema = load('src/lib/db/schema.ts');
  const db = drizzle(pg, { schema });
  const imagePreparation = load('src/lib/admin/image-upload.ts');
  let authenticated = false;
  const dependencies = { '@/lib/db': { db }, '@/lib/db/schema': schema, '@/lib/admin/auth': { isAuthenticated: async () => authenticated }, '@/lib/admin/image-upload': imagePreparation };
  const upload = load('app/api/admin/images/route.ts', dependencies);
  const serve = load('app/api/images/[id]/route.ts', dependencies);
  const pixels = await sharp({ create: { width: 2000, height: 1500, channels: 3, background: '#336699' } }).png().toBuffer();
  function request(file, origin = 'https://example.com') {
    const body = new FormData();
    body.append('file', file);
    return new Request('https://example.com/api/admin/images', { method: 'POST', headers: { origin }, body });
  }
  const valid = new File([pixels], 'cover.png', { type: 'image/png' });
  assert.equal((await upload.POST(request(valid))).status, 401);
  authenticated = true;
  assert.equal((await upload.POST(request(valid, 'https://evil.example'))).status, 403);
  assert.equal((await upload.POST(request(new File(['<svg/>'], 'test.svg', { type: 'image/svg+xml' })))).status, 400);
  assert.equal((await upload.POST(request(new File(['bad'], 'test.png', { type: 'image/png' })))).status, 400);
  assert.equal((await upload.POST(request(new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })))).status, 400);
  const response = await upload.POST(request(valid));
  assert.equal(response.status, 200);
  const { url } = await response.json();
  const id = url.split('/').at(-1);
  const output = await serve.GET(new Request(`https://example.com${url}`), { params: Promise.resolve({ id }) });
  assert.equal(output.status, 200);
  assert.equal(output.headers.get('content-type'), 'image/webp');
  const metadata = await sharp(Buffer.from(await output.arrayBuffer())).metadata();
  assert.equal(metadata.width, 1600);
  assert.equal(metadata.height, 1200);
  assert.equal(metadata.format, 'webp');
  assert.equal((await serve.GET(new Request('https://example.com'), { params: Promise.resolve({ id: 'missing' }) })).status, 404);
  await pg.exec('DROP TABLE uploaded_images');
  assert.equal((await upload.POST(request(valid))).status, 500);
  assert.equal((await serve.GET(new Request('https://example.com'), { params: Promise.resolve({ id }) })).status, 503);
  console.log('PASS: signed sessions, password checks, authorization, origin checks, image validation, database upload, resize, serving and failures');
} finally { await pg.close(); }
