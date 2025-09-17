import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: radial-gradient(circle, #f093fb 0%, #667eea 100%);
  box-shadow: 0 0 8px rgba(240, 147, 251, 0.6);
`;

const ParticleTrail = () => {
  const [particles, setParticles] = useState([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Create new particle
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        decay: 0.02 + Math.random() * 0.01
      };

      setParticles(prev => [...prev.slice(-20), newParticle]);
    };

    const animate = () => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - particle.decay,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.98
          }))
          .filter(particle => particle.life > 0)
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <ParticleContainer>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          style={{
            left: particle.x,
            top: particle.y,
          }}
          initial={{ 
            scale: 0, 
            opacity: 1 
          }}
          animate={{ 
            scale: [0, 1, 0.5],
            opacity: particle.life,
            x: particle.vx * 10,
            y: particle.vy * 10
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </ParticleContainer>
  );
};

export default ParticleTrail;
