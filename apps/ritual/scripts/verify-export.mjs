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
assert.doesNotMatch(html, /aria-label="Тихий свет/);
const prefix = '/directions/sites/ritual';
const urls = [...html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]);
let assets = 0;
for (const url of new Set(urls)) {
  if (url.startsWith(prefix + '/_next/')) { assert.ok((await stat(join(root, url.slice(prefix.length)))).isFile(), `Missing ${url}`); assets++; }
}
assert.ok(assets > 3, 'Expected Next.js bundles');
async function files(dir) { let all=[];for(const e of await readdir(dir,{withFileTypes:true})){ const p=join(dir,e.name);all.push(...(e.isDirectory()?await files(p):[p]));}return all; }
const all = await files(root);
const cssText = (await Promise.all(all.filter((file) => file.endsWith('.css')).map((file) => readFile(file, 'utf8')))).join('\n');
assert.match(cssText, /#5c6155/);
assert.match(cssText, /#555a4d/);
assert.match(cssText, /hover:\s*hover/);
assert.match(cssText, /pointer:\s*fine/);
assert.match(cssText, /\.hours-footnote\{[^}]*font-size:11px/);
assert.doesNotMatch(cssText, /\.hours-footnote\{[^}]*font-size:(?:8|9)px/);
for (const color of ['#73776a', '#7e8373', '#757762', '#8a8571', '#929282', '#74715f', '#85806c', '#6f7368', '#777864', '#828675', '#8a8b78', '#727769']) {
  assert.equal(cssText.includes(color), false, `Low-contrast color remains: ${color}`);
}
const scripts = await Promise.all(all.filter((file) => file.endsWith('.js')).map(async (file) => [file, await readFile(file, 'utf8')]));
const probeBundles = scripts.filter(([, text]) => text.includes('software rasterizer'));
assert.ok(probeBundles.length > 0, 'WebGL probe missing from the export');
for (const [file, text] of probeBundles) {
  assert.equal(text.includes('WebGL 1 is not supported'), false, `Three.js is bundled with the WebGL probe (${file})`);
}
assert.ok(scripts.some(([, text]) => text.includes('WebGL 1 is not supported')), 'Three.js scene chunk missing');
console.log(`Verified exported page: 3 services, 4 timeline stages, form labels, demo state, ${assets} referenced assets, ${all.length} files.`);
