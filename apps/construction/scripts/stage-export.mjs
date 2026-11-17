import {cp,rm,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
const target=resolve('../../directions/sites/construction');
if(!target.endsWith('/directions/sites/construction'))throw new Error('Unexpected target');
await stat('out/index.html');
await rm(target,{recursive:true,force:true});
await cp('out',target,{recursive:true});
await rm(resolve(target,'fonts'),{recursive:true,force:true});
console.log('Construction export staged');
