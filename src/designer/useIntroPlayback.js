import {useEffect,useRef,useState,useCallback} from 'react';
import {useMotionValue} from 'framer-motion';
import {clampIntro,introTime} from './introTiming';

// Scroll is native. A single score owns both the film and HTML; no React
// state/render work on animation frames. Reversal retargets the current value.
export function useIntroScore(root,staticMode){
 const score=useMotionValue(0);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  if(staticMode){score.set(1);return;}
  let raf=0,last=0,target=0,start=0,distance=1;
  const read=()=>clampIntro((window.scrollY-start)/distance);
  const stop=()=>{cancelAnimationFrame(raf);raf=0;last=0;};
  function tick(now){
   raf=0;if(document.hidden)return;
   const dt=last?Math.min(40,now-last):16.67;last=now;
   const current=score.get();
   const next=Math.abs(target-current)<.0001?target:current+(target-current)*(1-Math.exp(-dt/65));
   score.set(next);if(next!==target)raf=requestAnimationFrame(tick);else last=0;
  }
  function scroll(){
   target=read();if(document.hidden)return;
   if(window.scrollY>start+el.offsetHeight){stop();score.set(target);return;}
   if(!raf)raf=requestAnimationFrame(tick);
  }
  function measure(){start=el.getBoundingClientRect().top+window.scrollY;distance=Math.max(1,el.offsetHeight-el.querySelector('.intro-stage').offsetHeight);target=read();stop();score.set(target);}
  const visibility=()=>document.hidden?stop():measure();
  const observer=new ResizeObserver(measure);observer.observe(el);measure();
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',measure,{passive:true});window.addEventListener('hashchange',measure);document.addEventListener('visibilitychange',visibility);
  return()=>{stop();observer.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',measure);window.removeEventListener('hashchange',measure);document.removeEventListener('visibilitychange',visibility);};
 },[root,score,staticMode]);
 return score;
}

export function useIntroDecoder(videoRef,root,score,disabled,onError){
 const [status,setStatus]=useState('loading');
 const retry=useRef(()=>{});
 const activate=useCallback(()=>retry.current(),[]);
 useEffect(()=>{
  const video=videoRef.current;if(!video||disabled)return;
  let raf=0,inView=true,disposed=false,priming=false,unlocked=false;
  const report=value=>{if(!disposed)setStatus(value);};
  function pump(){
   raf=0;if(disposed||priming||document.hidden||!inView||video.readyState<1||video.seeking||!Number.isFinite(video.duration))return;
   const target=introTime(score.get(),video.duration);
   // Quantized timestamps avoid repeating alternate frames at 60 Hz. Only one
   // seek in flight; the newest target supersedes any intermediate targets.
   if(Math.abs(target-video.currentTime)>.001){try{video.currentTime=target;}catch{report('blocked');}}
  }
  const schedule=()=>{if(!raf&&!disposed)raf=requestAnimationFrame(pump);};
  // iOS may preload only metadata. Brief muted inline playback initializes its
  // decoder, then native scrolling remains the sole owner of currentTime.
  function prime(){
   if(disposed||priming||unlocked)return;
   priming=true;video.muted=true;video.defaultMuted=true;video.playsInline=true;
   Promise.resolve(video.play()).then(()=>{
    if(disposed)return;
    video.pause();unlocked=true;priming=false;report('ready');schedule();
   }).catch(()=>{if(disposed)return;priming=false;report('blocked');schedule();});
  }
  retry.current=prime;
  const ready=()=>{report('ready');schedule();};
  const wake=()=>{if(!document.hidden){if(!unlocked)prime();schedule();}};
  const observer=new IntersectionObserver(([e])=>{inView=e.isIntersecting;if(inView)schedule();},{rootMargin:'150px'});observer.observe(root.current);
  const unsubscribe=score.on('change',schedule);
  video.addEventListener('loadedmetadata',schedule);video.addEventListener('loadeddata',ready);video.addEventListener('canplay',schedule);video.addEventListener('seeked',ready);video.addEventListener('error',onError);document.addEventListener('visibilitychange',wake);
  // Real user gestures can unlock Low Power Mode / restrictive media policies.
  window.addEventListener('touchstart',prime,{passive:true});window.addEventListener('pointerdown',prime,{passive:true});
  const slow=setTimeout(()=>{if(!unlocked&&video.readyState<2)report('blocked');},8000);
  prime();schedule();
  return()=>{disposed=true;retry.current=()=>{};clearTimeout(slow);video.pause();cancelAnimationFrame(raf);observer.disconnect();unsubscribe();video.removeEventListener('loadedmetadata',schedule);video.removeEventListener('loadeddata',ready);video.removeEventListener('canplay',schedule);video.removeEventListener('seeked',ready);video.removeEventListener('error',onError);document.removeEventListener('visibilitychange',wake);window.removeEventListener('touchstart',prime);window.removeEventListener('pointerdown',prime);};
 },[videoRef,root,score,disabled,onError]);
 return {status,activate};
}
