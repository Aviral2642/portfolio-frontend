import React,{useEffect,useId,useRef,useState} from 'react';
import {motion} from 'framer-motion';
import useMotionPreference from '../useMotionPreference';
import {bytes,hex,address,sections,strings,instructions} from './specimen';
import './microscope.css';

const views=['Bytes','Sections','Strings','Behavior'];
const colors=['#b9a0ef','#9c83ce','#d5c4ee','#f09dcb','#c7f2e0','#ae86f5'];
const Arrow=()=> <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5"/></svg>;

function ByteLens({reduced,active}){
 const id=useId().replaceAll(':','');const svg=useRef(),lens=useRef(),clip=useRef(),zoom=useRef(),readout=useRef();
 const point=useRef({x:635,y:210}),frame=useRef(0),drag=useRef(false);
 const cells=[...bytes];
 const draw=()=>{
  const {x,y}=point.current;
  lens.current?.setAttribute('transform',`translate(${x} ${y})`);
  clip.current?.setAttribute('cx',x);clip.current?.setAttribute('cy',y);
  zoom.current?.setAttribute('transform',`translate(${x} ${y}) scale(1.7) translate(${-x} ${-y})`);
  const index=Math.floor((y-92)/42)*16+Math.floor((x-84)/48);
  if(readout.current)readout.current.textContent=index>=0&&index<bytes.length?`${address(index)} / ${hex(bytes[index])}`:'Outside specimen';
 };
 const move=(x,y)=>{
  const element=svg.current,rect=element?.getBoundingClientRect(),parent=element?.parentElement.getBoundingClientRect();
  const inset=rect?.width?(parent.left-rect.left)*960/rect.width:0;
  point.current={x:Math.max(150+inset,Math.min(810-inset,x)),y:Math.max(145,Math.min(350,y))};
  cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(draw);
 };
 useEffect(()=>{
  const resize=new ResizeObserver(()=>move(point.current.x,point.current.y));
  resize.observe(svg.current);draw();
  return()=>{resize.disconnect();cancelAnimationFrame(frame.current);};
 },[]);
 const onPointer=e=>{
  if(e.pointerType==='touch'&&!drag.current)return;
  const matrix=svg.current.getScreenCTM();if(!matrix)return;
  const local=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
  move(local.x,local.y);
 };
 const text=(magnified=false)=>cells.map((byte,index)=><text key={index} x={84+(index%16)*48} y={112+Math.floor(index/16)*42} fill={magnified?'#21142f':colors[sections.findIndex(section=>index>=section.start&&index<section.end)]}>{hex(byte)}</text>);
 return <div className="mi-byte-view">
  <svg ref={svg} viewBox="0 0 960 550" role="img" aria-label="Magnifying lens over the specimen bytes. Arrow keys move the lens; Home resets it." tabIndex={active?0:-1}
   onPointerDown={e=>{drag.current=true;onPointer(e);}} onPointerUp={()=>{drag.current=false;}} onPointerCancel={()=>{drag.current=false;}} onPointerLeave={()=>{drag.current=false;}}
   onPointerMove={onPointer} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')move(635,210);else move(point.current.x+(e.key==='ArrowLeft'?-32:e.key==='ArrowRight'?32:0),point.current.y+(e.key==='ArrowUp'?-32:e.key==='ArrowDown'?32:0));}}>
   <defs><clipPath id={`${id}-lens`}><circle ref={clip} cx="635" cy="210" r="126"/></clipPath><linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4ecfc"/><stop offset=".22" stopColor="#73667f"/><stop offset=".48" stopColor="#221a2c"/><stop offset=".72" stopColor="#c5b8db"/><stop offset="1" stopColor="#534362"/></linearGradient></defs>
   <g className="mi-byte-text" opacity=".66">{text()}</g>
   {Array.from({length:Math.ceil(bytes.length/16)},(_,row)=><text className="mi-row-address" key={row} x="18" y={112+row*42}>{hex(row*16)}</text>)}
   <g clipPath={`url(#${id}-lens)`}><rect width="960" height="550" fill="#decdf7"/><g className="mi-byte-text" ref={zoom} transform="translate(635 210) scale(1.7) translate(-635 -210)">{text(true)}</g></g>
   <g ref={lens} transform="translate(635 210)" className={reduced?'':'mi-lens-shadow'}>
    <circle r="133" fill="none" stroke={`url(#${id}-metal)`} strokeWidth="13"/><circle r="125" fill="none" stroke="#fff0fc" strokeWidth="1"/>
    <path d="M-146 0h-15m307 0h15M0-146v-15M0 146v15" stroke="#d8bbff" strokeWidth="1"/>
    <path d="M-9 0H9M0-9V9" stroke="#583b79" strokeWidth="1"/>
    <rect x="-100" y="156" width="200" height="34" rx="17" fill="#1b1426" stroke="#746087"/>
    <text ref={readout} className="mi-lens-address" textAnchor="middle" y="178">{address(45)} / {hex(bytes[45])}</text>
   </g>
  </svg>
  <p className="mi-gesture">Move the lens. Look past the surface.<span>Touch or arrow keys work too.</span></p>
 </div>;
}

export default function Microscope(){
 const [view,setView]=useState(0),[selected,setSelected]=useState(4),[step,setStep]=useState(0),[keyboard,setKeyboard]=useState(false);
 const reduced=useMotionPreference();const section=sections[selected];
 useEffect(()=>{const previous=document.querySelector('meta[name="robots"]');if(previous)return;const tag=document.createElement('meta');tag.name='robots';tag.content='noindex,nofollow';document.head.appendChild(tag);return()=>tag.remove();},[]);
 const choose=(index,event)=>{setKeyboard(event.detail===0);setView(index);};
 const detail=[
  {title:'A file is not a black box.',copy:'Every byte belongs somewhere. Move the lens over the specimen, then change your view to connect raw data with structure and meaning.',note:'Actual bytes. No random hex. No simulated scan.'},
  {title:section.name,copy:section.description,note:`${address(section.start)}–${address(section.end-1)} · ${section.bytes.length} bytes, including section framing`},
  {title:'Readable isn’t executable.',copy:'Strings offer leads: names, labels, human intent. They do not prove that a program performs an action. Here, “answer” is an export and the longer sentence is custom metadata.',note:'Contiguous printable ASCII runs · minimum 4 bytes'},
  {title:instructions[step].title,copy:instructions[step].detail,note:'An annotated reading of the function, not an execution trace.'},
 ][view];
 return <div className="mi-page" data-reduced={reduced||keyboard}>
  <header className="mi-nav"><a href="/" aria-label="Return to Aviral’s portfolio">Aviral.</a><span>Experimental interaction · local review</span><a href="/resume.pdf">Resume <Arrow/></a></header>
  <main>
   <div className="mi-intro"><h1>UNDER THE<br/><em>MICROSCOPE.</em></h1><div><p>Same file.<br/>A different way of seeing.</p><span>Explore how binary analysis turns<br/>opaque data into understanding.</span></div></div>
   <section className="mi-workbench" aria-label="Interactive binary specimen">
    <div className="mi-filebar"><span><i aria-hidden="true"/> specimen.wasm</span><span>{bytes.length} bytes <b> / </b> WebAssembly v1</span><span>Prepared, benign specimen</span></div>
    <div className="mi-workspace">
     <div className="mi-stage" data-view={view}>
      <div className="mi-visual mi-raw" aria-hidden={view!==0}><ByteLens reduced={reduced} active={view===0}/></div>
      <div className="mi-visual mi-sections" aria-hidden={view!==1}>
       <div className="mi-stack">{sections.map((item,index)=><button key={item.id} tabIndex={view===1?0:-1} aria-pressed={selected===index} onClick={()=>setSelected(index)} style={{'--layer':index,'--layer-color':colors[index]}}><span>{address(item.start)}</span><strong>{item.name}</strong><small>{item.bytes.length} B</small><i aria-hidden="true"/></button>)}</div>
       <p className="mi-gesture">One file. Six structural regions.<span>Select a layer to inspect its role.</span></p>
      </div>
      <div className="mi-visual mi-strings" aria-hidden={view!==2}><span className="mi-string-ghost" aria-hidden="true">61 6E 73 77 65 72</span><div className="mi-extracted">{strings.map((item,index)=><div key={item.start}><code>{address(item.start)}</code><p className={index===0?'mi-string-name':''}>{item.text}</p></div>)}</div><p className="mi-gesture">Text emerges from the bytes.<span>Extracted locally from this exact specimen.</span></p></div>
      <div className="mi-visual mi-behavior" aria-hidden={view!==3}><div className="mi-behavior-top"><span>answer()</span><span>() → i32</span></div><div className="mi-result" data-step={step}><span>RESULT</span><strong>42</strong><span>{step===0?'A value on the stack':'The value returned to the caller'}</span></div><div className="mi-instructions">{instructions.map((item,index)=><button key={item.offset} tabIndex={view===3?0:-1} aria-pressed={step===index} onClick={()=>setStep(index)}><code>{address(item.offset)}</code><strong>{item.name}</strong><span>{item.encoding}</span></button>)}</div><p className="mi-gesture">Read the instructions. Follow the value.<span>Nothing runs in your browser.</span></p></div>
     </div>
     <aside className="mi-reading"><div className="mi-view-select" role="group" aria-label="Inspection view">{views.map((name,index)=><button key={name} aria-pressed={view===index} onClick={event=>choose(index,event)}>{name}<span aria-hidden="true">{String(index+1).padStart(2,'0')}</span></button>)}</div><motion.div className="mi-explanation" key={`${view}-${selected}-${step}`} initial={false} animate={{opacity:1}} transition={{duration:reduced||keyboard?0:.2}}><h2>{detail.title}</h2><p>{detail.copy}</p><small>{detail.note}</small></motion.div><div className="mi-next"><button onClick={event=>choose((view+1)%4,event)}>{view===3?'Back to the bytes':`Explore ${views[view+1].toLowerCase()}`}<Arrow/></button></div></aside>
    </div>
   </section>
   <footer className="mi-footer"><p>Observation before assumption.<br/><span>A small illustration of the research mindset—not a malware scanner.</span></p><a href="/#about">Meet the researcher <Arrow/></a></footer>
   <details className="mi-evidence"><summary>Inspect the specimen & methodology</summary><div><p>This original teaching file contains one exported function, <code>answer</code>, that would return the integer 42. It has no imports. The interface reads a fixed byte array; it never instantiates or executes WebAssembly. String extraction and byte ranges are derived directly from that array.</p><p>The section view is an exploded visual index, not a physical memory layout. The file has five sections plus its eight-byte preamble. The behavior view is a manually annotated instruction reading; it is not an observed runtime trace.</p><pre aria-label="Complete specimen bytes">{Array.from({length:Math.ceil(bytes.length/16)},(_,row)=>`${address(row*16)}  ${[...bytes.slice(row*16,row*16+16)].map(hex).join(' ')}`).join('\n')}</pre><a href="https://webassembly.github.io/spec/core/binary/modules.html" target="_blank" rel="noreferrer">WebAssembly binary format specification <Arrow/></a></div></details>
  </main>
 </div>;
}
