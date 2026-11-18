import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';

const root = resolve('out');
const base = '/directions/sites/ritual/';
async function filesIn(dir) {
  const entries = await readdir(dir, {withFileTypes:true});
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(join(dir,entry.name)) : join(dir,entry.name)));
  return nested.flat();
}
const files = await filesIn(root);
const pages = files.filter(p => p.endsWith('index.html') && !/\/(404|_not-found)\//.test(p));
const cache = new Map();
for(const path of pages) cache.set(path, await readFile(path,'utf8'));
assert.equal(pages.length, 22, 'Expected home, three services, family guide and 17 catalog routes');
let linksChecked = 0;
for (const [path,html] of cache) {
  const url = new URL(base + relative(root,path).replace(/index\.html$/,''), 'https://007-a.ru');
  assert.match(html, /<h1\b/);
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /<(?:form|input|textarea|select|iframe|video)\b|mc\.yandex\.|googletagmanager\.com|google-analytics\.com/i);
  for(const match of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const dest = new URL(match[2].replaceAll('&amp;','&'),url);
    if (dest.origin !== url.origin) { assert.equal(match[1],'href', 'Unexpected external resource '+dest); continue; }
    if (!dest.pathname.startsWith(base)) continue;
    const file = join(root,decodeURIComponent(dest.pathname.slice(base.length)),dest.pathname.endsWith('/')?'index.html':'');
    assert.ok((await stat(file)).isFile(), 'Missing '+dest+' from '+url);
    if (dest.hash && cache.has(file)) assert.ok(cache.get(file).includes('id="'+decodeURIComponent(dest.hash.slice(1))+'"'), 'Missing anchor '+dest);
    linksChecked++;
  }
}
const home=cache.get(join(root,'index.html'));
assert.match(home,/Архитектура/);
for(const scene of ['hero-wide','ceremony','urn','monument']) assert.ok(home.includes('/plates/'+scene+'.webp'));
console.log(`Verified ${pages.length} public pages, four cover scenes and ${linksChecked} local links and resources.`);
