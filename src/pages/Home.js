import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

// Lazy load heavy components
const HeroSection = lazy(() => import('../components/HeroSection'));
const ParticleField = lazy(() => import('../components/ParticleField'));
const CyberCube = lazy(() => import('../components/CyberCube'));
const Navigation = lazy(() => import('../components/Navigation'));
const ExpertiseSection = lazy(() => import('../components/ExpertiseSection'));
const ProjectsSection = lazy(() => import('../components/ProjectsSection'));
const ResearchSection = lazy(() => import('../components/ResearchSection'));
const ExperienceSection = lazy(() => import('../components/ExperienceSection'));
const AwardsSection = lazy(() => import('../components/AwardsSection'));
const ContactSection = lazy(() => import('../components/ContactSection'));
const Footer = lazy(() => import('../components/Footer'));
const SectionDivider = lazy(() => import('../components/SectionDivider'));
const Reveal = lazy(() => import('../components/Reveal'));
const InteractiveCursor = lazy(() => import('../components/InteractiveCursor'));
const ParticleTrail = lazy(() => import('../components/ParticleTrail'));
const TerminalInterface = lazy(() => import('../components/TerminalInterface'));
const FloatingActions = lazy(() => import('../components/FloatingActions'));

const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
`;

const BackgroundCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

const GradientOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 20% 50%, 
    rgba(102, 126, 234, 0.1) 0%, 
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 20%, 
    rgba(118, 75, 162, 0.1) 0%, 
    transparent 50%
  ),
  radial-gradient(
    circle at 40% 80%, 
    rgba(240, 147, 251, 0.1) 0%, 
    transparent 50%
  );
  z-index: -1;
  pointer-events: none;
`;

const GridOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1;
  pointer-events: none;
  animation: gridMove 30s linear infinite;
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
`;

const LoadingFallback = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingText = styled(motion.div)`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingDots = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: var(--gradient-primary);
  border-radius: 50%;
`;

const Home = () => {
  return (
    <HomeContainer>
      <InteractiveCursor />
      <ParticleTrail />
      <FloatingActions />
      <BackgroundCanvas>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <ParticleField />
            <CyberCube />
            <Environment preset="night" />
            <EffectComposer>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.025}
              />
              <ChromaticAberration
                offset={[0.001, 0.001]}
              />
            </EffectComposer>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </BackgroundCanvas>
      
      <GradientOverlay />
      <GridOverlay />
      
      <Suspense fallback={
        <LoadingFallback
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Loading Elite Portfolio
          </LoadingText>
          <LoadingDots>
            {[0, 1, 2].map((i) => (
              <Dot
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </LoadingDots>
        </LoadingFallback>
      }>
        <Navigation />
        <HeroSection />
        <SectionDivider />
        <Reveal><ExpertiseSection /></Reveal>
        <SectionDivider flip />
        <Reveal><ProjectsSection /></Reveal>
        <SectionDivider />
        <Reveal><TerminalInterface /></Reveal>
        <SectionDivider flip />
        <Reveal><ResearchSection /></Reveal>
        <SectionDivider />
        <Reveal><ExperienceSection /></Reveal>
        <SectionDivider flip />
        <Reveal><AwardsSection /></Reveal>
        <ContactSection />
        <Footer />
      </Suspense>
    </HomeContainer>
  );
};

export default Home;
