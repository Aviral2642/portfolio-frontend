import {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import {useOutletContext, useParams} from 'react-router-dom';
import {gsap, ScrollTrigger, reducedMotion, scrollTo, usePageMotion} from './motion';
import {Arrow, Ext, Go} from './Shell';
import Surface from './Surface';
import Glyph from './Glyph';
import Demo from './demo/Demo';
import {findings, findingById, themeOf} from './data/findings';
import {caseDescription, caseTitle, caseUrl} from './data/caseMeta';
import './cve.css';

const fmt = date => {
  if (!date) return '';
  const [y, m, d] = date.split('-').map(Number);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];
  return d ? `${month} ${d}, ${y}` : m ? `${month} ${y}` : String(y);
};
const host = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };

function Dial({score, severity}) {
  const ring = useRef(null), num = useRef(null);
  const value = typeof score === 'number' ? score : null;
  useEffect(() => {
    if (value === null) return undefined;
    const length = 2 * Math.PI * 54;
    if (reducedMotion()) { ring.current.style.strokeDashoffset = length * (1 - value / 10); return undefined; }
    const state = {v: 0};
    const tween = gsap.to(state, {v: value, duration: 1.8, delay: .5, ease: 'power3.out', onUpdate: () => {
      if (!ring.current) return;
      ring.current.style.strokeDashoffset = length * (1 - state.v / 10);
      num.current.textContent = state.v.toFixed(1);
    }});
    return () => tween.kill();
  }, [value]);
  return <div className="cv-dial" role="img" aria-label={value === null ? `Severity ${severity}` : `CVSS ${value} out of 10, ${severity}`}>
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="54" className="cv-dial-track"/>
      {value !== null && <circle cx="60" cy="60" r="54" className="cv-dial-ring" ref={ring} strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54}/>}
    </svg>
    <div className="cv-dial-text"><strong ref={num}>{value === null ? severity : value.toFixed(1)}</strong><span className="st-meta">{value === null ? 'Severity' : `CVSS · ${severity}`}</span></div>
  </div>;
}

// The written version of the demonstration: always in the document for
// assistive technology, and the visible version on phones and with reduced motion.
function Steps({steps}) {
  const crossing = Math.max(1, steps.findIndex(s => s.side === 'inside'));
  return <ol className="cv-steps st-pad">
    {steps.map((s, i) => <li key={i} className={i === crossing ? 'is-crossing' : ''}>
      <span className="st-meta">{String(i + 1).padStart(2, '0')} · {s.side === 'inside' ? 'Trusted side' : s.side === 'exit' ? 'Leaves the boundary' : 'Untrusted side'}</span><strong>{s.actor}</strong><p>{s.action}</p>
    </li>)}
  </ol>;
}

// Side rail: the case number, and where you are in the file.
function Rail({id, sections}) {
  const root = useRef(null);
  useEffect(() => {
    const triggers = sections.map(([key], i) => ScrollTrigger.create({
      trigger: `#cv-${key}`, start: 'top 55%', end: 'bottom 55%',
      onToggle: self => { if (self.isActive) root.current?.style.setProperty('--at', i); root.current?.querySelectorAll('a')[i]?.classList.toggle('is-on', self.isActive); },
    }));
    return () => triggers.forEach(t => t.kill());
  }, [sections]);
  return <aside className="cv-rail" ref={root} aria-label="Sections of this case">
    <span className="cv-rail-id">{id}</span>
    <nav>{sections.map(([key, name]) => <a key={key} href={`#cv-${key}`} onClick={e => { e.preventDefault(); scrollTo(`#cv-${key}`); }}><i/><span>{name}</span></a>)}</nav>
  </aside>;
}

function Timeline({events}) {
  const root = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.cv-time-fill', {scaleY: 0}, {scaleY: 1, ease: 'none', scrollTrigger: {trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: true}});
      gsap.utils.toArray('.cv-time li').forEach(li => ScrollTrigger.create({trigger: li, start: 'top 68%', onEnter: () => li.classList.add('is-on'), onLeaveBack: () => li.classList.remove('is-on')}));
    }, root);
    return () => ctx.revert();
  }, [events]);
  return <ol className="cv-time" ref={root}>
    <span className="cv-time-rail" aria-hidden="true"><i className="cv-time-fill"/></span>
    {events.map((e, i) => <li key={i} className={reducedMotion() ? 'is-on' : ''}>
      <time className="st-meta" dateTime={e.date}>{fmt(e.date)}</time>
      <i aria-hidden="true"/>
      <div><p>{e.event}</p>{e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" className="st-meta">{host(e.url)} ↗</a>}</div>
    </li>)}
  </ol>;
}

function View({finding, index}) {
  const root = useRef(null);
  const {ready} = useOutletContext();
  const theme = themeOf(finding);
  const f = finding;
  usePageMotion(root, [ready], ready);

  useLayoutEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => gsap.set('.cv-hero-line > span', {yPercent: 112}), root);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (!ready || reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('.cv-hero-line > span', {yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .1, delay: .25});
      gsap.to('.cv-hero-bg', {yPercent: 16, ease: 'none', scrollTrigger: {trigger: '.cv-hero', start: 'top top', end: 'bottom top', scrub: true}});
    }, root);
    return () => ctx.revert();
  }, [ready]);
  // The shell (cursor, curtain, navigation) takes the finding's colour too.
  useLayoutEffect(() => {
    const shell = root.current.closest('.st');
    shell.style.setProperty('--accent', theme.accent);
    return () => shell.style.removeProperty('--accent');
  }, [theme.accent]);
  useEffect(() => {
    const title = caseTitle(f), description = caseDescription(f), url = caseUrl(f);
    document.title = title;
    const set = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    set('meta[name="description"]', description);
    set('meta[property="og:title"]', title); set('meta[property="og:description"]', description); set('meta[property="og:url"]', url);
    set('meta[name="twitter:title"]', title); set('meta[name="twitter:description"]', description);
  }, [f]);

  const sections = useMemo(() => [
    ['top', 'Case'], f.summary && ['why', 'Summary'], f.path?.length > 1 && ['tech', 'Demonstration'],
    f.timeline?.length && ['timeline', 'Timeline'], f.press?.length && ['press', 'Coverage'],
    f.evidence?.length && ['evidence', 'Evidence'], f.pattern && ['pattern', 'Pattern'],
  ].filter(Boolean), [f]);
  const facts = [
    ['Affected', f.affected], ['Fixed in', f.fixed], ['Weakness', f.cwe], ['Entry point', f.entry], ['Credit', f.credit],
  ].filter(([, v]) => v);

  return <main id="main" className="cv" ref={root} style={{'--accent': theme.accent}}>
    <Rail id={f.id} sections={sections}/>
    <section className="cv-hero" id="cv-top" data-above aria-labelledby="cv-title">
      <div className="cv-hero-bg"><Surface accent={theme.accent} seed={theme.seed} mode={theme.mode}/></div>
      <div className="cv-hero-top st-pad">
        <Go to="/#findings" className="cv-back st-meta"><Arrow/>All findings</Go>
        <p className="st-meta cv-file">Case file <b>{String(index + 1).padStart(2, '0')}</b> / {String(findings.length).padStart(2, '0')}<span>{theme.label}</span><span>Disclosed {fmt(f.published)}</span></p>
      </div>
      <div className="cv-hero-main st-pad">
        <div className="cv-hero-left">
          <div className="cv-hero-id" data-fade=".5"><Glyph family={f.family}/><span>{f.id}</span></div>
          <h1 id="cv-title" className="st-display cv-hero-title" style={{'--fit': Math.min(1, Math.max(.5, 7.2 / f.product.length))}} aria-label={`${f.product}: ${f.title}`}>
            <span className="cv-hero-line" aria-hidden="true"><span>{f.product}</span></span>
          </h1>
          <div data-fade=".6">
            <p className="cv-hero-sub">{f.title}</p>
            <p className="cv-hero-lineText">{f.line}</p>
          </div>
        </div>
        <div className="cv-sheet" data-fade=".7">
          <div className="cv-sheet-top"><Dial score={f.score} severity={f.severity}/><div><span className="st-meta">Severity</span><strong>{f.severity}</strong><span className="st-meta">{f.vector || 'CVSS, as assigned by the CNA'}</span></div></div>
          <dl>{facts.map(([k, v]) => <div key={k}><dt className="st-meta">{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </div>
      {f.badges?.length > 0 && <ul className="cv-badges st-pad" data-fade=".85">
        {f.badges.map(b => <li key={b.label} data-fade-item>{b.url
          ? <a className={`st-tag${b.hot ? ' is-hot' : ''}`} href={b.url} target="_blank" rel="noopener noreferrer"><i/>{b.label}</a>
          : <span className={`st-tag${b.hot ? ' is-hot' : ''}`}><i/>{b.label}</span>}</li>)}
      </ul>}
    </section>

    {f.summary && <section className="cv-why st-section st-pad" id="cv-why" aria-labelledby="cv-why-title">
      <p className="st-meta" data-index="01" data-fade>In plain terms</p>
      <div className="cv-why-body">
        <h2 id="cv-why-title" className="cv-why-lead" data-read>{f.summary.lead}</h2>
        <div className="cv-why-grid" data-fade>
          {f.summary.points.map(([label, text]) => <div key={label} data-fade-item><span className="st-meta"><b>{label}</b></span><p>{text}</p></div>)}
        </div>
      </div>
    </section>}

    {f.path?.length > 1 && <section className="cv-tech" id="cv-tech" aria-labelledby="cv-tech-title">
      <div className="st-head st-pad">
        <div><p className="st-meta" data-index="02" data-fade>Technical breakdown</p><h2 id="cv-tech-title" className="st-display" data-rise>Watch it<br/><em>happen.</em></h2></div>
        <p className="st-head-side" data-fade>A simplified reconstruction of the mechanism the advisory describes. It plays on its own; pick a step to jump to it.</p>
      </div>
      <Demo finding={f} accent={theme.accent}/>
      <Steps steps={f.path}/>
      <div className="cv-cards st-pad">
        {[['Root cause', f.rootCause, 'cause'], ['Boundary that failed', f.boundary, 'boundary'], ['The fix', f.fix, 'fix']].filter(([, text]) => text).map(([label, text, kind]) => <article key={label} className={`cv-card cv-card-${kind}`} data-fade>
          <svg viewBox="0 0 200 60" aria-hidden="true">
            <line x1="100" y1="4" x2="100" y2="56" className={kind === 'fix' ? 'cv-mini-wall' : 'cv-mini-gap'}/>
            <path d={kind === 'fix' ? 'M10 30h78' : 'M10 30h180'} className="cv-mini-flow"/>
            {kind === 'fix' ? <path d="M82 22l8 8-8 8" className="cv-mini-flow"/> : <path d="M182 22l8 8-8 8" className="cv-mini-flow"/>}
          </svg>
          <span className="st-meta"><b>{label}</b></span><p>{text}</p>
        </article>)}
      </div>
    </section>}

    {f.timeline?.length > 0 && <section className="cv-timeline st-section st-pad" id="cv-timeline" aria-labelledby="cv-time-title">
      <div className="st-head">
        <div><p className="st-meta" data-index="03" data-fade>Timeline</p><h2 id="cv-time-title" className="st-display" data-rise>From report<br/><em>to record.</em></h2></div>
        <p className="st-head-side" data-fade>Each entry links to the public source it comes from.</p>
      </div>
      <Timeline events={f.timeline}/>
    </section>}

    {f.press?.length > 0 && <section className="cv-press st-section st-pad" id="cv-press" aria-labelledby="cv-press-title">
      <div className="st-head">
        <div><p className="st-meta" data-index="04" data-fade>Coverage</p><h2 id="cv-press-title" className="st-display" data-rise>Who wrote<br/><em>about it.</em></h2></div>
        <p className="st-head-side" data-fade>{f.press.length === 1 ? 'One outside research team published its own analysis of this vulnerability.' : `${f.press.length} publications and research teams wrote about this vulnerability.`}</p>
      </div>
      <ul className="cv-press-grid">
        {f.press.map(p => <li key={p.url} data-fade><a href={p.url} target="_blank" rel="noopener noreferrer" data-cursor="Read">
          <span className="st-meta">{fmt(p.date) || host(p.url)}</span>
          <strong className="st-display">{p.outlet}</strong>
          <p>{p.title}</p><Arrow/>
        </a></li>)}
      </ul>
    </section>}

    {f.evidence?.length > 0 && <section className="cv-evidence st-section st-pad" id="cv-evidence" aria-labelledby="cv-ev-title">
      <div className="st-head">
        <div><p className="st-meta" data-index="05" data-fade>Evidence</p><h2 id="cv-ev-title" className="st-display" data-rise>The public<br/><em>record.</em></h2></div>
      </div>
      <ul className="cv-ev-list">
        {f.evidence.map(e => <li key={e.url} data-fade><a href={e.url} target="_blank" rel="noopener noreferrer">
          <span className="st-meta">{e.kind}</span><strong>{e.label}</strong><span className="cv-ev-host">{host(e.url)}</span><Arrow/>
        </a></li>)}
      </ul>
    </section>}

    {f.pattern && <section className="cv-pattern" id="cv-pattern" aria-labelledby="cv-pattern-title">
      <div className="st-pad">
        <p className="st-meta">The broader pattern</p>
        <h2 id="cv-pattern-title" className="st-display" data-rise>{f.pattern.title}</h2>
        <p className="cv-pattern-text" data-fade>{f.pattern.text}</p>
        {f.article && <Ext href={f.article}>Read my full write-up</Ext>}
      </div>
    </section>}

    <footer className="st-foot cv-foot"><span>Aviral Srivastava © {new Date().getFullYear()}</span><Go to="/#findings">All findings</Go><Go to="/#contact">Contact</Go></footer>
  </main>;
}

export default function CvePage() {
  const {id} = useParams();
  const finding = findingById(id);
  if (!finding) return <main id="main" className="cv cv-missing st-pad"><p className="st-meta">No such case</p><h1 className="st-display">Not in the record.</h1><Go to="/#findings" className="st-link"><span>All findings</span><Arrow/></Go></main>;
  return <View key={finding.id} finding={finding} index={findings.indexOf(finding)}/>;
}
