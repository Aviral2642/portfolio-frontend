import {readFile, writeFile, mkdir, rm} from 'node:fs/promises';

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
// One static entry per case page, so a shared link resolves without the 404
// redirect and carries its own title and description in link previews.
const {findingIndex: findings} = await import('../src/studio/data/findingIndex.js');
const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
for (const f of findings) {
  const pageTitle = escape(`${f.id}: ${f.title} in ${f.product} · Aviral Srivastava`);
  const pageUrl = `${base}/cve/${f.id}/`;
  const page = home
    .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]+/, `$1${pageUrl}`)
    .replace(/(<meta (?:property|name)="(?:og|twitter):url" content=")[^"]+/g, `$1${pageUrl}`)
    .replace(/(<meta (?:property|name)="(?:og|twitter):title" content=")[^"]+/g, `$1${pageTitle}`)
    .replace(/(<meta (?:property|name)="(?:description|og:description|twitter:description)" content=")[^"]+/g, `$1${escape(f.line)}`);
  await mkdir(new URL(`../build/cve/${f.id}/`, import.meta.url), {recursive: true});
  await writeFile(new URL(`../build/cve/${f.id}/index.html`, import.meta.url), page);
}
// Assets only the retired designer homepage used (development preview only). Keep them out of the deployed site.
for (const unused of ['intro', 'skyline.jpg', 'editorial/penn-state.jpg', 'editorial/amity.jpg']) {
  await rm(new URL(`../build/${unused}`, import.meta.url), {recursive: true, force: true});
}
await writeFile(new URL('../build/.nojekyll', import.meta.url), '');
console.log(`Static route metadata, ${findings.length} case pages and legacy research redirect generated. Research sources unchanged.`);
