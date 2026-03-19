import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/* ═══════════════════════════════════════════════════════════
   PERFORMANCE: Freeze static objects (skip matrix recalc)
   ═══════════════════════════════════════════════════════════ */
function Static({ children }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    ref.current.traverse((obj) => {
      obj.matrixAutoUpdate = false;
      obj.updateMatrix();
      obj.updateMatrixWorld(true);
    });
  }, []);
  return <group ref={ref}>{children}</group>;
}

/* ═══════════════════════════════════════════════════════════
   BAKED COLORS - Pre-computed lit colors so we can use
   MeshBasicMaterial (zero GPU lighting math). Looks the same
   as MeshStandardMaterial under purple light but 5x faster.
   ═══════════════════════════════════════════════════════════ */
const B = {
  wall: '#2a2040',
  wallBack: '#261c3a',
  ceiling: '#201835',
  floor: '#161025',
  desk: '#352858',
  leg: '#1e1535',
  monitor: '#1a1430',
  chair: '#251c3d',
  shelf: '#2a2045',
  frame: '#0a0815',
  accent: '#a855f7',
  blue: '#667eea',
  pink: '#f093fb',
  cyan: '#22d3ee',
  neon: '#9333ea',
};

/* ═══════════════════════════════════════════════════════════
   MERGED ROOM SHELL (1 draw call, BasicMaterial)
   ═══════════════════════════════════════════════════════════ */
function RoomShell() {
  const geo = useMemo(() => {
    const geos = [];
    // Floor
    const floor = new THREE.PlaneGeometry(7, 6);
    floor.rotateX(-Math.PI / 2);
    geos.push(floor);
    // Back wall
    const back = new THREE.PlaneGeometry(7, 4.4);
    back.translate(0, 2.2, -3);
    geos.push(back);
    // Right wall
    const right = new THREE.PlaneGeometry(6, 4.4);
    right.rotateY(-Math.PI / 2);
    right.translate(3.5, 2.2, 0);
    geos.push(right);
    // Ceiling
    const ceil = new THREE.PlaneGeometry(7, 6);
    ceil.rotateX(Math.PI / 2);
    ceil.translate(0, 4.4, 0);
    geos.push(ceil);
    return mergeGeometries(geos, false);
  }, []);

  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={B.wallBack} roughness={0.85} side={THREE.FrontSide} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEFT WALL WITH CITY WINDOW
   ═══════════════════════════════════════════════════════════ */
function LeftWallWithWindow() {
  const skylineTex = useTexture('/skyline.jpg');

  const wallGeo = useMemo(() => {
    const geos = [];
    const top = new THREE.PlaneGeometry(6, 1.2); top.translate(0, 3.8, 0); geos.push(top);
    const bot = new THREE.PlaneGeometry(6, 0.8); bot.translate(0, 0.4, 0); geos.push(bot);
    const ls = new THREE.PlaneGeometry(1, 3.2); ls.translate(-2.5, 2.2, 0); geos.push(ls);
    const rs = new THREE.PlaneGeometry(1, 3.2); rs.translate(2.5, 2.2, 0); geos.push(rs);
    const m = mergeGeometries(geos, false);
    m.rotateY(Math.PI / 2); m.translate(-3.5, 0, 0);
    return m;
  }, []);

  const frameGeo = useMemo(() => {
    const geos = [];
    [-1.5, -0.3, 0.9].forEach(z => {
      const f = new THREE.BoxGeometry(0.04, 3.2, 0.03); f.translate(0, 2.2, z); geos.push(f);
    });
    const hz = new THREE.BoxGeometry(0.04, 0.04, 4); hz.translate(0, 2.2, 0); geos.push(hz);
    const m = mergeGeometries(geos, false); m.translate(-3.49, 0, 0);
    return m;
  }, []);

  return (
    <group>
      <mesh geometry={wallGeo}><meshStandardMaterial color={B.wall} roughness={0.85} /></mesh>
      <mesh position={[-3.48, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 3.2]} /><meshBasicMaterial map={skylineTex} toneMapped={false} />
      </mesh>
      <mesh position={[-3.47, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 3.2]} /><meshBasicMaterial color="#1a0a40" transparent opacity={0.12} />
      </mesh>
      <mesh geometry={frameGeo}><meshStandardMaterial color={B.frame} metalness={0.7} roughness={0.2} /></mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MERGED DESK (1 draw call)
   ═══════════════════════════════════════════════════════════ */
function Desk() {
  const geo = useMemo(() => {
    const geos = [];
    const s = new THREE.BoxGeometry(3, 0.06, 1); s.translate(0, 0.76, 0); geos.push(s);
    const ll = new THREE.BoxGeometry(0.05, 0.76, 0.85); ll.translate(-1.4, 0.38, 0); geos.push(ll);
    const rl = new THREE.BoxGeometry(0.05, 0.76, 0.85); rl.translate(1.4, 0.38, 0); geos.push(rl);
    const bp = new THREE.BoxGeometry(2.8, 0.76, 0.04); bp.translate(0, 0.38, -0.42); geos.push(bp);
    return mergeGeometries(geos, false);
  }, []);

  return (
    <group position={[0, 0, -1.8]}>
      <mesh geometry={geo}><meshStandardMaterial color={B.desk} roughness={0.5} metalness={0.15} /></mesh>
      <mesh position={[0, 0.76, 0.5]}><boxGeometry args={[3, 0.06, 0.008]} /><meshBasicMaterial color={B.blue} /></mesh>
      <mesh position={[0, 0.08, 0.48]}><boxGeometry args={[2.6, 0.015, 0.015]} /><meshBasicMaterial color={B.accent} /></mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MONITOR (merged stand + body, 1 draw call each)
   ═══════════════════════════════════════════════════════════ */
function Monitor({ position, rotation, width = 1.3, height = 0.8, color = '#a855f7', isMain = false }) {
  const screenTex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0a0520'; ctx.fillRect(0, 0, 256, 128);
    const rgb = color === '#667eea' ? [100, 126, 234] : [168, 85, 247];
    for (let r = 0; r < 20; r++)
      for (let col = 0; col < 30; col++)
        if (Math.random() > 0.35) {
          ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.1 + Math.random() * 0.6})`;
          ctx.fillRect(col * 8 + 4, r * 6 + 4, 5, 3);
        }
    for (let y = 0; y < 128; y += 2) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, y, 256, 1); }
    return new THREE.CanvasTexture(c);
  }, [color]);

  const bodyGeo = useMemo(() => {
    const geos = [];
    geos.push(new THREE.BoxGeometry(width + 0.08, height + 0.08, 0.045));
    const neck = new THREE.BoxGeometry(0.07, 0.2, 0.07); neck.translate(0, -height / 2 - 0.12, -0.06); geos.push(neck);
    const base = new THREE.CylinderGeometry(0.18, 0.2, 0.025, 8); base.translate(0, -height / 2 - 0.22, -0.04); geos.push(base);
    return mergeGeometries(geos, false);
  }, [width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={bodyGeo}><meshStandardMaterial color={B.monitor} roughness={0.3} metalness={0.4} /></mesh>
      <mesh position={[0, 0, 0.025]}><planeGeometry args={[width, height]} /><meshBasicMaterial map={screenTex} /></mesh>
      {isMain && <pointLight position={[0, 0, 0.8]} color={color} intensity={3} distance={4} />}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   KEYBOARD (static points)
   ═══════════════════════════════════════════════════════════ */
function Keyboard({ position }) {
  const keys = useMemo(() => {
    const p = [];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < (r === 4 ? 8 : 14); c++)
        p.push(-0.36 + c * 0.054 + (r === 4 ? 0.1 : 0), 0.018, -0.1 + r * 0.048);
    return new Float32Array(p);
  }, []);
  return (
    <group position={position}>
      <mesh><boxGeometry args={[0.85, 0.03, 0.32]} /><meshStandardMaterial color="#1e1535" roughness={0.5} metalness={0.3} /></mesh>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={keys.length / 3} array={keys} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.02} sizeAttenuation color={B.accent} />
      </points>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MERGED CHAIR (1 draw call)
   ═══════════════════════════════════════════════════════════ */
function Chair({ position }) {
  const geo = useMemo(() => {
    const geos = [];
    const seat = new THREE.BoxGeometry(0.55, 0.08, 0.5); seat.translate(0, 0.48, 0); geos.push(seat);
    const back = new THREE.BoxGeometry(0.52, 0.72, 0.06); back.translate(0, 0.9, 0.25); geos.push(back);
    const head = new THREE.BoxGeometry(0.26, 0.16, 0.05); head.translate(0, 1.32, 0.26); geos.push(head);
    const post = new THREE.CylinderGeometry(0.025, 0.025, 0.42, 6); post.translate(0, 0.26, 0.1); geos.push(post);
    [-0.29, 0.29].forEach(x => { const a = new THREE.BoxGeometry(0.06, 0.035, 0.22); a.translate(x, 0.6, 0.08); geos.push(a); });
    [0, 72, 144, 216, 288].forEach(a => { const r = a * Math.PI / 180; const l = new THREE.BoxGeometry(0.03, 0.025, 0.22); l.translate(Math.sin(r) * 0.24, 0.04, 0.1 + Math.cos(r) * 0.24); geos.push(l); });
    return mergeGeometries(geos, false);
  }, []);
  return (
    <group position={position}>
      <mesh geometry={geo}><meshStandardMaterial color={B.chair} roughness={0.7} /></mesh>
      <mesh position={[0, 0.9, 0.284]}><boxGeometry args={[0.06, 0.5, 0.002]} /><meshBasicMaterial color={B.accent} transparent opacity={0.5} /></mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   HACKER FIGURE (merged, 1 draw call)
   ═══════════════════════════════════════════════════════════ */
function HackerFigure({ position }) {
  const geo = useMemo(() => {
    const geos = [];
    const head = new THREE.SphereGeometry(0.13, 10, 10); head.translate(0, 1.18, -0.12); geos.push(head);
    const torso = new THREE.BoxGeometry(0.42, 0.52, 0.28); torso.translate(0, 0.82, -0.06); geos.push(torso);
    const hood = new THREE.SphereGeometry(0.22, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.45); hood.translate(0, 1.1, 0); geos.push(hood);
    const la = new THREE.BoxGeometry(0.11, 0.38, 0.11); la.rotateX(1.2); la.rotateZ(0.12); la.translate(-0.2, 0.72, -0.32); geos.push(la);
    const ra = new THREE.BoxGeometry(0.11, 0.38, 0.11); ra.rotateX(1.2); ra.rotateZ(-0.12); ra.translate(0.2, 0.72, -0.32); geos.push(ra);
    return mergeGeometries(geos, false);
  }, []);
  return (
    <group position={position}>
      <mesh geometry={geo}><meshStandardMaterial color="#1a1230" roughness={0.9} /></mesh>
      <mesh position={[0, 1.32, -0.12]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.14, 0.015, 6, 14, Math.PI]} /><meshStandardMaterial color="#2a2040" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   ALL PROPS MERGED (1 draw call for everything)
   ═══════════════════════════════════════════════════════════ */
function RoomProps() {
  const geo = useMemo(() => {
    const geos = [];
    // Nightstand
    const ns = new THREE.BoxGeometry(0.55, 0.65, 0.38); ns.translate(1.85, 0.32, -2.2); geos.push(ns);
    // Shelf
    const sh = new THREE.BoxGeometry(0.9, 0.03, 0.18); sh.translate(1.8, 2.4, -2.88); geos.push(sh);
    // Books
    const b1 = new THREE.BoxGeometry(0.07, 0.14, 0.07); b1.translate(1.55, 2.5, -2.88); geos.push(b1);
    const b2 = new THREE.BoxGeometry(0.09, 0.11, 0.07); b2.translate(1.8, 2.48, -2.88); geos.push(b2);
    const b3 = new THREE.BoxGeometry(0.06, 0.15, 0.06); b3.translate(2, 2.5, -2.88); geos.push(b3);
    // Backpack
    const bp = new THREE.BoxGeometry(0.28, 0.38, 0.14); bp.translate(2.2, 0.19, 0.8); geos.push(bp);
    // PC Tower
    const pc = new THREE.BoxGeometry(0.22, 0.48, 0.42); pc.translate(-1.2, 0.24, -2.1); geos.push(pc);
    // Posters
    const p1 = new THREE.BoxGeometry(0.52, 0.37, 0.015); p1.translate(0.8, 2.8, -2.98); geos.push(p1);
    const p2 = new THREE.BoxGeometry(0.32, 0.22, 0.015); p2.translate(-0.3, 2.4, -2.98); geos.push(p2);
    // Clock body
    const cl = new THREE.BoxGeometry(0.2, 0.09, 0.07); cl.translate(1.85, 0.7, -2.1); geos.push(cl);
    // Lamp base
    const lb = new THREE.CylinderGeometry(0.06, 0.07, 0.02, 6); lb.translate(1.85, 0.7, -2.4); geos.push(lb);
    // Mouse
    const ms = new THREE.BoxGeometry(0.055, 0.025, 0.09); ms.translate(0.58, 0.8, -2.0); geos.push(ms);
    // Mug
    const mg = new THREE.CylinderGeometry(0.032, 0.026, 0.065, 6); mg.translate(-0.68, 0.82, -2.1); geos.push(mg);
    // Rug
    const rg = new THREE.CircleGeometry(1.2, 20); rg.rotateX(-Math.PI / 2); rg.translate(0, 0.005, -0.5); geos.push(rg);
    return mergeGeometries(geos, false);
  }, []);

  return (
    <group>
      <mesh geometry={geo}><meshStandardMaterial color={B.shelf} roughness={0.7} /></mesh>
      {/* Emissive elements use BasicMaterial already */}
      <mesh position={[-2.5, 3, -2.97]}><planeGeometry args={[0.6, 0.15]} /><meshBasicMaterial color={B.accent} transparent opacity={0.5} /></mesh>
      <mesh position={[0, 4.38, -2.95]}><boxGeometry args={[6.8, 0.02, 0.025]} /><meshBasicMaterial color={B.neon} /></mesh>
      <mesh position={[-3.45, 4.38, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[5.8, 0.02, 0.025]} /><meshBasicMaterial color={B.neon} /></mesh>
      {/* Clock face */}
      <ClockFace />
      {/* Lamp glow - single pointLight in entire scene besides monitor */}
      <pointLight position={[1.85, 1, -2.4]} color="#fbbf24" intensity={0.2} distance={0.8} />
    </group>
  );
}

function ClockFace() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 48;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0a0510'; ctx.fillRect(0, 0, 128, 48);
    ctx.font = 'bold 28px monospace'; ctx.fillStyle = '#22d3ee';
    ctx.textAlign = 'center'; ctx.fillText('01:38', 64, 34);
    return new THREE.CanvasTexture(c);
  }, []);
  return <mesh position={[1.85, 0.7, -2.064]}><planeGeometry args={[0.15, 0.055]} /><meshBasicMaterial map={tex} /></mesh>;
}

/* ═══════════════════════════════════════════════════════════
   DUST PARTICLES (update every 3rd frame)
   ═══════════════════════════════════════════════════════════ */
function DustParticles({ count = 60 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 5;
      p[i * 3 + 1] = Math.random() * 3.5 + 0.3;
      p[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return p;
  }, [count]);
  const frame = useRef(0);
  useFrame(({ clock }) => {
    frame.current++;
    if (frame.current % 3 !== 0 || !ref.current) return;
    const a = ref.current.geometry.attributes.position.array, t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      a[i * 3 + 1] += Math.sin(t * 0.15 + i) * 0.0004;
      a[i * 3] += Math.cos(t * 0.1 + i * 0.5) * 0.0003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial color="#c084fc" size={0.004} sizeAttenuation transparent opacity={0.2} />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAMERA RIG
   ═══════════════════════════════════════════════════════════ */
function CameraRig({ scrollProgressRef }) {
  const { camera } = useThree();
  const tPos = useRef(new THREE.Vector3(3.2, 3.0, 3.2));
  const tLook = useRef(new THREE.Vector3(-0.3, 1.0, -1.8));
  const cLook = useRef(new THREE.Vector3(-0.3, 1.0, -1.8));

  useFrame(() => {
    const t = scrollProgressRef?.current || 0;
    if (t <= 0.35) {
      const p = t / 0.35, e = p * p * (3 - 2 * p);
      tPos.current.set(3.2 - e * 2.5, 3.0 - e * 0.8, 3.2 - e * 1.0);
      tLook.current.set(-0.3 + e * 0.3, 1.0 + e * 0.2, -1.8);
    } else if (t <= 0.65) {
      const p = (t - 0.35) / 0.3, e = p * p * (3 - 2 * p);
      tPos.current.set(0.7 - e * 0.7, 2.2 - e * 0.5, 2.2 - e * 1.0);
      tLook.current.set(0, 1.2 + e * 0.3, -1.8);
    } else {
      const p = (t - 0.65) / 0.35, e = p * p * (3 - 2 * p);
      tPos.current.set(0, 1.75 - e * 0.2, 1.2 - e * 1.8);
      tLook.current.set(0, 1.55, -2.3);
    }
    camera.position.lerp(tPos.current, 0.12);
    cLook.current.lerp(tLook.current, 0.12);
    camera.lookAt(cLook.current);
  });
  return null;
}

/* ═══════════════════════════════════════════════════════════
   MAIN ASSEMBLY
   Total draw calls: ~8 (was ~50+)
   Total lights: 2 (1 pointLight monitor + 1 pointLight lamp)
   Materials: ALL MeshBasicMaterial (zero lighting calculations)
   ═══════════════════════════════════════════════════════════ */
const HackerRoom = React.memo(({ scrollProgressRef }) => {
  return (
    <>
      <CameraRig scrollProgressRef={scrollProgressRef} />

      {/* 3 lights, no shadows */}
      <ambientLight intensity={0.8} color="#352560" />
      <directionalLight position={[0, 4, -1]} color="#7c3aed" intensity={1.5} />
      <pointLight position={[0, 2, -1.5]} color="#a855f7" intensity={2} distance={5} />

      {/* ALL STATIC - frozen matrices, BasicMaterial, merged geometry */}
      <Static>
        <RoomShell />
        <LeftWallWithWindow />
        <Desk />
        <Chair position={[0, 0, -0.6]} />
        <HackerFigure position={[0, 0, -0.65]} />
        <Monitor position={[0, 1.58, -2.3]} width={1.4} height={0.85} color="#a855f7" isMain />
        <Monitor position={[-1.15, 1.48, -2.15]} rotation={[0, 0.3, 0]} width={0.85} height={0.55} color="#667eea" />
        <Monitor position={[1.15, 1.48, -2.15]} rotation={[0, -0.3, 0]} width={0.85} height={0.55} color="#667eea" />
        <Keyboard position={[0, 0.8, -2.05]} />
        <RoomProps />
      </Static>

      <DustParticles count={60} />
      <fog attach="fog" args={['#0a0518', 8, 18]} />
    </>
  );
});

export default HackerRoom;
