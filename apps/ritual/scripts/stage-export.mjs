import { cp, rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const target = resolve('../../directions/sites/ritual');
if (!target.endsWith('/directions/sites/ritual')) throw new Error('Unexpected export destination');
await stat('out/index.html');
await rm(target, { recursive:true, force:true });
await cp('out', target, { recursive:true });
await rm(resolve(target,'fonts'), { recursive:true, force:true });
console.log(`Staged Next.js export at ${target}`);
