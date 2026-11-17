import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('out');
const html = await readFile(join(root, 'index.html'), 'utf8');
assert.match(html, /Когда важна/);
for (const id of ['services','first-hours','approach','contact','request-name','request-phone']) assert.ok(html.includes(`id="${id}"`), `Missing ${id}`);
assert.equal((html.match(/class="service-card"/g) || []).length, 3);
assert.equal((html.match(/class="step"/g) || []).length, 4);
assert.match(html, /Демонстрационный проект/);
assert.match(html, /Приём реальных заявок не подключён/);
assert.match(html, /noindex/);
const prefix = '/directions/sites/ritual';
const urls = [...html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]);
let assets = 0;
for (const url of new Set(urls)) {
  if (url.startsWith(prefix + '/_next/')) { assert.ok((await stat(join(root, url.slice(prefix.length)))).isFile(), `Missing ${url}`); assets++; }
}
assert.ok(assets > 3, 'Expected Next.js bundles');
async function files(dir) { let all=[];for(const e of await readdir(dir,{withFileTypes:true})){ const p=join(dir,e.name);all.push(...(e.isDirectory()?await files(p):[p]));}return all; }
const all = await files(root);
console.log(`Verified exported page: 3 services, 4 timeline stages, form labels, demo state, ${assets} referenced assets, ${all.length} files.`);
