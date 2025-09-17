import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const CyberCube = () => {
  const meshRef = useRef();
  const groupRef = useRef();
  
  // Create a custom shader material for the cyber cube
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  const fragmentShader = `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      // Create animated gradient based on UV coordinates and time
      float gradient = sin(vUv.x * 3.14159 + time) * 0.5 + 0.5;
      gradient += sin(vUv.y * 3.14159 + time * 0.7) * 0.3 + 0.3;
      gradient = gradient * 0.5;
      
      // Mix between three colors
      vec3 color;
      if (gradient < 0.33) {
        color = mix(color1, color2, gradient * 3.0);
      } else if (gradient < 0.66) {
        color = mix(color2, color3, (gradient - 0.33) * 3.0);
      } else {
        color = mix(color3, color1, (gradient - 0.66) * 3.0);
      }
      
      // Add wireframe effect
      float wireframe = 1.0 - smoothstep(0.0, 0.02, min(min(vUv.x, vUv.y), min(1.0 - vUv.x, 1.0 - vUv.y)));
      
      // Add glow effect
      float glow = sin(vPosition.x * 10.0 + time) * sin(vPosition.y * 10.0 + time) * sin(vPosition.z * 10.0 + time);
      glow = glow * 0.1 + 0.9;
      
      // Final color with wireframe and glow
      vec3 finalColor = color * glow;
      finalColor = mix(finalColor, vec3(1.0), wireframe * 0.3);
      
      gl_FragColor = vec4(finalColor, 0.8);
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = state.clock.getElapsedTime();
    }
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            time: { value: 0 },
            color1: { value: new THREE.Color(0x667eea) }, // Blue
            color2: { value: new THREE.Color(0x764ba2) }, // Purple
            color3: { value: new THREE.Color(0xf093fb) }  // Pink
          }}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner rotating cube */}
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial
          color="#ff6b6b"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Outer wireframe */}
      <mesh>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshBasicMaterial
          color="#667eea"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      
      {/* Floating particles around the cube */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 4) * 4,
          Math.sin(i * Math.PI / 4) * 4,
          Math.sin(i * Math.PI / 2) * 2
        ]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#667eea" : "#f093fb"}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

export default CyberCube;
