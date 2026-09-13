import React, {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {projects} from '../data/projects';
import {research} from '../data/research';
import {speaking} from '../data/speaking';
import {blogPosts} from '../data/blog';
import {skills} from '../data/skills';
import {sources, langflowArticle} from '../experience/content';
import FluidInk from './FluidInk';
import VideoOpening from './VideoOpening';
import ExploitsPreview from './ExploitsPreview';
import './designer.css';
import {DisclosureRail, NominationReveal, SpeakingDeck, CareerExperience, EducationSpread, PublicChannels} from './DepthSections';

gsap.registerPlugin(ScrollTrigger);
const profile='https://github.com/Aviral2642';
const linkedin='https://linkedin.com/in/aviralsrivastava23';
const Arrow=({diagonal=false})=><svg className="d-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal?'M5 19 19 5M5 5h14v14':'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.6"/></svg>;
const Link=({children,href,className=''})=><a className={`d-link ${className}`} href={href} {...(href.startsWith('http')?{target:'_blank',rel:'noreferrer'}:{})}>{children}<Arrow diagonal/></a>;
const Title=({children,className=''})=><h2 className={`d-title ${className}`}><span className="d-title-inner">{children}</span></h2>;

const projectCopy=[
 ['Adversary','Pilot','AI-assisted security assessment and adversary-emulation research.','AI / SECURITY'],
 ['Attack','Atlas','A structured map of AI security threats, from model behavior to infrastructure.','THREAT / MODELING'],
 ['ZeroDay','Forge','Security testing and adversary-emulation tooling.','SECURITY / TOOLING'],
 ['Kernel','Ghost','Low-level systems security research across kernel and virtualization boundaries.','SYSTEMS / RESEARCH'],
 ['Poly','morphic','Exploring program transformation and low-level code generation.','LOW-LEVEL / CODE'],
 ['Adversary','Emulation','MITRE ATT&CK-aligned security validation and attack simulation.','SECURITY / VALIDATION']
];
function Projects(){const [active,setActive]=useState(0);return <section id="projects" className="d-projects d-pad"><div className="d-section-heading"><Title>SELECTED<br/><em>WORK.</em></Title><p>Built to question assumptions.<br/>Shared so others can go further.</p></div><div className="d-project-layout"><div className="d-project-list">{projects.map((p,i)=><a key={p.id} href={p.githubUrl} target="_blank" rel="noreferrer" className={`d-project-row ${active===i?'is-active':''}`} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)}><span><strong>{p.title}</strong><small>{projectCopy[i][3]}</small></span><Arrow diagonal/></a>)}<Link href="/exploits" className="d-archive-link">Explore the research archive</Link></div><div className="d-project-preview" aria-live="polite" aria-atomic="true"><div className={`d-project-cover cover-${active}`} key={active}><span className="d-cover-category">{projectCopy[active][3]}</span><div className="d-cover-lines" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><div className="d-cover-name">{projectCopy[active][0]}<br/><span>{projectCopy[active][1]}</span></div><span className="d-cover-footer">AVIRAL SRIVASTAVA / OPEN SOURCE</span></div><p>{projectCopy[active][2]}</p><Link href={projects[active].githubUrl}>View {projects[active].title}</Link></div></div></section>}

function Archive({title,children,id}){return <details className="d-archive" id={id} onToggle={()=>ScrollTrigger.refresh()}><summary>{title}<span aria-hidden="true">+</span></summary><div className="d-archive-body">{children}</div></details>}
export function Contact(){
 return <section id="contact" className="d-contact d-pad" aria-labelledby="contact-heading">
  <div className="d-contact-top"><p>Interesting problem?<br/>Research collaboration? Let’s connect.</p><a href="#top">Back to top <Arrow/></a></div>
  <h2 id="contact-heading"><a className="d-contact-cta" href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="Let’s talk. Connect with me on LinkedIn"><span>LET’S</span><span>TALK<svg viewBox="0 0 150 150" aria-hidden="true"><path d="M15 135 135 15M15 15h120v120" fill="none" stroke="currentColor" strokeWidth="12"/></svg></span></a></h2>
  <div className="d-contact-bottom"><Link href={linkedin} className="d-connect-link">Connect with me on LinkedIn</Link><div><Link href={profile}>GitHub</Link><Link href="/resume.pdf">Resume</Link></div></div>
  <div className="d-colophon"><span>Aviral Srivastava © {new Date().getFullYear()}</span><span>Independent work. Personal views.</span><a href="/editorial/credits.txt">Design & asset credits</a></div>
 </section>
}

export default function DesignerPortfolio(){const root=useRef();const [effects,setEffects]=useState(true);
 useEffect(()=>{const mm=gsap.matchMedia();const ctx=gsap.context(()=>{
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
 gsap.utils.toArray('.d-title-inner').forEach(el=>gsap.from(el,{yPercent:105,duration:.85,ease:'expo.out',scrollTrigger:{trigger:el.parentElement,start:'top 93%',toggleActions:'play none none reverse'}}));
 gsap.fromTo('.d-writing-features>a:first-child .d-paper-art',{rotation:-5,clipPath:'inset(12% 0% 0% 0%)'},{rotation:0,clipPath:'inset(0%)',ease:'none',scrollTrigger:{trigger:'.d-writing-features',start:'top 90%',end:'center 60%',scrub:true}});
 gsap.fromTo('.d-writing-features>a:nth-child(2) .d-paper-art',{y:90,rotation:5},{y:0,rotation:0,ease:'none',scrollTrigger:{trigger:'.d-writing-features',start:'top 90%',end:'center 50%',scrub:true}});
 gsap.fromTo('.d-cover-lines',{rotation:-55},{rotation:-15,ease:'none',scrollTrigger:{trigger:'.d-projects',start:'top bottom',end:'bottom top',scrub:true}});
 gsap.from('.d-contact-cta span',{yPercent:30,rotation:-3,stagger:.1,ease:'none',scrollTrigger:{trigger:'.d-contact',start:'top bottom',end:'top 10%',scrub:true}});
 });
 },root);let alive=true;document.fonts.ready.then(()=>{if(alive){ScrollTrigger.sort();ScrollTrigger.refresh();if(window.location.hash)document.getElementById(window.location.hash.slice(1))?.scrollIntoView();}});return()=>{alive=false;mm.revert();ctx.revert();};},[]);
 return <div className="designer" ref={root}><a className="d-skip" href="#research">Skip to research</a><FluidInk enabled={effects}/><header className="d-nav"><a className="d-brand" href="#top" aria-label="Aviral Srivastava, home">Aviral.</a><nav aria-label="Main navigation"><a href="#research">Research</a><a href="#exploits">Exploits</a><a href="#recognition">Recognition</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div className="d-nav-actions"><button className="d-effects" onClick={()=>setEffects(x=>!x)} aria-pressed={effects} aria-label="Toggle fluid pointer effect">Ink {effects?'on':'off'}</button><a href="/resume.pdf" target="_blank" rel="noreferrer">Resume<Arrow diagonal/></a></div></header><main>
 <VideoOpening/>
 <section id="research" className="d-research"><div className="d-research-intro d-pad"><Title>THE FAULT<br/>IN THE <em>FLOW.</em></Title><div><p>One trust boundary.<br/>An entire AI pipeline exposed.</p><span className="d-meta">LANGFLOW / CVE-2026-33017</span></div></div><div className="d-research-story d-pad"><div className="d-research-summary"><h3>Finding what<br/>shouldn’t be possible.</h3><p>My Langflow research uncovered unauthenticated remote code execution in an AI workflow platform. The disclosure became part of a much larger story about securing AI infrastructure.</p><Link href={langflowArticle}>Read my research</Link><Link href={sources.advisory}>Read the security advisory</Link></div><div className="d-evidence"><article><span>The issue</span><h4>A missing trust boundary.</h4><p>Unauthenticated input could reach code execution. A system designed to connect AI workflows also exposed a critical security boundary.</p></article><article><span>My contribution</span><h4>Discovery. Disclosure. Evidence.</h4><p>I identified and reported the vulnerability, then published the research so the underlying failure could be understood.</p></article><article><span>Why it mattered</span><h4>From disclosure to active exploitation.</h4><p>CISA lists CVE-2026-33017 in its Known Exploited Vulnerabilities catalog. Sysdig documented exploitation within 20 hours of disclosure.</p><div><Link href={sources.kev}>CISA KEV</Link><Link href={sources.timeline}>Sysdig analysis</Link></div></article></div></div><DisclosureRail/></section>
 <ExploitsPreview/>
 <NominationReveal/>
 <Projects/>
 <CareerExperience/>
 <section id="speaking" className="d-speaking d-pad"><div className="d-section-heading"><Title>IDEAS WORTH<br/><em>SHARING.</em></Title><p>Research doesn’t end at disclosure.<br/>Take it into the room.</p></div><div className="d-speaking-layout"><SpeakingDeck/><div className="d-talks"><a href={sources.speaker} target="_blank" rel="noreferrer"><span>BSides Las Vegas · 2026</span><h3>Rejected-Input Programming</h3><p>Exploiting Parsers That Say No Too Late</p><Arrow diagonal/></a>{speaking.slice(0,3).map(s=><a key={s.id} href={sources.speaker} target="_blank" rel="noreferrer"><span>{s.conference}{s.id===3?' · 2026':''}</span><h3>{s.title}</h3><Arrow diagonal/></a>)}<Archive title="All conference appearances">{speaking.slice(3).map(s=><Link key={s.id} href={sources.speaker}>{s.conference} — {s.title}</Link>)}</Archive></div></div></section>
 <section id="about" className="d-about d-pad"><div className="d-about-heading"><Title>CURIOUS BY<br/><em>DEFAULT.</em></Title><span>THE PERSON BEHIND THE RESEARCH</span></div><div className="d-about-layout"><div className="d-about-manifesto"><span>AI.</span><span>SYSTEMS.</span><span>SECURITY.</span><p>Research. Engineering. Teaching.</p></div><div className="d-about-copy"><p className="d-big-copy">I’m Aviral. I study the gap between what a system promises and what it actually permits.</p><p>At Amazon, I work in Ads Security. Independently, I investigate AI and infrastructure security, build research tools, and share what I learn through writing and conference talks.</p><p>My path runs through a master’s in cybersecurity at Penn State, teaching red teaming and CTFs, and hands-on work in malware analysis, secure development, and governance.</p><Link href="/resume.pdf">The full background</Link><div className="d-credentials"><span>OSCP</span><span>CCSK v5</span><span>RSA Security Scholar 2025</span></div></div></div><div className="d-background"><Archive title="Experience & education" id="career-details"><div className="d-history"><p><strong>Amazon · Security Engineer, Ads Security</strong><br/>Sunnyvale · August 2025–present</p><p><strong>Penn State · Teaching Assistant</strong><br/>Red teaming and CTF instruction</p><p><strong>Six security internships</strong><br/>Malware reverse engineering, secure DevOps, and GRC</p><p><strong>Penn State · MS Cybersecurity Analytics & Operations</strong><br/>May 2025</p><p><strong>Amity University · BTech Computer Science</strong><br/>2023</p></div></Archive><Archive title="Expertise & practice" id="expertise">{skills.map(s=><p key={s.id}><strong>{s.title}</strong><br/>{s.description}</p>)}<Link href="https://profile.hackthebox.com/profile/019c48c2-965c-72ee-9f09-d047d439ab2c">Hack The Box · AviralxRoot</Link></Archive><Archive title="Standards, credentials & recognition" id="awards"><p>NIST OLIR contribution: OWASP LLM Top 10 v2.0 to NIST CSF 2.0. MITRE CWE / CAPEC submissions are in review, not presented as accepted standards.</p><p>OSCP · CCSK v5 · RSA Security Scholar 2025 · Cybersecurity Innovator of the Year, BSides Bangalore.</p><Link href={profile}>Public profile and contribution details</Link><Link href="/resume.pdf">Resume and credentials</Link></Archive></div></section>
 <EducationSpread/>
 <PublicChannels/>
 <section id="writing" className="d-writing d-pad"><div className="d-section-heading"><Title>THINKING<br/><em>IN PUBLIC.</em></Title><Link href="https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en">Google Scholar</Link></div><div className="d-writing-features">{research.slice(0,2).map((r,i)=><a href={r.pdfUrl} target="_blank" rel="noreferrer" key={r.id}><div className={`d-paper-art paper-${i}`} aria-hidden="true">{i===0?<><span>ONE MODEL.</span><strong>MANY<br/>TRUTHS.</strong></>:<><strong>R<sub>0</sub></strong><span>AGENTIC TOOL-NETWORKS</span></>}</div><span>{r.venue}</span><h3>{r.title}</h3><p>{r.description}</p><span className="d-inline-action">Find on Scholar <Arrow diagonal/></span></a>)}</div><Archive title={`Publication index · ${research.length} selected papers`}>{research.map(r=><Link key={r.id} href={r.pdfUrl}>{r.title} — {r.venue}</Link>)}</Archive><Archive title={`Research writing · ${blogPosts.length} articles`} id="blog">{blogPosts.map(b=><Link key={b.id} href={b.url}>{b.title}</Link>)}</Archive><Archive title="Independent disclosures"><Link href="https://medium.com/@aviral23/i-found-5-security-vulnerabilities-in-xgboost-heres-what-happened-189327f97fbf">XGBoost · Research and disclosure account</Link><Link href="https://github.com/google/sentencepiece/pull/1207">SentencePiece · Upstream report and fix discussion</Link><Link href={profile}>vLLM LoRA · Independent research (no CVE assignment claimed)</Link></Archive></section>
 <Contact/>
 </main></div>
}
