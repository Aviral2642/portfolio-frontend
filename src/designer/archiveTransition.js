import {flushSync} from 'react-dom';
import {preloadArchive} from './archiveRoute';

export function isPlainNavigation(event) {
  return !event.defaultPrevented && event.button === 0 &&
    !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function deadline(promise, ms) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Archive preparation timed out')), ms);
  })]).finally(() => clearTimeout(timer));
}

// React.lazy may suspend for one commit even when its module has been prefetched.
// Capture the new snapshot only when the real destination exists, never its loader.
export function waitForArchive(ms = 1600) {
  return new Promise((resolve, reject) => {
    const selector = '.x-masthead h1';
    if (document.querySelector(selector)) return resolve();
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) { cleanup(); resolve(); }
    });
    const timer = setTimeout(() => { cleanup(); reject(new Error('Archive did not mount')); }, ms);
    const cleanup = () => { observer.disconnect(); clearTimeout(timer); };
    observer.observe(document.body, {childList:true, subtree:true});
  });
}

export async function openArchive({navigate, animate}) {
  const origin = window.location.href;
  let cancelled = false;
  let transition;
  const cancel = () => { cancelled = true; transition?.skipTransition(); };
  window.addEventListener('popstate', cancel, {once:true});
  window.addEventListener('pagehide', cancel, {once:true});
  const skip = () => transition?.skipTransition();
  const focusHeading = () => document.querySelector('.x-masthead h1')?.focus({preventScroll:true});
  try {
    await deadline(preloadArchive(), 1800);
    if (cancelled || window.location.href !== origin) return;
    // Browser Back returns to the preview rather than restarting the film hero.
    window.history.replaceState(window.history.state, '', '/#exploits');
    const commit = async () => {
      flushSync(() => navigate('/exploits'));
      await waitForArchive();
      // View transitions suspend rendering during this callback. Waiting for an
      // animation frame here deadlocks until the browser aborts the transition.
      // A task boundary lets React's cleanup finish without waiting on painting.
      await new Promise(resolve => setTimeout(resolve, 0));
      window.scrollTo({top:0, left:0, behavior:'instant'});
    };
    if (!animate || !document.startViewTransition) {
      await commit();
      focusHeading();
      return;
    }
    document.documentElement.dataset.archiveTransition = 'opening';
    transition = document.startViewTransition(commit);
    // Resizing or interacting interrupts decoration, never navigation.
    window.addEventListener('resize', skip);
    window.addEventListener('wheel', skip, {passive:true});
    window.addEventListener('keydown', skip);
    transition.ready.catch(() => {}); // Unsupported snapshot state can safely skip.
    await transition.finished;
    if (!cancelled) focusHeading();
  } catch {
    // Module/network or snapshot failure must leave a working, ordinary link.
    if (!cancelled && window.location.pathname !== '/exploits') window.location.assign('/exploits');
  } finally {
    delete document.documentElement.dataset.archiveTransition;
    window.removeEventListener('popstate', cancel);
    window.removeEventListener('pagehide', cancel);
    window.removeEventListener('resize', skip);
    window.removeEventListener('wheel', skip);
    window.removeEventListener('keydown', skip);
  }
}
