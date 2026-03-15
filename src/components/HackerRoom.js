import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BakeShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/* ═══════════════════════════════════════════════════════════
   PERFORMANCE: Freeze static meshes so GPU skips matrix recalc
   ═══════════════════════════════════════════════════════════ */
function Static({ children }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    ref.current.traverse((obj) => {
      obj.matrixAutoUpdate = false;
      obj.updateMatrix();
      obj.updateMatrixWorld(true);
      if (obj.isMesh) obj.frustumCulled = true;
    });
  }, []);
  return <group ref={ref}>{children}</group>;
}

/* ═══════════════════════════════════════════════════════════
   COLORS
   ═══════════════════════════════════════════════════════════ */
const C = {
  wall: '#3d2d5c', wallBack: '#382858', ceiling: '#302450',
  floor: '#221838', desk: '#4a3870', deskEdge: '#5a4580',
  leg: '#2d2048', monitorFrame: '#2a2040', chair: '#352855',
  chairDark: '#2a2045', shelf: '#3a2d58', accent: '#a855f7',
  blue: '#667eea', pink: '#f093fb', cyan: '#22d3ee', neon: '#9333ea',
};

/* ═══════════════════════════════════════════════════════════
   MERGED ROOM GEOMETRY - Single draw call for all walls/floor
   ═══════════════════════════════════════════════════════════ */
function RoomShell() {
  const mergedGeo = useMemo(() => {
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
    <mesh geometry={mergedGeo} receiveShadow>
      <meshStandardMaterial color={C.wallBack} roughness={0.85} side={THREE.FrontSide} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEFT WALL WITH CITY WINDOW
   ═══════════════════════════════════════════════════════════ */
function LeftWallWithWindow() {
  const skylineTex = useTexture('/skyline.jpg');

  // Merge the wall sections around the window into one geometry
  const wallGeo = useMemo(() => {
    const geos = [];
    // Top strip
    const top = new THREE.PlaneGeometry(6, 1.2);
    top.translate(0, 3.8, 0);
    geos.push(top);
    // Bottom strip
    const bot = new THREE.PlaneGeometry(6, 0.8);
    bot.translate(0, 0.4, 0);
    geos.push(bot);
    // Left side
    const ls = new THREE.PlaneGeometry(1, 3.2);
    ls.translate(-2.5, 2.2, 0);
    geos.push(ls);
    // Right side
    const rs = new THREE.PlaneGeometry(1, 3.2);
    rs.translate(2.5, 2.2, 0);
    geos.push(rs);
    const merged = mergeGeometries(geos, false);
    merged.rotateY(Math.PI / 2);
    merged.translate(-3.5, 0, 0);
    return merged;
  }, []);

  // Window frame merged
  const frameGeo = useMemo(() => {
    const geos = [];
    const frameMat = new THREE.BoxGeometry(0.04, 3.2, 0.03);
    [-1.5, -0.3, 0.9].forEach(z => {
      const f = frameMat.clone();
      f.translate(0, 2.2, z);
      geos.push(f);
    });
    // Horizontal
    const hz = new THREE.BoxGeometry(0.04, 0.04, 4);
    hz.translate(0, 2.2, 0);
    geos.push(hz);
    const merged = mergeGeometries(geos, false);
    merged.translate(-3.49, 0, 0);
    return merged;
  }, []);

  return (
    <group>
      {/* Wall sections */}
      <mesh geometry={wallGeo} receiveShadow>
        <meshStandardMaterial color={C.wall} roughness={0.85} />
      </mesh>
      {/* City skyline */}
      <mesh position={[-3.48, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 3.2]} />
        <meshBasicMaterial map={skylineTex} toneMapped={false} />
      </mesh>
      {/* Glass tint */}
      <mesh position={[-3.47, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 3.2]} />
        <meshBasicMaterial color="#1a0a40" transparent opacity={0.12} />
      </mesh>
      {/* Merged window frame */}
      <mesh geometry={frameGeo}>
        <meshStandardMaterial color="#0a0815" metalness={0.8} roughness={0.15} />
      </mesh>
      {/* City light spill */}
      <pointLight position={[-2.5, 2, 0]} color="#2a4060" intensity={0.8} distance={5} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   FLOOR RUG
   ═══════════════════════════════════════════════════════════ */
function FloorRug() {
  return (
    <mesh position={[0, 0.005, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.2, 24]} />
      <meshBasicMaterial color="#2a1e45" />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   MERGED DESK (single draw call)
   ═══════════════════════════════════════════════════════════ */
function Desk() {
  const geo = useMemo(() => {
    const geos = [];
    // Surface
    const surface = new THREE.BoxGeometry(3, 0.06, 1);
    surface.translate(0, 0.76, 0);
    geos.push(surface);
    // Left leg
    const ll = new THREE.BoxGeometry(0.05, 0.76, 0.85);
    ll.translate(-1.4, 0.38, 0);
    geos.push(ll);
    // Right leg
    const rl = new THREE.BoxGeometry(0.05, 0.76, 0.85);
    rl.translate(1.4, 0.38, 0);
    geos.push(rl);
    // Back panel
    const bp = new THREE.BoxGeometry(2.8, 0.76, 0.04);
    bp.translate(0, 0.38, -0.42);
    geos.push(bp);
    return mergeGeometries(geos, false);
  }, []);

  return (
    <group position={[0, 0, -1.8]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={C.desk} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Front edge LED */}
      <mesh position={[0, 0.76, 0.5]}>
        <boxGeometry args={[3, 0.06, 0.008]} />
        <meshBasicMaterial color={C.blue} />
      </mesh>
      {/* Under-desk LED */}
      <mesh position={[0, 0.08, 0.48]}>
        <boxGeometry args={[2.6, 0.015, 0.015]} />
        <meshBasicMaterial color={C.accent} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MONITOR - static texture, minimal geometry
   ═══════════════════════════════════════════════════════════ */
function Monitor({ position, rotation, width = 1.3, height = 0.8, color = '#a855f7', isMain = false }) {
  const screenTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0a0520';
    ctx.fillRect(0, 0, 256, 128);
    const rgb = color === '#667eea' ? [100, 126, 234] : [168, 85, 247];
    for (let row = 0; row < 20; row++)
      for (let col = 0; col < 30; col++)
        if (Math.random() > 0.35) {
          ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.1 + Math.random() * 0.6})`;
          ctx.fillRect(col * 8 + 4, row * 6 + 4, 5, 3);
        }
    for (let y = 0; y < 128; y += 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(0, y, 256, 1);
    }
    return new THREE.CanvasTexture(c);
  }, [color]);

  const geo = useMemo(() => {
    const geos = [];
    // Casing
    const casing = new THREE.BoxGeometry(width + 0.08, height + 0.08, 0.045);
    geos.push(casing);
    // Stand neck
    const neck = new THREE.BoxGeometry(0.07, 0.2, 0.07);
    neck.translate(0, -height / 2 - 0.12, -0.06);
    geos.push(neck);
    // Stand base
    const base = new THREE.CylinderGeometry(0.18, 0.2, 0.025, 8);
    base.translate(0, -height / 2 - 0.22, -0.04);
    geos.push(base);
    return mergeGeometries(geos, false);
  }, [width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color={C.monitorFrame} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={screenTex} />
      </mesh>
      {isMain && <pointLight position={[0, 0, 0.8]} color={color} intensity={3} distance={4} />}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   KEYBOARD (static, instanced points)
   ═══════════════════════════════════════════════════════════ */
function Keyboard({ position }) {
  const keyData = useMemo(() => {
    const p = [];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < (r === 4 ? 8 : 14); c++)
        p.push(-0.36 + c * 0.054 + (r === 4 ? 0.1 : 0), 0.018, -0.1 + r * 0.048);
    return new Float32Array(p);
  }, []);

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.85, 0.03, 0.32]} />
        <meshStandardMaterial color="#1e1535" roughness={0.5} metalness={0.3} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={keyData.length / 3} array={keyData} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.02} sizeAttenuation color={C.accent} />
      </points>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   MERGED CHAIR (single draw call)
   ═══════════════════════════════════════════════════════════ */
function Chair({ position }) {
  const geo = useMemo(() => {
    const geos = [];
    // Seat
    const seat = new THREE.BoxGeometry(0.55, 0.08, 0.5);
    seat.translate(0, 0.48, 0);
    geos.push(seat);
    // Backrest
    const back = new THREE.BoxGeometry(0.52, 0.72, 0.06);
    back.translate(0, 0.9, 0.25);
    geos.push(back);
    // Headrest
    const head = new THREE.BoxGeometry(0.26, 0.16, 0.05);
    head.translate(0, 1.32, 0.26);
    geos.push(head);
    // Post
    const post = new THREE.CylinderGeometry(0.025, 0.025, 0.42, 6);
    post.translate(0, 0.26, 0.1);
    geos.push(post);
    // Armrests
    [-0.29, 0.29].forEach(x => {
      const arm = new THREE.BoxGeometry(0.06, 0.035, 0.22);
      arm.translate(x, 0.6, 0.08);
      geos.push(arm);
    });
    // Base legs
    [0, 72, 144, 216, 288].forEach(a => {
      const r = a * Math.PI / 180;
      const leg = new THREE.BoxGeometry(0.03, 0.025, 0.22);
      leg.translate(Math.sin(r) * 0.24, 0.04, 0.1 + Math.cos(r) * 0.24);
      geos.push(leg);
    });
    return mergeGeometries(geos, false);
  }, []);

  return (
    <group position={position}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color={C.chair} roughness={0.7} />
      </mesh>
      {/* Purple accent */}
      <mesh position={[0, 0.9, 0.284]}>
        <boxGeometry args={[0.06, 0.5, 0.002]} />
        <meshBasicMaterial color={C.accent} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   HACKER FIGURE (merged)
   ═══════════════════════════════════════════════════════════ */
function HackerFigure({ position }) {
  const bodyGeo = useMemo(() => {
    const geos = [];
    // Head
    const head = new THREE.SphereGeometry(0.13, 12, 12);
    head.translate(0, 1.18, -0.12);
    geos.push(head);
    // Torso
    const torso = new THREE.BoxGeometry(0.42, 0.52, 0.28);
    torso.translate(0, 0.82, -0.06);
    geos.push(torso);
    // Hood
    const hood = new THREE.SphereGeometry(0.22, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.45);
    hood.translate(0, 1.1, 0);
    geos.push(hood);
    // Arms
    const la = new THREE.BoxGeometry(0.11, 0.38, 0.11);
    la.rotateX(1.2); la.rotateZ(0.12);
    la.translate(-0.2, 0.72, -0.32);
    geos.push(la);
    const ra = new THREE.BoxGeometry(0.11, 0.38, 0.11);
    ra.rotateX(1.2); ra.rotateZ(-0.12);
    ra.translate(0.2, 0.72, -0.32);
    geos.push(ra);
    return mergeGeometries(geos, false);
  }, []);

  return (
    <group position={position}>
      <mesh geometry={bodyGeo} castShadow>
        <meshStandardMaterial color="#1a1230" roughness={0.9} />
      </mesh>
      {/* Headphones */}
      <mesh position={[0, 1.32, -0.12]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.14, 0.015, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#2a2040" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOM PROPS (all merged into minimal draw calls)
   ═══════════════════════════════════════════════════════════ */
function RoomProps() {
  // Nightstand + shelf + backpack + posters + clock all in one geo
  const propsGeo = useMemo(() => {
    const geos = [];
    // Nightstand
    const ns = new THREE.BoxGeometry(0.55, 0.65, 0.38);
    ns.translate(1.85, 0.32, -2.2);
    geos.push(ns);
    // Shelf
    const sh = new THREE.BoxGeometry(0.9, 0.03, 0.18);
    sh.translate(1.8, 2.4, -2.88);
    geos.push(sh);
    // Books on shelf
    const b1 = new THREE.BoxGeometry(0.07, 0.14, 0.07);
    b1.translate(1.55, 2.5, -2.88);
    geos.push(b1);
    const b2 = new THREE.BoxGeometry(0.09, 0.11, 0.07);
    b2.translate(1.8, 2.48, -2.88);
    geos.push(b2);
    const b3 = new THREE.BoxGeometry(0.06, 0.15, 0.06);
    b3.translate(2, 2.5, -2.88);
    geos.push(b3);
    // Backpack
    const bp = new THREE.BoxGeometry(0.28, 0.38, 0.14);
    bp.translate(2.2, 0.19, 0.8);
    geos.push(bp);
    // PC Tower
    const pc = new THREE.BoxGeometry(0.22, 0.48, 0.42);
    pc.translate(-1.2, 0.24, -2.1);
    geos.push(pc);
    // Wall posters
    const p1 = new THREE.BoxGeometry(0.52, 0.37, 0.015);
    p1.translate(0.8, 2.8, -2.98);
    geos.push(p1);
    const p2 = new THREE.BoxGeometry(0.32, 0.22, 0.015);
    p2.translate(-0.3, 2.4, -2.98);
    geos.push(p2);

    return mergeGeometries(geos, false);
  }, []);

  return (
    <group>
      <mesh geometry={propsGeo} castShadow>
        <meshStandardMaterial color={C.shelf} roughness={0.7} />
      </mesh>
      {/* Neon sign */}
      <mesh position={[-2.5, 3, -2.97]}>
        <planeGeometry args={[0.6, 0.15]} />
        <meshBasicMaterial color={C.accent} transparent opacity={0.5} />
      </mesh>
      {/* Ceiling LEDs */}
      <mesh position={[0, 4.38, -2.95]}>
        <boxGeometry args={[6.8, 0.02, 0.025]} />
        <meshBasicMaterial color={C.neon} />
      </mesh>
      <mesh position={[-3.45, 4.38, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5.8, 0.02, 0.025]} />
        <meshBasicMaterial color={C.neon} />
      </mesh>
      {/* Under-desk LED glow */}
      <pointLight position={[0, 0.1, -1.3]} color={C.accent} intensity={0.4} distance={1.5} />
      {/* Digital clock face */}
      <DigitalClock />
      {/* Desk lamp with warm light */}
      <DeskLamp />
      {/* Mouse */}
      <mesh position={[0.58, 0.8, -2.0]} castShadow>
        <boxGeometry args={[0.055, 0.025, 0.09]} />
        <meshStandardMaterial color="#1e1535" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Coffee mug */}
      <mesh position={[-0.68, 0.82, -2.1]} castShadow>
        <cylinderGeometry args={[0.032, 0.026, 0.065, 8]} />
        <meshStandardMaterial color="#2a2040" roughness={0.7} />
      </mesh>
    </group>
  );
}

function DigitalClock() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 48;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0a0510'; ctx.fillRect(0, 0, 128, 48);
    ctx.font = 'bold 28px monospace'; ctx.fillStyle = '#22d3ee';
    ctx.textAlign = 'center'; ctx.fillText('01:38', 64, 34);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group position={[1.85, 0.7, -2.1]}>
      <mesh><boxGeometry args={[0.2, 0.09, 0.07]} /><meshStandardMaterial color="#12091e" roughness={0.3} metalness={0.3} /></mesh>
      <mesh position={[0, 0, 0.036]}><planeGeometry args={[0.15, 0.055]} /><meshBasicMaterial map={tex} /></mesh>
    </group>
  );
}

function DeskLamp() {
  return (
    <group position={[1.85, 0.7, -2.4]}>
      <mesh><cylinderGeometry args={[0.06, 0.07, 0.02, 8]} /><meshStandardMaterial color="#2a2040" metalness={0.5} roughness={0.3} /></mesh>
      <mesh position={[0, 0.22, -0.05]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.4, 4]} /><meshStandardMaterial color="#3a3060" metalness={0.6} /></mesh>
      <pointLight position={[0, 0.36, -0.1]} color="#fbbf24" intensity={0.3} distance={0.8} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   DUST PARTICLES (GPU instanced, no per-frame JS)
   ═══════════════════════════════════════════════════════════ */
function DustParticles({ count = 80 }) {
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

  // Minimal animation - only update every 3rd frame
  const frameCount = useRef(0);
  useFrame(({ clock }) => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0 || !ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.15 + i) * 0.0004;
      arr[i * 3] += Math.cos(t * 0.1 + i * 0.5) * 0.0003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#c084fc" size={0.004} sizeAttenuation transparent opacity={0.2} />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAMERA RIG - optimized lerp with dead zone
   ═══════════════════════════════════════════════════════════ */
function CameraRig({ scrollProgressRef }) {
  const { camera } = useThree();
  const tPos = useRef(new THREE.Vector3(3.2, 3.0, 3.2));
  const tLook = useRef(new THREE.Vector3(-0.3, 1.0, -1.8));
  const cLook = useRef(new THREE.Vector3(-0.3, 1.0, -1.8));

  useFrame(() => {
    const t = scrollProgressRef?.current || 0;

    // Compute target positions
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
   ═══════════════════════════════════════════════════════════ */
const HackerRoom = React.memo(({ scrollProgressRef }) => {
  return (
    <>
      <CameraRig scrollProgressRef={scrollProgressRef} />

      {/* Bake shadows once - never recompute */}
      <BakeShadows />

      {/* LIGHTING - 3 lights total */}
      <ambientLight intensity={1.2} color="#4a3070" />
      <directionalLight position={[0, 4, -1]} color="#7c3aed" intensity={2} castShadow shadow-mapSize={[512, 512]} />
      <pointLight position={[0, 2, -1.5]} color="#a855f7" intensity={2} distance={5} />

      {/* STATIC SCENE - frozen matrix updates */}
      <Static>
        <RoomShell />
        <LeftWallWithWindow />
        <FloorRug />
        <Desk />
        <Chair position={[0, 0, -0.6]} />
        <HackerFigure position={[0, 0, -0.65]} />
        <Monitor position={[0, 1.58, -2.3]} width={1.4} height={0.85} color="#a855f7" isMain />
        <Monitor position={[-1.15, 1.48, -2.15]} rotation={[0, 0.3, 0]} width={0.85} height={0.55} color="#667eea" />
        <Monitor position={[1.15, 1.48, -2.15]} rotation={[0, -0.3, 0]} width={0.85} height={0.55} color="#667eea" />
        <Keyboard position={[0, 0.8, -2.05]} />
        <RoomProps />
      </Static>

      {/* DYNAMIC - only particles animate */}
      <DustParticles count={80} />

      <fog attach="fog" args={['#0a0518', 8, 18]} />
    </>
  );
});

export default HackerRoom;
