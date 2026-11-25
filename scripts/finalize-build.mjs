import {readFile, writeFile, mkdir, rm} from 'node:fs/promises';

// Runs after `vite build`. For every route it writes a real HTML file with its
// own title, description, share image, structured data and the page's text as
// plain HTML, so a shared link or a crawler that does not run JavaScript still
// gets the content. The app replaces that text when it starts.
// Deployment packages reviewed content only; research synchronization is manual.

const {findings} = await import('../src/studio/data/findings.js');
const {SITE, HOME_TITLE, HOME_DESCRIPTION, caseTitle, caseDescription, caseUrl} = await import('../src/studio/data/caseMeta.js');
const {families} = await import('../src/studio/data/findingIndex.js');
const {projects} = await import('../src/data/projects.js');
const {speaking} = await import('../src/data/speaking.js');
const {research} = await import('../src/data/research.js');
const {blogPosts} = await import('../src/data/blog.js');
const {skills} = await import('../src/data/skills.js');
const {exploits} = await import('../src/data/exploits.js');

const template = await readFile(new URL('../build/index.html', import.meta.url), 'utf8');
const today = new Date().toISOString().slice(0, 10);
const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const list = (items, tag = 'ul') => `<${tag}>${items.map(item => `<li>${item}</li>`).join('')}</${tag}>`;
const iso = date => (date.length === 7 ? `${date}-01` : date);

const profiles = {
  linkedin: 'https://linkedin.com/in/aviralsrivastava23',
  github: 'https://github.com/Aviral2642',
  medium: 'https://medium.com/@aviral23',
  hackernoon: 'https://hackernoon.com/u/aviralxroot',
  scholar: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
  htb: 'https://profile.hackthebox.com/profile/019c48c2-965c-72ee-9f09-d047d439ab2c',
  speaker: 'https://sessionize.com/aviral-srivastava/',
};
const personId = `${SITE}/#person`;
const person = {
  '@type': 'Person', '@id': personId, name: 'Aviral Srivastava', url: `${SITE}/`,
  jobTitle: 'Security Engineer', description: 'Security engineer and researcher working on AI infrastructure and systems security.',
  worksFor: {'@type': 'Organization', name: 'Amazon'},
  alumniOf: [{'@type': 'CollegeOrUniversity', name: 'The Pennsylvania State University'}, {'@type': 'CollegeOrUniversity', name: 'Amity University'}],
  award: ['Pwnie Awards 2026 nominee, Best Server-Side / Cloud Bug', 'RSA Security Scholar 2025'],
  knowsAbout: ['Vulnerability research', 'AI infrastructure security', 'LLM security', 'Model Context Protocol security', 'Linux kernel security', 'Exploit development', 'Request smuggling', 'OAuth security', 'Binary analysis', 'Malware analysis'],
  sameAs: Object.values(profiles),
};

function render({title, description, url, image, imageAlt, type = 'website', jsonld, pre}) {
  const set = (html, pattern, value) => html.replace(pattern, (match, head) => `${head}${esc(value)}`);
  let html = template.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`);
  html = set(html, /(<link rel="canonical" href=")[^"]+/, url);
  html = set(html, /(<meta name="description" content=")[^"]+/, description);
  html = set(html, /(<meta property="og:type" content=")[^"]+/, type);
  html = set(html, /(<meta property="og:url" content=")[^"]+/, url);
  html = set(html, /(<meta property="og:title" content=")[^"]+/, title);
  html = set(html, /(<meta property="og:description" content=")[^"]+/, description);
  html = set(html, /(<meta property="og:image" content=")[^"]+/, image);
  html = set(html, /(<meta property="og:image:alt" content=")[^"]+/, imageAlt);
  html = set(html, /(<meta name="twitter:title" content=")[^"]+/, title);
  html = set(html, /(<meta name="twitter:description" content=")[^"]+/, description);
  html = set(html, /(<meta name="twitter:image" content=")[^"]+/, image);
  // "<" is escaped so no string in the data can close the script element.
  const data = JSON.stringify({'@context': 'https://schema.org', '@graph': jsonld}).replace(/</g, '\\u003c');
  html = html.replace('</head>', `<script type="application/ld+json">${data}</script>\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root"><div class="pre">${pre}</div></div>`);
}
async function write(path, html) {
  await mkdir(new URL(`../build/${path}`, import.meta.url), {recursive: true});
  await writeFile(new URL(`../build/${path}index.html`, import.meta.url), html);
}

/* ---- home ---- */
const findingLine = f => `${link(`/cve/${f.id}/`, `${f.id}: ${f.product}`)}. ${esc(f.title)}. ${typeof f.score === 'number' ? `CVSS ${f.score}, ` : ''}${esc(f.severity)}.`;
const homePre = `
<header><h1>Aviral Srivastava</h1><p>Security engineer and researcher. Amazon, Ads Security. Sunnyvale, California.</p>
<p>I take AI infrastructure apart at the points where it trusts something it should not. I study the gap between what a system promises and what it actually permits.</p>
<nav>${[link('#findings', 'Findings'), link('/exploits/', 'Research archive'), link('/resume.pdf', 'Resume'), link(profiles.linkedin, 'LinkedIn'), link(profiles.github, 'GitHub')].join(' · ')}</nav></header>
<section id="findings"><h2>Vulnerability disclosures</h2><p>${findings.length} assigned CVEs, each with its own case page: root cause, how it works, fix, timeline and coverage.</p>${list(findings.map(findingLine), 'ol')}</section>
<section><h2>Research archive: exploits and analysis</h2><p>${exploits.length} analyses of Linux kernel n-days and AI infrastructure vulnerabilities, with root cause, reproduction and detection notes. ${link('/exploits/', 'Open the archive')}.</p></section>
<section><h2>Recognition</h2>${list([
    'Pwnie Awards 2026 nominee, Best Server-Side / Cloud Bug, for the Langflow research',
    `CVE-2026-33017 listed in the CISA Known Exploited Vulnerabilities catalog`,
    link('https://csrc.nist.gov/projects/olir/informative-reference-catalog/details?referenceId=198', 'NIST OLIR contribution: OWASP LLM Top 10 v2.0 mapped to NIST CSF 2.0'),
    'RSA Security Scholar 2025', 'OSCP and CCSK v5', 'Cybersecurity Innovator of the Year, BSides Bangalore',
  ])}</section>
<section><h2>Work experience</h2>${list([
    'Amazon. Security Engineer, Ads Security. Sunnyvale, California. August 2025 to present.',
    'Penn State University. Teaching Assistant, red teaming and CTFs. 2023 to 2024.',
    'Six security internships. Malware reverse engineering, secure DevOps, governance and risk. 2022 to 2023.',
  ])}</section>
<section><h2>Education</h2>${list(['The Pennsylvania State University. Master of Science, Cybersecurity Analytics and Operations. May 2025.', 'Amity University. Bachelor of Technology, Computer Science. 2023.'])}</section>
<section><h2>Open source</h2>${list(projects.map(p => `${link(p.githubUrl, p.title)}`))}</section>
<section><h2>Conference talks</h2>${list(speaking.map(s => `${esc(s.conference)} (${esc(s.year)}): ${esc(s.title)}`))}<p>${link(profiles.speaker, 'Speaker profile')}</p></section>
<section><h2>Expertise</h2>${list(skills.map(k => `${esc(k.title)}: ${esc(k.description)}`))}</section>
<section><h2>Writing</h2><h3>Articles</h3>${list(blogPosts.map(b => link(b.url, b.title)))}<h3>Papers</h3>${list(research.map(r => `${link(r.pdfUrl, r.title)} (${esc(r.venue)})`))}
<p>${[link(profiles.medium, 'Medium'), link(profiles.hackernoon, 'HackerNoon'), link(profiles.scholar, 'Google Scholar'), link(profiles.htb, 'Hack The Box')].join(' · ')}</p></section>
<footer><p>Contact: ${link(profiles.linkedin, 'LinkedIn')}.</p></footer>`;
const homeLd = [
  {'@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Aviral Srivastava', description: HOME_DESCRIPTION, inLanguage: 'en', publisher: {'@id': personId}},
  person,
  {'@type': 'ProfilePage', '@id': `${SITE}/#profile`, url: `${SITE}/`, name: HOME_TITLE, isPartOf: {'@id': `${SITE}/#website`}, mainEntity: {'@id': personId}, dateModified: today},
  {'@type': 'ItemList', name: 'Vulnerability disclosures by Aviral Srivastava', numberOfItems: findings.length, itemListElement: findings.map((f, i) => ({'@type': 'ListItem', position: i + 1, url: caseUrl(f), name: `${f.id}: ${f.product}. ${f.title}`}))},
];
await writeFile(new URL('../build/index.html', import.meta.url), render({
  title: HOME_TITLE, description: HOME_DESCRIPTION, url: `${SITE}/`, image: `${SITE}/og/home.jpg`, imageAlt: 'Aviral Srivastava, security engineer and researcher', type: 'profile', jsonld: homeLd, pre: homePre,
}));

/* ---- one page per finding ---- */
for (const f of findings) {
  const url = caseUrl(f), title = caseTitle(f), description = caseDescription(f);
  const others = findings.filter(o => o.id !== f.id);
  const pre = `
<nav>${link('/', 'Aviral Srivastava')} › ${link('/#findings', 'Findings')} › ${esc(f.id)}</nav>
<article><h1>${esc(f.id)}: ${esc(f.product)}. ${esc(f.title)}</h1><p>${esc(f.line)}</p>
<dl><dt>Severity</dt><dd>${typeof f.score === 'number' ? `CVSS ${f.score}, ` : ''}${esc(f.severity)}</dd><dt>Class</dt><dd>${esc(families[f.family].label)}</dd><dt>Affected</dt><dd>${esc(f.affected)}</dd><dt>Fixed in</dt><dd>${esc(f.fixed)}</dd><dt>Weakness</dt><dd>${esc(f.cwe)}</dd><dt>Entry point</dt><dd>${esc(f.entry)}</dd><dt>Disclosed</dt><dd><time datetime="${f.published}">${f.published}</time></dd><dt>Credit</dt><dd>${esc(f.credit)}</dd></dl>
<h2>In plain terms</h2><p>${esc(f.summary.lead)}</p>${f.summary.points.map(([k, v]) => `<h3>${esc(k)}</h3><p>${esc(v)}</p>`).join('')}
<h2>How it works, step by step</h2>${list(f.path.map(s => `<strong>${esc(s.actor)}.</strong> ${esc(s.action)}`), 'ol')}
<h3>Root cause</h3><p>${esc(f.rootCause)}</p><h3>The trust boundary that failed</h3><p>${esc(f.boundary)}</p><h3>The fix</h3><p>${esc(f.fix)}</p>
<h2>Timeline</h2>${list(f.timeline.map(e => `<time datetime="${iso(e.date)}">${e.date}</time>: ${esc(e.event)} (${link(e.url, 'source')})`), 'ol')}
${f.press?.length ? `<h2>Coverage</h2>${list(f.press.map(p => `${esc(p.outlet)}: ${link(p.url, p.title)}${p.date ? ` (${p.date})` : ''}`))}` : ''}
<h2>Evidence and references</h2>${list(f.evidence.map(e => `${esc(e.kind)}: ${link(e.url, e.label)}`))}
<h2>The broader pattern: ${esc(f.pattern.title)}</h2><p>${esc(f.pattern.text)}</p></article>
<aside><h2>More findings by Aviral Srivastava</h2>${list(others.map(findingLine))}</aside>`;
  const jsonld = [
    {
      '@type': 'TechArticle', '@id': `${url}#article`, headline: `${f.id}: ${f.product}. ${f.title}`.slice(0, 110), name: title, description,
      url, mainEntityOfPage: url, datePublished: f.published, dateModified: today, inLanguage: 'en',
      author: {'@id': personId}, publisher: {'@id': personId}, image: `${SITE}/og/${f.id}.jpg`,
      articleSection: families[f.family].label, proficiencyLevel: 'Expert',
      keywords: [f.id, f.product, f.title, families[f.family].label, ...f.cwe.split(', '), 'vulnerability', 'security advisory'].join(', '),
      about: [{'@type': 'Thing', name: f.id, sameAs: `https://www.cve.org/CVERecord?id=${f.id}`}, {'@type': 'SoftwareApplication', name: f.product}],
      citation: f.evidence.map(e => e.url),
    },
    person,
    {'@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Aviral Srivastava', item: `${SITE}/`},
      {'@type': 'ListItem', position: 2, name: 'Findings', item: `${SITE}/#findings`},
      {'@type': 'ListItem', position: 3, name: f.id, item: url},
    ]},
  ];
  await write(`cve/${f.id}/`, render({title, description, url, image: `${SITE}/og/${f.id}.jpg`, imageAlt: `${f.id}: ${f.product}. ${f.title}`, type: 'article', jsonld, pre}));
}

/* ---- research archive ---- */
const archiveTitle = 'Exploits and Analysis: Kernel and AI Infrastructure Research | Aviral Srivastava';
const archiveDescription = 'Research archive by Aviral Srivastava: Linux kernel n-day analysis and AI infrastructure vulnerability research, with root cause, reproduction and detection notes.';
const trim = text => { const t = String(text || '').replace(/\s+/g, ' ').trim(); return t.length > 320 ? `${t.slice(0, t.lastIndexOf(' ', 320))}…` : t; };
const archivePre = `
<nav>${link('/', 'Aviral Srivastava')} › Research archive</nav>
<h1>Exploits and analysis</h1><p>${esc(archiveDescription)} Research use only.</p>
${['kernel', 'ai-infra'].map(category => `<h2>${category === 'kernel' ? 'Linux kernel' : 'AI infrastructure'}</h2>${exploits.filter(e => e.category === category).map(e => `<article><h3>${esc(e.cve || e.id)}: ${esc(e.title)}</h3><p>${e.date ? `<time datetime="${e.date}">${e.date}</time>. ` : ''}${e.severity ? `${esc(e.severity)}${e.cvss ? `, CVSS ${e.cvss}` : ''}. ` : ''}${e.bugClass ? `${esc(e.bugClass)}. ` : ''}</p><p>${esc(trim(e.description))}</p></article>`).join('')}`).join('')}`;
const archiveLd = [
  {'@type': 'CollectionPage', '@id': `${SITE}/exploits/#page`, url: `${SITE}/exploits/`, name: archiveTitle, description: archiveDescription, isPartOf: {'@id': `${SITE}/#website`}, author: {'@id': personId}, dateModified: today},
  person,
  {'@type': 'ItemList', numberOfItems: exploits.length, itemListElement: exploits.map((e, i) => ({'@type': 'ListItem', position: i + 1, name: `${e.cve || e.id}: ${e.title}`}))},
  {'@type': 'BreadcrumbList', itemListElement: [{'@type': 'ListItem', position: 1, name: 'Aviral Srivastava', item: `${SITE}/`}, {'@type': 'ListItem', position: 2, name: 'Research archive', item: `${SITE}/exploits/`}]},
];
await write('exploits/', render({title: archiveTitle, description: archiveDescription, url: `${SITE}/exploits/`, image: `${SITE}/og/home.jpg`, imageAlt: 'Research archive by Aviral Srivastava', jsonld: archiveLd, pre: archivePre}));

/* ---- sitemap, robots, feed ---- */
const pages = [
  {loc: `${SITE}/`, priority: '1.0'},
  ...findings.map(f => ({loc: caseUrl(f), priority: '0.9', image: `${SITE}/og/${f.id}.jpg`, title: `${f.id}: ${f.product}. ${f.title}`})),
  {loc: `${SITE}/exploits/`, priority: '0.8'},
];
await writeFile(new URL('../build/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(p => `  <url><loc>${esc(p.loc)}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority>${p.image ? `<image:image><image:loc>${esc(p.image)}</image:loc><image:title>${esc(p.title)}</image:title></image:image>` : ''}</url>`).join('\n')}
</urlset>
`);
await writeFile(new URL('../build/robots.txt', import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
const byDate = [...findings].sort((a, b) => b.published.localeCompare(a.published));
await writeFile(new URL('../build/feed.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Aviral Srivastava: security findings</title><link>${SITE}/</link><description>${esc(HOME_DESCRIPTION)}</description><language>en</language>
<atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${byDate.map(f => `<item><title>${esc(`${f.id}: ${f.product}. ${f.title}`)}</title><link>${caseUrl(f)}</link><guid isPermaLink="true">${caseUrl(f)}</guid><pubDate>${new Date(`${f.published}T12:00:00Z`).toUTCString()}</pubDate><description>${esc(f.line)}</description></item>`).join('\n')}
</channel></rss>
`);

// /research was a historical route. Preserve incoming links with a real redirect.
await mkdir(new URL('../build/research/', import.meta.url), {recursive: true});
await writeFile(new URL('../build/research/index.html', import.meta.url), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/#findings"><link rel="canonical" href="${SITE}/"><title>Research · Aviral Srivastava</title></head><body><a href="/#findings">Continue to the findings</a></body></html>`);

// Assets only the retired designer homepage used (development preview only). Keep them out of the deployed site.
for (const unused of ['intro', 'skyline.jpg', 'editorial/penn-state.jpg', 'editorial/amity.jpg']) {
  await rm(new URL(`../build/${unused}`, import.meta.url), {recursive: true, force: true});
}
await writeFile(new URL('../build/.nojekyll', import.meta.url), '');
console.log(`Static pages written: home, ${findings.length} case pages, archive. Sitemap, robots.txt and feed generated. Research sources unchanged.`);
