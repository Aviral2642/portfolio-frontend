import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const meshRef = useRef();
  const particleCount = 2000;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere
      const radius = Math.random() * 20 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Gradient colors from blue to purple to pink
      const colorMix = Math.random();
      let r, g, b;
      
      if (colorMix < 0.33) {
        // Blue to Purple
        const t = colorMix * 3;
        r = 0.4 + t * 0.2;
        g = 0.5 + t * 0.1;
        b = 0.9 - t * 0.2;
      } else if (colorMix < 0.66) {
        // Purple to Pink
        const t = (colorMix - 0.33) * 3;
        r = 0.6 + t * 0.3;
        g = 0.6 + t * 0.1;
        b = 0.7 - t * 0.3;
      } else {
        // Pink to Hot Pink
        const t = (colorMix - 0.66) * 3;
        r = 0.9 + t * 0.1;
        g = 0.7 - t * 0.2;
        b = 0.4 + t * 0.3;
      }
      
      colors[i3] = r;
      colors[i3 + 1] = g;
      colors[i3 + 2] = b;
      
      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5;
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Update positions with velocity and time-based movement
        positions[i3] += particles.velocities[i3] + Math.sin(time + i * 0.01) * 0.001;
        positions[i3 + 1] += particles.velocities[i3 + 1] + Math.cos(time + i * 0.01) * 0.001;
        positions[i3 + 2] += particles.velocities[i3 + 2] + Math.sin(time * 0.5 + i * 0.01) * 0.001;
        
        // Reset particles that go too far
        const distance = Math.sqrt(
          positions[i3] ** 2 + 
          positions[i3 + 1] ** 2 + 
          positions[i3 + 2] ** 2
        );
        
        if (distance > 25) {
          const radius = Math.random() * 5 + 15;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = radius * Math.cos(phi);
        }
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
