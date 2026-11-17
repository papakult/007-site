import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve('out');
const html=await readFile(join(root,'index.html'),'utf8');
for(const s of ['<h1','Наши','application/ld+json','og:image','name="description"','/directions/sites/construction','Рассчитать стоимость','Коттеджи'])if(!html.includes(s))throw Error('Missing '+s);
if(/mc\.yandex|metrika\.js|googletagmanager/.test(html))throw Error('Unexpected analytics');
const urls=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
let checked=0;
for(const u of urls){if(!u.startsWith('/directions/sites/construction/'))continue;const p=join(root,decodeURIComponent(u.replace('/directions/sites/construction/','').split('?')[0]));await stat(p);checked++;}
for(const name of ['hero-villa.webp','apartments.webp','commercial.webp','industrial.webp','hero-video.mp4'])await stat(join(root,name));
const base='../../';
for(const name of ['index.html','CNAME','directions/sites/ritual/index.html','assets/directions.css'])await stat(join(base,name));
console.log(`Validated metadata, structured data, ${checked} local URLs, all visuals, no analytics, root and ritual files.`);
