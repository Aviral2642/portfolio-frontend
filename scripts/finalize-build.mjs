import {readFile, writeFile, mkdir} from 'node:fs/promises';

// Deployment packages reviewed content only; research synchronization is manual.
const base = 'https://www.aviralsrivastava.tech';
const home = await readFile(new URL('../build/index.html', import.meta.url), 'utf8');
const title = 'Exploits & Analysis — Aviral Srivastava';
const description = 'Independent security research archive. Kernel and AI infrastructure research, analysis, and disclosure references by Aviral Srivastava.';
const archive = home
  .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  .replace(/(<link rel="canonical" href=")[^"]+/, `$1${base}/exploits/`)
  .replace(/(<meta (?:property|name)="(?:og|twitter):url" content=")[^"]+/g, `$1${base}/exploits/`)
  .replace(/(<meta (?:property|name)="(?:og|twitter):title" content=")[^"]+/g, `$1${title}`)
  .replace(/(<meta (?:property|name)="(?:description|og:description|twitter:description)" content=")[^"]+/g, `$1${description}`);
await mkdir(new URL('../build/exploits/', import.meta.url), {recursive: true});
await writeFile(new URL('../build/exploits/index.html', import.meta.url), archive);
// /research was a historical route. Preserve incoming links with a real redirect.
await mkdir(new URL('../build/research/', import.meta.url), {recursive: true});
await writeFile(new URL('../build/research/index.html', import.meta.url), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/#research"><link rel="canonical" href="'+base+'/#research"><title>Research — Aviral Srivastava</title></head><body><a href="/#research">Continue to research</a></body></html>');
await writeFile(new URL('../build/.nojekyll', import.meta.url), '');
console.log('Static route metadata and legacy research redirect generated. Research sources unchanged.');
