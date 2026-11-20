import {build} from 'esbuild';
await build({entryPoints:{motion:'choreography.js'},outdir:'../../directions/sites/beauty-salon/assets/motion',
  format:'esm',splitting:true,bundle:true,minify:true,target:'es2020',jsx:'automatic',
  chunkNames:'[name]-[hash]',legalComments:'eof',define:{'process.env.NODE_ENV':'"production"'}});
