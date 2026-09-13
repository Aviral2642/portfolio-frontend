import {useEffect, useRef} from 'react';

// Custom bounded stable-fluid solver. Technique references: Pavel Dobryakov's
// MIT WebGL-Fluid-Simulation and NVIDIA GPU Gems chapter 38. No demo script,
// tracking, textures, GUI or replacement cursor is shipped.
function createFluid(canvas) {
 const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,depth:false,powerPreference:'low-power',premultipliedAlpha:false});
 if(!gl||!gl.getExtension('EXT_color_buffer_float')||!gl.getExtension('OES_texture_float_linear'))return ()=>{};
 const resources={programs:[],shaders:[],textures:[],fbos:[]};let frame=0,disposed=false,lastInput=0,previous=0,lastPoint=null,pending=null;
 const vertex=`#version 300 es
 precision highp float;out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
 const header=`#version 300 es
 precision highp float;in vec2 uv;out vec4 result;uniform sampler2D field;uniform sampler2D velocity;uniform sampler2D pressure;uniform vec2 texel;uniform float dt;uniform vec2 point;uniform vec3 force;uniform float aspect;`;
 function shader(type,source){const s=gl.createShader(type);resources.shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Fluid shader unavailable');return s;}
 const vs=shader(gl.VERTEX_SHADER,vertex);
 function program(source){const p=gl.createProgram();resources.programs.push(p);gl.attachShader(p,vs);gl.attachShader(p,shader(gl.FRAGMENT_SHADER,header+source));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error('Fluid material unavailable');return {p,u:Object.fromEntries(['field','velocity','pressure','texel','dt','point','force','aspect'].map(k=>[k,gl.getUniformLocation(p,k)]))};}
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);resources.textures.forEach(t=>gl.deleteTexture(t));resources.fbos.forEach(f=>gl.deleteFramebuffer(f));resources.programs.forEach(p=>gl.deleteProgram(p));resources.shaders.forEach(s=>gl.deleteShader(s));canvas.dataset.fluid='stopped';}
 let advect,splat,divergence,solve,subtract,display;
 try{
 advect=program(`void main(){vec2 v=texture(velocity,uv).xy;vec2 pos=clamp(uv-dt*v*texel,texel,1.-texel);result=texture(field,pos)/(1.+dt*1.9);}`);
 splat=program(`void main(){vec2 d=uv-point;d.x*=aspect;float f=exp(-dot(d,d)/.00045);result=texture(field,uv)+vec4(force*f,0.);}`);
 divergence=program(`void main(){float l=texture(field,uv-vec2(texel.x,0)).x;float r=texture(field,uv+vec2(texel.x,0)).x;float b=texture(field,uv-vec2(0,texel.y)).y;float t=texture(field,uv+vec2(0,texel.y)).y;result=vec4(.5*(r-l+t-b),0,0,1);}`);
 solve=program(`void main(){float l=texture(pressure,uv-vec2(texel.x,0)).x;float r=texture(pressure,uv+vec2(texel.x,0)).x;float b=texture(pressure,uv-vec2(0,texel.y)).x;float t=texture(pressure,uv+vec2(0,texel.y)).x;float d=texture(field,uv).x;result=vec4((l+r+b+t-d)*.25,0,0,1);}`);
 subtract=program(`void main(){float l=texture(pressure,uv-vec2(texel.x,0)).x;float r=texture(pressure,uv+vec2(texel.x,0)).x;float b=texture(pressure,uv-vec2(0,texel.y)).x;float t=texture(pressure,uv+vec2(0,texel.y)).x;vec2 v=texture(field,uv).xy-vec2(r-l,t-b)*.5;result=vec4(v,0,1);}`);
 display=program(`void main(){vec3 c=texture(field,uv).rgb;float a=clamp(max(c.r,max(c.g,c.b)),0.,.85);result=vec4(c,a);}`);
 }catch{dispose();return ()=>{};}
 const w=384,h=256;
 function buffer(){const texture=gl.createTexture();resources.textures.push(texture);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,w,h,0,gl.RGBA,gl.HALF_FLOAT,null);const fbo=gl.createFramebuffer();resources.fbos.push(fbo);gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Fluid framebuffer unavailable');gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);return {texture,fbo};}
 function pair(){return {read:buffer(),write:buffer(),swap(){[this.read,this.write]=[this.write,this.read];}};}
 let vel,dye,pres,div;try{vel=pair();dye=pair();pres=pair();div=buffer();}catch{dispose();return ()=>{};}
 function bindTexture(p,name,target,unit){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,target.texture);gl.uniform1i(p.u[name],unit);}
 function pass(p,target,fields,delta,data){gl.useProgram(p.p);gl.uniform2f(p.u.texel,1/w,1/h);gl.uniform1f(p.u.dt,delta);gl.uniform1f(p.u.aspect,canvas.clientWidth/canvas.clientHeight);if(data){gl.uniform2fv(p.u.point,data.point);gl.uniform3fv(p.u.force,data.force);}Object.entries(fields).forEach(([key,value],i)=>bindTexture(p,key,value,i));gl.bindFramebuffer(gl.FRAMEBUFFER,target?.fbo||null);gl.viewport(0,0,target?w:canvas.width,target?h:canvas.height);gl.drawArrays(gl.TRIANGLES,0,3);}
 function tick(now){frame=0;if(disposed||document.hidden)return;if(now-lastInput>2200){gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.clear(gl.COLOR_BUFFER_BIT);canvas.dataset.fluid='idle';return;}const dt=Math.min((now-previous)/1000||.016,.025);previous=now;
 pass(advect,vel.write,{field:vel.read,velocity:vel.read},dt);vel.swap();
 if(pending){pass(splat,vel.write,{field:vel.read},dt,{point:pending.point,force:pending.force});vel.swap();pass(splat,dye.write,{field:dye.read},dt,{point:pending.point,force:[.6,.14,.95]});dye.swap();pending=null;}
 pass(divergence,div,{field:vel.read},dt);for(let i=0;i<8;i++){pass(solve,pres.write,{field:div,pressure:pres.read},dt);pres.swap();}
 pass(subtract,vel.write,{field:vel.read,pressure:pres.read},dt);vel.swap();pass(advect,dye.write,{field:dye.read,velocity:vel.read},dt);dye.swap();pass(display,null,{field:dye.read},dt);canvas.dataset.fluid='running';frame=requestAnimationFrame(tick);}
 function move(e){if(disposed||e.pointerType!=='mouse'||document.hidden)return;const point=[e.clientX/window.innerWidth,1-e.clientY/window.innerHeight];if(lastPoint){pending={point,force:[Math.max(-120,Math.min(120,(point[0]-lastPoint[0])*2200)),Math.max(-120,Math.min(120,(point[1]-lastPoint[1])*2200)),0]};lastInput=performance.now();if(!frame){previous=lastInput;frame=requestAnimationFrame(tick);}}lastPoint=point;}
 function resize(){canvas.width=Math.min(window.innerWidth,1280);canvas.height=Math.round(canvas.width*window.innerHeight/window.innerWidth);lastPoint=null;}
 function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;lastPoint=null;canvas.dataset.fluid='paused';}}
 function lost(e){e.preventDefault();dispose();}
 resize();canvas.dataset.fluid='ready';window.addEventListener('pointermove',move,{passive:true});window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',lost);return dispose;
}
export default function FluidInk({enabled}){const canvas=useRef();useEffect(()=>{const mq=window.matchMedia('(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');let cleanup=()=>{};function update(){cleanup();if(enabled&&mq.matches){try{cleanup=createFluid(canvas.current);}catch{cleanup=()=>{};}}}update();mq.addEventListener('change',update);return()=>{cleanup();mq.removeEventListener('change',update);};},[enabled]);return enabled?<canvas ref={canvas} className="d-fluid" aria-hidden="true"/>:null;}
