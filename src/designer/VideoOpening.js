import {useEffect,useRef,useState} from 'react';
import {motion,useTransform} from 'framer-motion';
import useMotionPreference from './useMotionPreference';
import IdentityHero from './IdentityHero';
import {INTRO} from './introTiming';
import {useIntroScore,useIntroDecoder} from './useIntroPlayback';
import './intro.css';

export default function VideoOpening(){
 const root=useRef(null),video=useRef(null),identity=useRef(null);
 const reduced=useMotionPreference();const [failed,setFailed]=useState(false);
 const staticMode=Boolean(reduced||failed),fail=useRef(()=>setFailed(true)).current;
 const score=useIntroScore(root,staticMode);
 const {status,activate}=useIntroDecoder(video,root,score,staticMode,fail);
 const veil=useTransform(score,[INTRO.filmEnd,.87,INTRO.nameEnd],[0,.65,1]);
 const opacity=useTransform(score,[INTRO.nameStart,.93],[0,1]);
 const transform=useTransform(score,[INTRO.nameStart,INTRO.nameEnd],['translateY(45px)','translateY(0px)']);
 const imageTransform=useTransform(score,[INTRO.filmEnd,INTRO.nameEnd],['scale(1)','scale(1.2)']);
 const cue=useTransform(score,[0,.035,.12],[1,1,0]);
 const progressLine=useTransform(score,p=>`scaleX(${p})`);
 useEffect(()=>{
  function update(p){if(!identity.current)return;const hidden=!staticMode&&p<INTRO.nameStart;identity.current.inert=hidden;identity.current.setAttribute('aria-hidden',String(hidden));}
  update(score.get());return score.on('change',update);
 },[score,staticMode]);
 return <section ref={root} id="top" className={`intro${staticMode?' intro-static':''}`} aria-label="Aviral Srivastava · introduction">
  <div className="intro-stage">
   <motion.div className="intro-image" style={staticMode?undefined:{transform:imageTransform}} aria-hidden="true">
    <img src="/intro/poster.jpg" className="intro-poster" alt="" fetchpriority="high"/>
    {!staticMode&&<video ref={video} className="intro-video" muted playsInline preload="auto" poster="/intro/poster.jpg" tabIndex={-1} disablePictureInPicture disableRemotePlayback aria-hidden="true"><source src="/intro/cyberpunk-walk-mobile.mp4" media="(max-width: 760px)" type="video/mp4"/><source src="/intro/cyberpunk-walk.mp4" type="video/mp4" onError={fail}/></video>}
   </motion.div>
   <div className="intro-shade" aria-hidden="true"/>
   <motion.div className="intro-veil" style={{opacity:staticMode?.78:veil}} aria-hidden="true"/>
   <motion.div className="intro-cue" style={{opacity:staticMode?0:cue}} aria-hidden="true"><span>Look closer.</span><span>Scroll to unfold ↓</span></motion.div>
   <motion.div ref={identity} className="intro-identity" style={{opacity:staticMode?1:opacity,transform:staticMode?'none':transform}}><IdentityHero embedded/></motion.div>
   {!staticMode&&<a className="intro-skip" href="#research">Skip to research ↗</a>}
   {!staticMode&&status==='blocked'&&<div className="intro-recovery"><button onClick={activate}>Enable scroll video ↗</button><button onClick={fail}>Continue without video</button></div>}
   {!staticMode&&<motion.div className="intro-progress" style={{transform:progressLine}} aria-hidden="true"/>}
  </div>
 </section>;
}
