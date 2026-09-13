import {useEffect, useRef} from 'react';

// This enhancement is loaded only near the award. HTML remains the source of
// meaning. Actual beveled text geometry uses the existing self-hosted Anton font.
export default function GoldType({progress}) {
 const host=useRef(null);
 useEffect(()=>{
  const element=host.current;
  const preference=matchMedia('(min-width: 960px) and (prefers-reduced-motion: no-preference)');
  let disposed=false,loading=false,renderer,geometryA,geometryB,materialA,materialB,environment,frame=0,resizeObserver,render=()=>{};
  const pointer={x:0,y:0};
  async function init(){
   if(!preference.matches||disposed||renderer||loading)return;
   loading=true;
   try{
    const [THREE,{TTFLoader},{Font},{TextGeometry},{RoomEnvironment}]=await Promise.all([import('three'),import('three/examples/jsm/loaders/TTFLoader.js'),import('three/examples/jsm/loaders/FontLoader.js'),import('three/examples/jsm/geometries/TextGeometry.js'),import('three/examples/jsm/environments/RoomEnvironment.js')]);
    if(disposed)return;
    const fontData=await new TTFLoader().loadAsync('/fonts/anton-regular.ttf');
    if(disposed)return;
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
    const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(30,1,.1,40);camera.position.set(0,0,9);
    const room=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
    scene.add(new THREE.AmbientLight(0xffe0b1,1.6));const key=new THREE.DirectionalLight(0xffe5bc,5);key.position.set(-3,4,5);scene.add(key);const rim=new THREE.DirectionalLight(0x9775ff,3);rim.position.set(4,-1,3);scene.add(rim);
    const font=new Font(fontData);const options={font,size:1,depth:.18,curveSegments:8,bevelEnabled:true,bevelThickness:.025,bevelSize:.018,bevelSegments:3};
    geometryA=new TextGeometry('NOMINATED',options);geometryB=new TextGeometry('PWNIE',options);geometryA.center();geometryB.center();geometryA.computeBoundingBox();geometryB.computeBoundingBox();
    materialA=new THREE.MeshStandardMaterial({color:0xe7ba65,metalness:.86,roughness:.25,transparent:true,depthWrite:false});materialB=materialA.clone();
    const a=new THREE.Mesh(geometryA,materialA),b=new THREE.Mesh(geometryB,materialB);const aWidth=geometryA.boundingBox.max.x-geometryA.boundingBox.min.x;const bWidth=geometryB.boundingBox.max.x-geometryB.boundingBox.min.x;a.scale.setScalar(7.3/aWidth);b.scale.setScalar(6.1/bWidth);scene.add(a,b);
    function draw(){frame=0;if(disposed||!preference.matches||document.hidden)return;const p=progress.current;const exit=THREE.MathUtils.smoothstep(p,.2,.44),entry=THREE.MathUtils.smoothstep(p,.4,.64);a.rotation.set(.07+pointer.y*.04,-.18+exit*.35+pointer.x*.05,-.04);a.position.set(-exit*.6,exit*.75,0);materialA.opacity=1-exit;b.rotation.set(.06+pointer.y*.04,.2*(1-entry)+pointer.x*.05,-.035*(1-entry));b.position.y=.1-(1-entry)*.5;materialB.opacity=entry;a.visible=materialA.opacity>.005;b.visible=materialB.opacity>.005;renderer.render(scene,camera);element.dataset.ready='true';}
    render=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(draw);};
    resizeObserver=new ResizeObserver(()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=Math.max(5,4.2/camera.aspect/Math.tan(Math.PI/12));camera.updateProjectionMatrix();render();});resizeObserver.observe(element);
    element.appendChild(renderer.domElement);renderer.domElement.addEventListener('webglcontextlost',lost);render();
   }catch{element.dataset.ready='false';}finally{loading=false;}
  }
  function lost(e){e.preventDefault();cancelAnimationFrame(frame);frame=0;element.dataset.ready='false';render=()=>{};}
  function onPointer(e){const r=element.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;render();}
  const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){init();render();}},{rootMargin:'600px'});observer.observe(element);
  const scroll=()=>{const r=element.getBoundingClientRect();if(r.bottom>0&&r.top<window.innerHeight)render();};
  const change=()=>{if(!preference.matches){element.dataset.ready='false';cancelAnimationFrame(frame);frame=0;}else{init();render();}};
  window.addEventListener('scroll',scroll,{passive:true});element.addEventListener('pointermove',onPointer,{passive:true});preference.addEventListener('change',change);document.addEventListener('visibilitychange',scroll);
  return()=>{disposed=true;observer.disconnect();resizeObserver?.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);element.removeEventListener('pointermove',onPointer);preference.removeEventListener('change',change);document.removeEventListener('visibilitychange',scroll);geometryA?.dispose();geometryB?.dispose();materialA?.dispose();materialB?.dispose();environment?.dispose();if(renderer){renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.dispose();renderer.domElement.remove();}};
 },[progress]);
 return <div className="gold-type" ref={host} aria-hidden="true"><span className="gold-type-fallback">PWNIE</span></div>;
}
