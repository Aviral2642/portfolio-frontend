import {Suspense, createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {gsap, ScrollTrigger, getLenis, magnetic, reducedMotion, scrollTo, startScroll} from './motion';
import {preloadCase} from './caseRoute';
import './studio.css';

const Travel = createContext(() => {});
export const useTravel = () => useContext(Travel);

// Internal link that runs the page curtain before the route changes.
export function Go({to, children, className, cursor, ...rest}) {
  const travel = useTravel();
  return <a href={to} className={className} data-cursor={cursor} {...rest} onClick={event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    travel(to);
  }}>{children}</a>;
}

export const Arrow = ({down = false}) => <svg className="st-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d={down ? 'M12 4v16m-7-7 7 7 7-7' : 'M6 18 18 6M8 6h10v10'} stroke="currentColor" strokeWidth="1.5"/>
</svg>;

export function Ext({href, children, className = '', ...rest}) {
  const external = /^https?:/.test(href) || href.endsWith('.pdf');
  return <a className={`st-link ${className}`} href={href} {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})} {...rest}>
    <span>{children}</span><Arrow/>
  </a>;
}

function Cursor() {
  const dot = useRef(null), ring = useRef(null), label = useRef(null);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || reducedMotion()) return undefined;
    document.documentElement.classList.add('st-has-cursor');
    const rx = gsap.quickTo(ring.current, 'x', {duration: .45, ease: 'power3.out'});
    const ry = gsap.quickTo(ring.current, 'y', {duration: .45, ease: 'power3.out'});
    let shown = false;
    const move = e => {
      gsap.set(dot.current, {x: e.clientX, y: e.clientY});
      rx(e.clientX); ry(e.clientY);
      if (!shown) { shown = true; gsap.to([dot.current, ring.current], {autoAlpha: 1, duration: .3}); }
    };
    const over = e => {
      if (!ring.current) return;
      const target = e.target.closest?.('[data-cursor], a, button, summary');
      const text = target?.dataset.cursor;
      ring.current.classList.toggle('is-active', Boolean(target) && !text);
      ring.current.classList.toggle('is-label', Boolean(text));
      label.current.textContent = text || '';
    };
    const leave = () => { shown = false; gsap.to([dot.current, ring.current], {autoAlpha: 0, duration: .2}); };
    window.addEventListener('pointermove', move, {passive: true});
    document.addEventListener('pointerover', over, {passive: true});
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('st-has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <div aria-hidden="true">
    <div className="st-cursor-ring" ref={ring}><span ref={label}/></div>
    <div className="st-cursor-dot" ref={dot}/>
  </div>;
}

const links = [
  ['/#findings', 'Findings', '01'],
  ['/exploits', 'Archive', '02'],
  ['/#recognition', 'Recognition', '03'],
  ['/#experience', 'Experience', '04'],
  ['/#education', 'Education', '05'],
  ['/#about', 'About', '06'],
  ['/#contact', 'Contact', '07'],
];

function Nav() {
  const [open, setOpen] = useState(false);
  const bar = useRef(null), resume = useRef(null), panel = useRef(null);
  const {pathname} = useLocation();
  useEffect(() => magnetic(resume.current, .2), []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    // Hide while reading down, return on any upward scroll.
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      bar.current?.classList.toggle('is-hidden', y > last && y > 240 && !open);
      bar.current?.classList.toggle('is-solid', y > 40);
      last = y;
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop(); else lenis?.start();
    if (!panel.current) return undefined;
    panel.current.inert = !open;
    if (reducedMotion()) return undefined;
    const tween = open
      ? gsap.fromTo(panel.current.querySelectorAll('.st-menu-link > span'), {yPercent: 110}, {yPercent: 0, duration: .9, ease: 'expo.out', stagger: .05, delay: .15})
      : null;
    return () => tween?.kill();
  }, [open]);
  useEffect(() => {
    const key = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  return <>
    <header className="st-nav" ref={bar}>
      <Go to="/" className="st-brand" aria-label="Aviral Srivastava, home"><span>Aviral Srivastava</span><i aria-hidden="true"/></Go>
      <nav className="st-nav-links" aria-label="Main navigation">
        {links.map(([to, name]) => <Go key={to} to={to}>{name}</Go>)}
      </nav>
      <div className="st-nav-end">
        <a className="st-pill" ref={resume} href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume<Arrow/></a>
        <button className={`st-burger${open ? ' is-open' : ''}`} aria-expanded={open} aria-controls="st-menu" onClick={() => setOpen(v => !v)}>
          <span className="st-sr">{open ? 'Close menu' : 'Open menu'}</span><i/><i/>
        </button>
      </div>
    </header>
    <div id="st-menu" className={`st-menu${open ? ' is-open' : ''}`} ref={panel}>
      <nav aria-label="Menu">
        {links.map(([to, name, index]) => <Go key={to} to={to} className="st-menu-link"><span><small>{index}</small>{name}</span></Go>)}
      </nav>
      <div className="st-menu-foot">
        <a href="https://linkedin.com/in/aviralsrivastava23" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/Aviral2642" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
      </div>
    </div>
  </>;
}

let booted = false;

export default function Shell() {
  const navigate = useNavigate();
  const location = useLocation();
  const curtain = useRef(null), loader = useRef(null), count = useRef(null);
  const busy = useRef(false), pendingHash = useRef('');
  const [ready, setReady] = useState(booted || reducedMotion());

  useEffect(() => startScroll(), []);

  // First visit: a short count while fonts settle, then the page opens.
  useLayoutEffect(() => {
    if (ready) { booted = true; document.documentElement.classList.add('st-ready'); return undefined; }
    const state = {v: 0};
    const tl = gsap.timeline({onComplete: () => { booted = true; setReady(true); }});
    tl.to(state, {v: 100, duration: .7, ease: 'power2.inOut', onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(state.v)).padStart(3, '0'); }})
      .to(loader.current.querySelector('.st-loader-bar i'), {scaleX: 1, duration: .7, ease: 'power2.inOut'}, 0)
      .add(() => document.documentElement.classList.add('st-ready'), '>-0.05')
      .to(loader.current, {clipPath: 'inset(0 0 100% 0)', duration: .75, ease: 'expo.inOut'});
    return () => tl.kill();
  }, [ready]);

  const settle = useCallback(hash => {
    if (hash) requestAnimationFrame(() => scrollTo(hash, {immediate: true}));
    else { getLenis()?.scrollTo(0, {immediate: true, force: true}); window.scrollTo(0, 0); }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const travel = useCallback(to => {
    const [path, hash] = to.split('#');
    const target = hash ? `#${hash}` : '';
    if (path === window.location.pathname || path === '') {
      if (target) scrollTo(target); else scrollTo(0);
      return;
    }
    if (busy.current) return;
    if (reducedMotion()) { pendingHash.current = target; navigate(path); return; }
    busy.current = true;
    const el = curtain.current;
    const cover = gsap.timeline()
      .set(el, {visibility: 'visible', clipPath: 'inset(100% 0 0 0)'})
      .to(el, {clipPath: 'inset(0% 0 0 0)', duration: .6, ease: 'expo.inOut'});
    // The curtain closes while the destination's code arrives; whichever is slower sets the pace.
    const code = path.startsWith('/cve/') ? preloadCase().catch(() => {}) : null;
    Promise.all([cover.then(), code]).then(() => { pendingHash.current = target; navigate(path); });
  }, [navigate]);

  // After every route change: place the scroll, then lift the curtain.
  useEffect(() => {
    const hash = pendingHash.current || location.hash;
    pendingHash.current = '';
    settle(hash);
    const el = curtain.current;
    if (!busy.current) return;
    gsap.timeline({delay: .1, onComplete: () => { busy.current = false; gsap.set(el, {visibility: 'hidden'}); }})
      .to(el, {clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'expo.inOut'});
  }, [location.pathname, location.hash, settle]);

  return <Travel.Provider value={travel}>
    <div className="st">
      <a className="st-skip" href="#main">Skip to content</a>
      <Cursor/>
      <Nav/>
      <Suspense fallback={null}><Outlet context={{ready}}/></Suspense>
      <div className="st-grain" aria-hidden="true"/>
      <div className="st-curtain" ref={curtain} aria-hidden="true"><i/></div>
      {!ready && <div className="st-loader" ref={loader} role="status" aria-label="Loading">
        <div className="st-loader-inner"><span className="st-loader-name">Aviral Srivastava</span><span className="st-loader-count" ref={count}>000</span></div>
        <div className="st-loader-bar"><i/></div>
      </div>}
    </div>
  </Travel.Provider>;
}
