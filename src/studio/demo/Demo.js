import {useEffect, useRef, useState} from 'react';
import {gsap, ScrollTrigger} from '../motion';
import scenes from './scenes';
import './demo.css';

// A stage whose timeline plays by itself while it is on screen. Each scene is
// written in "acts": act n owns timeline time n..n+1 and one caption. Below 900px, or
// with reduced motion, the stage is not shown and the written steps carry it.
export default function Demo({finding, accent}) {
  const scene = scenes[finding.id];
  const root = useRef(null), stage = useRef(null), bar = useRef(null), player = useRef(null), held = useRef(false);
  const [act, setAct] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = scene ? scene.acts.length : 0;

  useEffect(() => {
    if (!scene) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const el = root.current;
      el.classList.add('is-live');
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({paused: true, defaults: {ease: 'power2.out', duration: .4}});
        scene.build(tl, gsap.utils.selector(stage.current), accent);
        tl.to({}, {duration: .001}, total); // every scene lasts exactly `total` acts
        // The moment the boundary gives way: the whole stage flashes and jolts.
        if (scene.impact != null) {
          tl.fromTo(stage.current.querySelector('.dm-flash'), {opacity: 0}, {opacity: .5, duration: .06, ease: 'none'}, scene.impact)
            .to(stage.current.querySelector('.dm-flash'), {opacity: 0, duration: .3}, scene.impact + .06)
            .fromTo(stage.current.querySelector('.dm-scene'), {x: 0}, {x: 7, duration: .04, repeat: 5, yoyo: true, ease: 'none'}, scene.impact);
        }
        // A packet runs along every live wire for as long as that wire is drawn.
        const wires = [...stage.current.querySelectorAll('.dm-w:not(.is-cold)')];
        const packets = wires.map((wire, i) => {
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('r', '.42'); dot.setAttribute('class', 'dm-packet');
          const motion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
          motion.setAttribute('dur', `${1.1 + (i % 3) * .25}s`); motion.setAttribute('repeatCount', 'indefinite'); motion.setAttribute('path', wire.getAttribute('d'));
          dot.appendChild(motion); wire.parentNode.appendChild(dot);
          return dot;
        });
        const sync = () => wires.forEach((wire, i) => {
          const live = parseFloat(wire.style.strokeDashoffset || '1') < .02 && parseFloat(wire.style.opacity || '1') > .5;
          packets[i].style.opacity = live ? 1 : 0;
        });
        sync();
        // Plays on its own while on screen, loops after a pause, and can be stepped by hand.
        const update = () => {
          const progress = Math.min(1, tl.time() / total);
          if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
          sync();
          const index = Math.min(total - 1, Math.floor(tl.time() + .02));
          setAct(previous => (previous === index ? previous : index));
        };
        tl.eventCallback('onUpdate', update);
        tl.timeScale(.34).repeat(-1).repeatDelay(1.1);
        player.current = tl;
        el.classList.add('is-idle');
        stage.current.querySelector('.dm-wires')?.pauseAnimations();
        ScrollTrigger.create({
          trigger: el, start: 'top 70%', end: 'bottom 25%',
          onToggle: self => {
            if (self.isActive && !held.current) tl.play(); else tl.pause();
            // Off screen, nothing on the stage keeps animating.
            el.classList.toggle('is-idle', !self.isActive);
            const svg = stage.current?.querySelector('.dm-wires');
            if (svg) { if (self.isActive) svg.unpauseAnimations(); else svg.pauseAnimations(); }
          },
        });
      }, el);
      return () => { player.current = null; ctx.revert(); el.classList.remove('is-live'); el.querySelectorAll('.dm-packet').forEach(node => node.remove()); };
    });
    return () => mm.revert();
  }, [scene, accent, total]);

  if (!scene) return null;
  const Stage = scene.Stage;
  const current = scene.acts[act];
  const jump = index => { const tl = player.current; if (!tl) return; tl.time(index + .001); if (!held.current) tl.play(); };
  const toggle = () => { const tl = player.current; if (!tl) return; held.current = !held.current; setPaused(held.current); if (held.current) tl.pause(); else tl.play(); };
  return <div className="dm" ref={root}>
    <div className="dm-pin">
      <div className="dm-head st-pad">
        <p className="st-meta"><b>Simplified reconstruction</b> · plays on its own</p>
        <ol className="dm-acts">
          {scene.acts.map((a, i) => <li key={a.label} className={i === act ? 'is-on' : i < act ? 'is-done' : ''}><button type="button" onClick={() => jump(i)} aria-label={`Step ${i + 1}: ${a.label}`}><span>{String(i + 1).padStart(2, '0')}</span>{a.label}</button></li>)}
          <li><button type="button" className="dm-toggle" onClick={toggle}>{paused ? 'Play' : 'Pause'}</button></li>
        </ol>
      </div>
      <div className="dm-frame st-pad">
        <div className="dm-stage" ref={stage} aria-hidden="true"><div className="dm-scene"><Stage/></div><i className="dm-scan"/><i className="dm-flash"/></div>
      </div>
      <div className="dm-foot st-pad" aria-hidden="true">
        <div className="dm-caption" key={act}><span className="dm-num">{String(act + 1).padStart(2, '0')}</span><p>{current.text}</p></div>
        <div className="dm-progress"><i ref={bar}/></div>
      </div>
    </div>
  </div>;
}
