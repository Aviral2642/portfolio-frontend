import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useOutletContext} from 'react-router-dom';
import {gsap, ScrollTrigger, getLenis, magnetic, reducedMotion, usePageMotion} from './motion';
import {Arrow, Ext, Go} from './Shell';
import Surface from './Surface';
import Glyph from './Glyph';
import {preloadCase} from './caseRoute';
import {HOME_TITLE} from './data/caseMeta';
import {findingIndex as findings, themeOf} from './data/findingIndex';
import {projects} from '../data/projects';
import {speaking} from '../data/speaking';
import {research} from '../data/research';
import {blogPosts} from '../data/blog';
import {skills} from '../data/skills';
import {sources} from '../experience/content';
import './home.css';

const linkedin = 'https://linkedin.com/in/aviralsrivastava23';
const github = 'https://github.com/Aviral2642';
const scholar = 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en';
const htbProfile = 'https://profile.hackthebox.com/profile/019c48c2-965c-72ee-9f09-d047d439ab2c';
const flagship = findings[0];
const countWord = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'][findings.length] || String(findings.length);

const projectNotes = [
  ['AI / Security', 'Security assessment and adversary-emulation research for AI systems.'],
  ['Threat modeling', 'A structured map of AI security threats, from model behavior down to infrastructure.'],
  ['Security tooling', 'Security testing and adversary-emulation tooling.'],
  ['Systems research', 'Low-level systems security research across kernel and virtualization boundaries.'],
  ['Low-level code', 'Program transformation and low-level code generation.'],
  ['Security validation', 'MITRE ATT&CK-aligned security validation and attack simulation.'],
];

function Hero({ready}) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.set('.hero-line > span', {yPercent: 112});
      gsap.set('[data-hero-in]', {autoAlpha: 0, y: 18});
    }, root);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (!ready || reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.timeline({delay: .1})
        .to('.hero-line > span', {yPercent: 0, duration: 1.35, ease: 'expo.out', stagger: .11})
        .to('[data-hero-in]', {autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08}, .45);
      gsap.to('.hero-name', {yPercent: -22, ease: 'none', scrollTrigger: {trigger: root.current, start: 'top top', end: 'bottom top', scrub: true}});
      gsap.to('.hero-canvas', {yPercent: 14, scale: 1.08, ease: 'none', scrollTrigger: {trigger: root.current, start: 'top top', end: 'bottom top', scrub: true}});
    }, root);
    return () => ctx.revert();
  }, [ready]);
  return <section className="hero" id="top" ref={root} aria-label="Introduction">
    <div className="hero-canvas"><Surface/></div>
    <div className="hero-top st-pad">
      <p className="st-meta" data-hero-in><b>Security engineer and researcher</b><br/>Amazon, Ads Security · Sunnyvale, CA</p>
      <p className="st-meta hero-hint" data-hero-in>Move the pointer<br/><b>Look beneath the surface</b></p>
    </div>
    <div className="hero-bottom st-pad">
      <h1 className="hero-name st-display" aria-label="Aviral Srivastava">
        <span className="hero-line" aria-hidden="true"><span>Aviral</span></span>
        <span className="hero-line hero-line-2" aria-hidden="true"><span>Srivastava<i>.</i></span></span>
      </h1>
      <div className="hero-foot">
        <p className="hero-statement" data-hero-in>I take AI infrastructure apart at the points where it trusts something it should not.</p>
        <div className="hero-actions" data-hero-in>
          <Go to="/#findings" className="st-btn">See the findings<Arrow down/></Go>
          <Ext href="/resume.pdf">Resume</Ext>
        </div>
        <ul className="hero-facts st-meta" data-hero-in>
          <li><b>CISA KEV</b>listed finding</li>
          <li><b>Pwnie Awards 2026</b>nominee</li>
          <li><b>{findings.length} CVEs</b>assigned</li>
        </ul>
      </div>
    </div>
  </section>;
}

function Thesis() {
  return <section className="thesis st-section st-pad" aria-label="Approach">
    <p className="st-meta" data-fade>Approach</p>
    <p className="thesis-text" data-read>I study the gap between what a system promises and what it actually permits. Most of my findings sit on one line in an architecture diagram: the place where input from outside was treated as if it came from inside.</p>
    <div className="thesis-grid" data-fade>
      <div data-fade-item><span className="st-meta">Where I look</span><p>AI workflow platforms, agent tooling, model-serving runtimes and the Linux kernel underneath them.</p></div>
      <div data-fade-item><span className="st-meta">How I work</span><p>Source review and protocol analysis first. Then a working proof, a coordinated report and a public write-up.</p></div>
      <div data-fade-item><span className="st-meta">What comes out</span><p>Advisories with fixes, analysis other researchers can reproduce, and talks that explain the failure pattern.</p></div>
    </div>
  </section>;
}

function Flagship() {
  const root = useRef(null), number = useRef(null);
  const theme = themeOf(flagship);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const state = {v: 0};
      gsap.to(state, {v: 20, duration: 1.6, ease: 'power3.out', onUpdate: () => { if (number.current) number.current.textContent = Math.round(state.v); }, scrollTrigger: {trigger: number.current, start: 'top 85%', once: true}});
      gsap.fromTo('.flag-panel', {clipPath: 'inset(8% 4% 8% 4%)'}, {clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: {trigger: root.current, start: 'top 95%', end: 'top 35%', scrub: true}});
      gsap.to('.flag-trace path', {strokeDashoffset: 0, ease: 'none', stagger: .15, scrollTrigger: {trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: true}});
    }, root);
    return () => ctx.revert();
  }, []);
  return <section className="flag st-pad" ref={root} style={{'--accent': theme.accent}} aria-labelledby="flag-title">
    <Go to={`/cve/${flagship.id}/`} className="flag-panel" cursor="Open case">
      <svg className="flag-trace" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        <line x1="640" y1="0" x2="640" y2="600" className="flag-boundary"/>
        <path d="M0 420 C 240 420 300 180 520 180 L 640 180 C 820 180 860 360 1200 300" pathLength="1"/>
        <path d="M0 520 C 300 520 380 300 640 300 C 900 300 960 480 1200 460" pathLength="1"/>
      </svg>
      <div className="flag-top">
        <span className="st-meta"><b>Flagship finding</b> · {flagship.id}</span>
        <div className="flag-tags"><span className="st-tag is-hot"><i/>CISA KEV</span><span className="st-tag">CVSS 9.3</span><span className="st-tag">Pwnie nominee</span></div>
      </div>
      <div className="flag-main">
        <div className="flag-stat"><strong className="st-display"><span ref={number}>20</span></strong><span className="st-meta"><b>Hours</b><br/>from public advisory to the first exploitation Sysdig observed</span></div>
        <div className="flag-copy">
          <h2 id="flag-title" className="st-display">Langflow.<br/><em>No login needed.</em></h2>
          <p>An unauthenticated request could run code on the server behind an AI workflow platform. I found it, reported it, and wrote down how it works.</p>
          <span className="st-link"><span>Read the case</span><Arrow/></span>
        </div>
      </div>
    </Go>
  </section>;
}

function Findings() {
  const [active, setActive] = useState(null);
  const preview = useRef(null), list = useRef(null);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || reducedMotion()) return undefined;
    const x = gsap.quickTo(preview.current, 'x', {duration: .6, ease: 'power3.out'});
    const y = gsap.quickTo(preview.current, 'y', {duration: .6, ease: 'power3.out'});
    const move = e => { x(e.clientX); y(e.clientY); };
    const el = list.current;
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);
  const shown = active === null ? null : findings[active];
  return <section className="find st-section" id="findings" aria-labelledby="find-title">
    <div className="st-head st-pad">
      <div>
        <p className="st-meta" data-index="01" data-fade>Disclosures</p>
        <h2 id="find-title" className="st-display find-title" data-rise>{countWord} findings.<br/><em>One recurring failure.</em></h2>
      </div>
      <p className="st-head-side" data-fade>Different products, the same root: a boundary that was assumed and never enforced. Each one has its own case page.</p>
    </div>
    <ol className="find-list" ref={list} onPointerLeave={() => setActive(null)}>
      {findings.map((f, i) => <li key={f.id} style={{'--accent': themeOf(f).accent}} data-fade>
        <Go to={`/cve/${f.id}/`} className={`find-row st-pad${active === i ? ' is-active' : ''}`} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
          <span className="find-n st-meta">{String(i + 1).padStart(2, '0')}</span>
          <span className="find-product st-display">{f.product}</span>
          <span className="find-what"><span>{f.title}</span><small className="st-meta">{f.id}{f.flags.length ? ` · ${f.flags.join(' · ')}` : ''}</small></span>
          <span className="find-score"><b>{f.score ?? 'n/a'}</b><small className="st-meta">{f.severity}</small></span>
          <Arrow/>
        </Go>
      </li>)}
    </ol>
    <div className={`find-preview${shown ? ' is-on' : ''}`} ref={preview} style={shown ? {'--accent': themeOf(shown).accent} : undefined} aria-hidden="true">
      {shown && <div className="find-card" key={shown.id}>
        <span className="st-meta">{themeOf(shown).label}</span>
        <Glyph family={shown.family}/>
        <strong>{shown.id}</strong>
      </div>}
    </div>
  </section>;
}

function Recognition() {
  const root = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.rec-word span', {xPercent: (i) => (i ? -8 : 8)}, {xPercent: (i) => (i ? 6 : -6), ease: 'none', scrollTrigger: {trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true}});
    }, root);
    return () => ctx.revert();
  }, []);
  const rows = [
    ['2026', 'Pwnie Awards nominee', 'Best Server-Side / Cloud Bug, for the Langflow research', 'https://news.risky.biz/risky-bulletin-pwnie-awards-2026-winners/'],
    ['2026', 'CISA Known Exploited Vulnerabilities', 'CVE-2026-33017 added to the federal catalog', sources.kev],
    ['2026', 'NIST OLIR contribution', 'OWASP LLM Top 10 v2.0 mapped to NIST CSF 2.0, in the NIST catalog', 'https://csrc.nist.gov/projects/olir/informative-reference-catalog/details?referenceId=198'],
    ['', 'MITRE CWE / CAPEC submissions', 'In review. Not presented as accepted standards.', github],
    ['2025', 'RSA Security Scholar', 'RSA Conference', '/resume.pdf'],
    ['', 'OSCP · CCSK v5', 'Offensive Security, Cloud Security Alliance', '/resume.pdf'],
    ['', 'Cybersecurity Innovator of the Year', 'BSides Bangalore', '/resume.pdf'],
  ];
  return <section className="rec st-section" id="recognition" ref={root} aria-labelledby="rec-title">
    <div className="rec-word st-display" aria-hidden="true"><span>Pwnie Awards</span><span>2026 Nominee</span></div>
    <div className="rec-body st-pad">
      <div>
        <p className="st-meta" data-index="03" data-fade>Recognition</p>
        <h2 id="rec-title" className="st-lead" data-rise>Nominated for a Pwnie Award in 2026, in the Best Server-Side / Cloud Bug category, for the Langflow finding.</h2>
        <p className="rec-note st-meta" data-fade>A nomination, documented in my resume and public profile. Not a claim of winning.</p>
      </div>
      <ul className="rec-list">
        {rows.map(([year, name, detail, href]) => <li key={name} data-fade>
          <a href={href} target="_blank" rel="noopener noreferrer">
            <span className="st-meta">{year || '·'}</span><strong>{name}</strong><span>{detail}</span><Arrow/>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}

function Archive() {
  const root = useRef(null);
  const [count, setCount] = useState(null);
  useEffect(() => { import('../data/exploits').then(m => setCount(m.exploits.length)).catch(() => {}); }, []);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.arc-media', {clipPath: 'inset(14% 10% 14% 10%)'}, {clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: {trigger: root.current, start: 'top 90%', end: 'top 25%', scrub: true}});
      gsap.fromTo('.arc-media img', {scale: 1.25, yPercent: -6}, {scale: 1.05, yPercent: 6, ease: 'none', scrollTrigger: {trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true}});
    }, root);
    return () => ctx.revert();
  }, []);
  return <section className="arc" ref={root} aria-labelledby="arc-title">
    <Go to="/exploits/" className="arc-link" cursor="Enter">
      <div className="arc-media"><img src="/editorial/exploits-silicon.webp" alt="" width="1536" height="1024" loading="lazy"/></div>
      <div className="arc-content st-pad">
        <p className="st-meta" data-index="02"><b>Research archive</b>{count ? ` · ${count} analyses` : ''}</p>
        <h2 id="arc-title" className="st-display" data-rise>Exploits<br/><em>and analysis.</em></h2>
        <div className="arc-foot"><p>Kernel n-day work and AI infrastructure research, written so someone else can reproduce it: root cause, reproduction, detection.</p><span className="st-link"><span>Open the archive</span><Arrow/></span></div>
      </div>
    </Go>
  </section>;
}

function Work() {
  return <section className="work st-section st-pad" id="work" aria-labelledby="work-title">
    <div className="st-head">
      <div><p className="st-meta" data-index="04" data-fade>Open source</p><h2 id="work-title" className="st-display" data-rise>Built to test<br/><em>assumptions.</em></h2></div>
      <p className="st-head-side" data-fade>Tools and references I maintain in public.</p>
    </div>
    <div className="work-grid">
      {projects.map((p, i) => <a key={p.id} className="work-card" href={p.githubUrl} target="_blank" rel="noopener noreferrer" data-fade data-cursor="GitHub">
        <span className="st-meta">{String(i + 1).padStart(2, '0')} · {projectNotes[i]?.[0]}</span>
        <h3 className="st-display">{p.title}</h3>
        <p>{projectNotes[i]?.[1]}</p>
        <Arrow/>
      </a>)}
    </div>
  </section>;
}

function Speaking() {
  const track = useRef(null);
  const names = [...new Set(speaking.map(s => s.conference.replace(/ 20\d\d$/, '')))];
  useEffect(() => {
    if (reducedMotion()) return undefined;
    // The marquee leans with scroll speed.
    const skew = gsap.quickTo(track.current, 'skewX', {duration: .5, ease: 'power3.out'});
    const lenis = getLenis();
    const on = ({velocity}) => skew(gsap.utils.clamp(-9, 9, velocity * -.22));
    lenis?.on('scroll', on);
    return () => lenis?.off('scroll', on);
  }, []);
  return <section className="talk st-section" id="speaking" aria-labelledby="talk-title">
    <div className="talk-marquee" aria-hidden="true"><div className="talk-track st-display" ref={track}>
      {[0, 1].map(k => <div key={k}>{names.map(n => <span key={n}>{n}<i/></span>)}</div>)}
    </div></div>
    <div className="talk-body st-pad">
      <div className="talk-intro">
        <p className="st-meta" data-index="07" data-fade>Speaking</p>
        <h2 id="talk-title" className="st-lead" data-rise>{speaking.length} conference talks since 2024. The research goes into the room once the fix is out.</h2>
        <Ext href={sources.speaker}>Speaker profile</Ext>
      </div>
      <ul className="talk-list">
        {speaking.map(s => <li key={s.id} data-fade><span className="st-meta">{s.year}</span><span className="talk-conf">{s.conference}</span><span className="talk-title">{s.title}</span></li>)}
      </ul>
    </div>
  </section>;
}

function Experience() {
  const root = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.exp-photo', {clipPath: 'inset(10% 6% 10% 6%)'}, {clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: {trigger: '.exp-photo', start: 'top 92%', end: 'top 30%', scrub: true}});
      gsap.fromTo('.exp-photo img', {scale: 1.22, yPercent: -7}, {scale: 1.04, yPercent: 7, ease: 'none', scrollTrigger: {trigger: '.exp-photo', start: 'top bottom', end: 'bottom top', scrub: true}});
      gsap.fromTo('.exp-word', {xPercent: -8}, {xPercent: 5, ease: 'none', scrollTrigger: {trigger: '.exp-photo', start: 'top bottom', end: 'bottom top', scrub: true}});
    }, root);
    return () => ctx.revert();
  }, []);
  const roles = [
    ['2025 to now', 'Amazon', 'Security Engineer, Ads Security', 'Sunnyvale, California'],
    ['2023 to 2024', 'Penn State University', 'Teaching Assistant, red teaming and CTFs', 'State College, Pennsylvania'],
    ['2022 to 2023', 'Six security internships', 'Malware reverse engineering, secure DevOps, governance and risk', 'Several firms'],
  ];
  return <section className="exp st-section" id="experience" ref={root} aria-labelledby="exp-title">
    <div className="st-head st-pad">
      <div><p className="st-meta" data-index="05" data-fade>Work experience</p><h2 id="exp-title" className="st-display" data-rise>Where<br/><em>I work.</em></h2></div>
      <p className="st-head-side" data-fade>Security engineering every day, research on my own time.</p>
    </div>
    <div className="exp-feature st-pad">
      <figure className="exp-photo">
        <img src="/editorial/amazon-sunnyvale.webp" width="800" height="534" alt="Amazon’s Sunnyvale campus" loading="lazy"/>
        <span className="exp-word st-display" aria-hidden="true">Amazon</span>
        <figcaption><strong>Security Engineer</strong><span>Ads Security · Sunnyvale, California · August 2025 to present</span></figcaption>
      </figure>
    </div>
    <ul className="exp-list st-pad">
      {roles.map(([when, org, role, where]) => <li key={org} data-fade><span className="st-meta">{when}</span><strong className="st-display">{org}</strong><span className="exp-role">{role}<small>{where}</small></span></li>)}
    </ul>
    <div className="st-pad exp-more" data-fade><Ext href="/resume.pdf">Full experience in the resume</Ext></div>
  </section>;
}

function Education() {
  const root = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.edu-card').forEach(card => {
        gsap.fromTo(card.querySelector('.edu-img'), {clipPath: 'inset(0% 0% 100% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: {trigger: card, start: 'top 82%', once: true}});
        gsap.fromTo(card.querySelector('img'), {scale: 1.25, yPercent: -6}, {scale: 1.06, yPercent: 6, ease: 'none', scrollTrigger: {trigger: card, start: 'top bottom', end: 'bottom top', scrub: true}});
      });
    }, root);
    return () => ctx.revert();
  }, []);
  const schools = [
    {year: '2025', name: 'Penn State', full: 'The Pennsylvania State University', degree: 'Master of Science, Cybersecurity Analytics and Operations', note: 'Graduated May 2025. Teaching assistant for red teaming and CTFs.', img: '/editorial/penn-state.webp', alt: 'Old Main at Penn State at sunset'},
    {year: '2023', name: 'Amity', full: 'Amity University', degree: 'Bachelor of Technology, Computer Science', note: 'Where the computer science foundation was built.', img: '/editorial/amity.webp', alt: 'Amity University campus at sunset'},
  ];
  return <section className="edu st-section st-pad" id="education" ref={root} aria-labelledby="edu-title">
    <div className="st-head">
      <div><p className="st-meta" data-index="06" data-fade>Education</p><h2 id="edu-title" className="st-display" data-rise>The<br/><em>foundations.</em></h2></div>
      <p className="st-head-side" data-fade>From computer science to security research.</p>
    </div>
    <div className="edu-grid">
      {schools.map(s => <article className="edu-card" key={s.name}>
        <div className="edu-img"><img src={s.img} alt={s.alt} width="1672" height="941" loading="lazy"/><span className="edu-year st-display" aria-hidden="true">{s.year}</span></div>
        <div className="edu-copy" data-fade>
          <span className="st-meta">{s.full}</span>
          <h3 className="st-display">{s.name}</h3>
          <p className="edu-degree">{s.degree}</p>
          <p>{s.note}</p>
        </div>
      </article>)}
    </div>
  </section>;
}

function Arena() {
  return <section className="arena st-section st-pad" id="hackthebox" aria-labelledby="arena-title">
    <div className="st-head">
      <div><p className="st-meta" data-index="08" data-fade>Hack The Box</p><h2 id="arena-title" className="st-display" data-rise>Proven in<br/><em>the arena.</em></h2></div>
      <p className="st-head-side" data-fade>AviralxRoot. Hands-on practice, kept current.</p>
    </div>
    <a className="arena-card" href={htbProfile} target="_blank" rel="noopener noreferrer" data-fade data-cursor="Profile">
      <img src="https://raw.githubusercontent.com/Aviral2642/Aviral2642/main/assets/htb.svg" alt="AviralxRoot’s Hack The Box statistics: rank, machines, challenges and category progress. The card shows when it was last updated." width="1200" loading="lazy"/>
    </a>
    <div className="arena-foot" data-fade><p className="st-meta">Refreshed automatically every six hours · the last update is shown on the card</p><Ext href={htbProfile}>View my HTB profile</Ext></div>
  </section>;
}

function About() {
  return <section className="about st-section st-pad" id="about" aria-labelledby="about-title">
    <div className="about-top">
      <p className="st-meta" data-index="09" data-fade>About</p>
      <h2 id="about-title" className="st-display" data-rise>Curious<br/><em>by default.</em></h2>
    </div>
    <div className="about-grid">
      <p className="st-lead about-lead" data-read>I’m Aviral. By day I work in Ads Security at Amazon. On my own time I read source code until a system stops behaving the way its documentation says it should.</p>
      <div className="about-copy">
        <p className="st-copy" data-fade>My background is exploit development and low-level systems, and I bring that habit to AI infrastructure: model servers, agent frameworks and the protocols that connect them. I publish what I find and I teach it.</p>
        <div className="about-links" data-fade>
          <Ext href="/resume.pdf">Full background</Ext><Ext href={linkedin}>LinkedIn</Ext><Ext href={github}>GitHub</Ext>
        </div>
      </div>
    </div>
    <div className="skill-head" data-fade><span className="st-meta"><b>Expertise and practice</b></span><span className="st-meta">{String(skills.length).padStart(2, '0')} areas</span></div>
    <ul className="skill-grid">
      {skills.map((k, i) => <li key={k.id} data-fade><span className="st-meta">{String(i + 1).padStart(2, '0')}</span><strong>{k.title}</strong><p>{k.description}</p></li>)}
    </ul>
  </section>;
}

function Writing() {
  const channels = [
    ['Medium', 'First-person accounts of each disclosure', 'https://medium.com/@aviral23'],
    ['HackerNoon', 'Security writing for a wider audience', 'https://hackernoon.com/u/aviralxroot'],
    ['Scholar', `${research.length} papers on AI security`, scholar],
  ];
  return <section className="write st-section st-pad" id="writing" aria-labelledby="write-title">
    <div className="st-head">
      <div><p className="st-meta" data-index="10" data-fade>Writing</p><h2 id="write-title" className="st-display" data-rise>Thinking<br/><em>in public.</em></h2></div>
      <p className="st-head-side" data-fade>{blogPosts.length} articles and {research.length} papers so far.</p>
    </div>
    <ul className="write-channels">
      {channels.map(([name, note, href]) => <li key={name} data-fade><a href={href} target="_blank" rel="noopener noreferrer" data-cursor="Read"><span className="st-display">{name}</span><span>{note}</span><Arrow/></a></li>)}
    </ul>
    <div className="write-papers">
      {research.slice(0, 2).map(r => <a key={r.id} href={r.pdfUrl} target="_blank" rel="noopener noreferrer" data-fade data-cursor="Scholar">
        <span className="st-meta">{r.venue}</span><h3>{r.title}</h3><p>{r.description}</p><Arrow/>
      </a>)}
    </div>
    <div className="write-lists">
      <details data-fade><summary>All articles · {blogPosts.length}<span aria-hidden="true">+</span></summary><ul>{blogPosts.map(b => <li key={b.id}><a href={b.url} target="_blank" rel="noopener noreferrer">{b.title}<small> · {b.publication}</small></a></li>)}</ul></details>
      <details data-fade><summary>All papers · {research.length}<span aria-hidden="true">+</span></summary><ul>{research.map(r => <li key={r.id}><a href={r.pdfUrl} target="_blank" rel="noopener noreferrer">{r.title}<small> · {r.venue}</small></a></li>)}</ul></details>
      <details data-fade><summary>Independent disclosures · 3<span aria-hidden="true">+</span></summary><ul>
        <li><a href="https://medium.com/@aviral23/i-found-5-security-vulnerabilities-in-xgboost-heres-what-happened-189327f97fbf" target="_blank" rel="noopener noreferrer">XGBoost<small> · research and disclosure account</small></a></li>
        <li><a href="https://github.com/google/sentencepiece/pull/1207" target="_blank" rel="noopener noreferrer">SentencePiece<small> · upstream report and fix discussion</small></a></li>
        <li><a href={github} target="_blank" rel="noopener noreferrer">vLLM LoRA<small> · independent research, no CVE assignment claimed</small></a></li>
      </ul></details>
    </div>
  </section>;
}

export function Contact() {
  const cta = useRef(null);
  useEffect(() => magnetic(cta.current, .12), []);
  return <section className="contact" id="contact" aria-labelledby="contact-title">
    <div className="contact-inner st-pad">
      <p className="st-meta">Research collaboration, a hard problem, or a talk invitation</p>
      <h2 id="contact-title"><a ref={cta} className="contact-cta st-display" href={linkedin} target="_blank" rel="noopener noreferrer" data-cursor="LinkedIn" aria-label="Let’s talk. Connect with me on LinkedIn"><span>Let’s</span><span>talk<Arrow/></span></a></h2>
      <div className="contact-links"><Ext href={linkedin}>LinkedIn</Ext><Ext href={github}>GitHub</Ext><Ext href="/resume.pdf">Resume</Ext></div>
    </div>
    <footer className="st-foot"><span>Aviral Srivastava © {new Date().getFullYear()}</span><span>Independent work. Personal views.</span><a href="/editorial/credits.txt">Credits</a></footer>
  </section>;
}

export default function Home() {
  const root = useRef(null);
  const {ready} = useOutletContext();
  usePageMotion(root, [ready], ready);
  useEffect(() => {
    document.title = HOME_TITLE;
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 2500));
    idle(() => preloadCase().catch(() => {}));
    const refresh = () => ScrollTrigger.refresh();
    root.current.querySelectorAll('details').forEach(d => d.addEventListener('toggle', refresh));
  }, []);
  return <main id="main" ref={root} className="home">
    <Hero ready={ready}/>
    <Thesis/>
    <Flagship/>
    <Findings/>
    <Archive/>
    <Recognition/>
    <Work/>
    <Experience/>
    <Education/>
    <Speaking/>
    <Arena/>
    <About/>
    <Writing/>
    <Contact/>
  </main>;
}
