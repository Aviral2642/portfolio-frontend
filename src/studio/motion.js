import {useEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const EASE = 'expo.out';
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// One smooth-scroll instance for the studio pages, driven by GSAP's ticker so
// ScrollTrigger and Lenis share a clock.
let lenis = null;
let tick = null;
export const getLenis = () => lenis;

export function startScroll() {
  if (lenis || reducedMotion()) return () => {};
  lenis = new Lenis({lerp: .11, wheelMultiplier: 1, smoothWheel: true, anchors: false});
  lenis.on('scroll', ScrollTrigger.update);
  tick = time => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollTo(target, options = {}) {
  if (lenis) lenis.scrollTo(target, {offset: -72, duration: 1.4, ...options});
  else if (typeof target === 'number') window.scrollTo(0, target);
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView();
}

// Wrap each word in a mask so lines can rise into place. Idempotent.
function splitWords(el) {
  if (el.dataset.split === 'done') return [...el.querySelectorAll('.w-i')];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const node of texts) {
    if (!node.nodeValue.trim()) continue;
    const frag = document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
      const mask = document.createElement('span'); mask.className = 'w';
      const inner = document.createElement('span'); inner.className = 'w-i'; inner.textContent = part;
      mask.appendChild(inner); frag.appendChild(mask);
    });
    node.parentNode.replaceChild(frag, node);
  }
  el.dataset.split = 'done';
  return [...el.querySelectorAll('.w-i')];
}

// Blocks inside a [data-above] region are on screen at load: play, do not wait for scroll.
const above = node => Boolean(node.closest('[data-above]'));

// Declarative motion for a page root:
//   data-rise      words rise from a mask when the block enters
//   data-fade      block fades up; children with data-fade-item stagger
//   data-read      words light up with scroll (reading reveal)
//   data-drift="n" vertical parallax, n in viewport fractions
//   data-line      a rule draws from the left
export function usePageMotion(root, deps = [], enabled = true) {
  useEffect(() => {
    const el = root.current;
    if (!el || !enabled) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        el.querySelectorAll('[data-rise]').forEach(node => {
          const words = splitWords(node);
          gsap.set(node, {autoAlpha: 1});
          gsap.from(words, {
            yPercent: 115, duration: 1.1, ease: EASE, stagger: {amount: Math.min(.5, words.length * .045)},
            delay: Number(node.dataset.rise) || 0,
            scrollTrigger: above(node) ? undefined : {trigger: node, start: 'top 88%', once: true},
          });
        });
        el.querySelectorAll('[data-fade]').forEach(node => {
          const items = node.querySelectorAll('[data-fade-item]');
          gsap.from(items.length ? items : node, {
            y: 28, autoAlpha: 0, duration: 1, ease: EASE, stagger: .07, delay: Number(node.dataset.fade) || 0,
            scrollTrigger: above(node) ? undefined : {trigger: node, start: 'top 88%', once: true},
          });
        });
        el.querySelectorAll('[data-read]').forEach(node => {
          const words = splitWords(node);
          gsap.fromTo(words, {opacity: .14}, {
            opacity: 1, ease: 'none', stagger: .1,
            scrollTrigger: {trigger: node, start: 'top 78%', end: 'bottom 45%', scrub: .4},
          });
        });
        el.querySelectorAll('[data-drift]').forEach(node => {
          const amount = Number(node.dataset.drift) * 100;
          gsap.fromTo(node, {yPercent: amount}, {
            yPercent: -amount, ease: 'none',
            scrollTrigger: {trigger: node.parentElement, start: 'top bottom', end: 'bottom top', scrub: true},
          });
        });
        el.querySelectorAll('[data-line]').forEach(node => {
          gsap.from(node, {
            scaleX: 0, transformOrigin: 'left center', duration: 1.3, ease: 'expo.inOut',
            scrollTrigger: {trigger: node, start: 'top 92%', once: true},
          });
        });
      }, el);
      return () => ctx.revert();
    });
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; mm.revert(); };
  }, deps);
}

// Pointer-following pull for buttons and large links.
export function magnetic(node, strength = .28) {
  if (!node || !matchMedia('(pointer: fine)').matches || reducedMotion()) return () => {};
  const x = gsap.quickTo(node, 'x', {duration: .5, ease: 'power3.out'});
  const y = gsap.quickTo(node, 'y', {duration: .5, ease: 'power3.out'});
  const move = e => {
    const r = node.getBoundingClientRect();
    x((e.clientX - r.left - r.width / 2) * strength);
    y((e.clientY - r.top - r.height / 2) * strength);
  };
  const leave = () => { x(0); y(0); };
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', leave);
  return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); gsap.set(node, {x: 0, y: 0}); };
}

export {gsap, ScrollTrigger};
