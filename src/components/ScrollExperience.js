import React, { useRef, useState, useEffect, useCallback, Suspense, lazy } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFrame, useThree } from '@react-three/fiber';
import HackerRoom from './HackerRoom';

/* ─── Render Controller: pause when tab is hidden ─── */
function RenderController() {
  const { gl } = useThree();
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        gl.setAnimationLoop(null);
      } else {
        gl.setAnimationLoop(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [gl]);
  return null;
}

const AboutSection = lazy(() => import('./AboutSection'));
const ExpertiseSection = lazy(() => import('./ExpertiseSection'));
const ProjectsSection = lazy(() => import('./ProjectsSection'));
const ResearchSection = lazy(() => import('./ResearchSection'));
const ExperienceSection = lazy(() => import('./ExperienceSection'));
const AwardsSection = lazy(() => import('./AwardsSection'));
const BlogSection = lazy(() => import('./BlogSection'));
const SpeakingSection = lazy(() => import('./SpeakingSection'));
const EducationSection = lazy(() => import('./EducationSection'));
const ContactSection = lazy(() => import('./ContactSection'));
const Footer = lazy(() => import('./Footer'));

gsap.registerPlugin(ScrollTrigger);

const RoomTrigger = styled.div`
  height: 350vh;
  position: relative;
`;

const RoomSticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
`;

const CanvasWrap = styled.div`
  position: absolute;
  inset: 0;
`;

const WelcomeOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
`;

const WelcomeText = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5vw, 4rem);
  font-weight: 900;
  text-align: center;
  color: transparent;
  background: linear-gradient(135deg, #a855f7, #667eea, #f093fb);
  -webkit-background-clip: text;
  background-clip: text;
  opacity: 0;
  transform: translateY(30px);
  line-height: 1.2;
  padding: 0 20px;
  text-shadow: none;
  filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.3));
`;

const WelcomeSub = styled.p`
  font-family: var(--font-mono);
  font-size: clamp(0.8rem, 1.5vw, 1.1rem);
  color: var(--text-secondary);
  opacity: 0;
  transform: translateY(20px);
  margin-top: 16px;
  text-align: center;
  padding: 0 20px;
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  z-index: 2;
  pointer-events: none;
`;

const ScrollLine = styled.div`
  width: 2px;
  height: 50px;
  background: linear-gradient(to bottom, #22d3ee, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);

  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(0.5); }
    50% { opacity: 1; transform: scaleY(1); }
  }
`;

const ScrollLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #22d3ee;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 12px rgba(34, 211, 238, 0.6);
`;

const MonitorTransition = styled.div`
  position: absolute;
  inset: 0;
  background: var(--bg-void);
  opacity: 0;
  z-index: 3;
  pointer-events: none;
`;

const PortfolioContent = styled.div`
  position: relative;
  z-index: 1;
  background: var(--bg-void);
`;

const ScrollExperience = () => {
  // Use ref instead of state to avoid React re-renders on scroll
  const scrollProgressRef = useRef(0);
  const [, forceRender] = useState(0);
  const triggerRef = useRef(null);
  const welcomeRef = useRef(null);
  const welcomeSubRef = useRef(null);
  const scrollHintRef = useRef(null);
  const transitionRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const lastRafProgress = useRef(0);

  // Memoized scroll handler - direct DOM manipulation, no React state
  const handleScroll = useCallback((self) => {
    const p = self.progress;
    scrollProgressRef.current = p;

    // Direct DOM updates (bypass React reconciler)
    const wOpacity = Math.max(0, 1 - p * 5);
    if (welcomeRef.current) {
      welcomeRef.current.style.opacity = wOpacity;
      welcomeRef.current.style.transform = `translate3d(0,${-p * 100}px,0)`;
    }
    if (welcomeSubRef.current) welcomeSubRef.current.style.opacity = wOpacity;
    if (scrollHintRef.current) scrollHintRef.current.style.opacity = Math.max(0, wOpacity - 0.3);
    if (transitionRef.current) {
      const tOpacity = p > 0.75 ? (p - 0.75) / 0.25 : 0;
      transitionRef.current.style.opacity = tOpacity;
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Welcome text animation - instant on return visits, delayed on first visit
      const introDelay = sessionStorage.getItem('portfolio_loaded') ? 0.3 : 3.8;
      const welcomeTl = gsap.timeline();
      welcomeTl
        .to(welcomeRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: introDelay })
        .to(welcomeSubRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to(scrollHintRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');

      // Main scroll trigger - uses callback ref, not setState
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: handleScroll,
      });
    });

    // Force one render so Canvas gets initial progress
    forceRender(1);

    return () => ctx.revert();
  }, [handleScroll]);

  return (
    <>
      {/* ─── 3D Room Section ─── */}
      <RoomTrigger ref={triggerRef}>
        <RoomSticky>
          <CanvasWrap>
            <Canvas
              camera={{ position: [4, 3.5, 5], fov: 45 }}
              gl={(canvas) => {
                const gl = new THREE.WebGLRenderer({
                  canvas,
                  antialias: false,
                  alpha: true,
                  powerPreference: 'high-performance',
                  stencil: false,
                  depth: true,
                  failIfMajorPerformanceCaveat: false,
                  preserveDrawingBuffer: false,
                });
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.6;
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = THREE.BasicShadowMap;
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                // Safari optimization: disable logarithmic depth buffer
                gl.logarithmicDepthBuffer = false;
                return gl;
              }}
              dpr={[1, 1.5]}
              frameloop="always"
            >
              <Suspense fallback={null}>
                <HackerRoom scrollProgressRef={scrollProgressRef} />
                <RenderController />
              </Suspense>
            </Canvas>
          </CanvasWrap>

          <WelcomeOverlay>
            <WelcomeText ref={welcomeRef}>
              Welcome to my world.
            </WelcomeText>
            <WelcomeSub ref={welcomeSubRef}>
              I'm Aviral — Security Engineer & Offensive AI Researcher
            </WelcomeSub>
          </WelcomeOverlay>

          <ScrollHint ref={scrollHintRef}>
            <ScrollLabel>Scroll to enter</ScrollLabel>
            <ScrollLine />
          </ScrollHint>

          <MonitorTransition ref={transitionRef} />
        </RoomSticky>
      </RoomTrigger>

      {/* ─── Portfolio Sections ─── */}
      <PortfolioContent>
        <Suspense fallback={null}>
          <AboutSection />
          <ExpertiseSection />
          <ProjectsSection />
          <ExperienceSection />
          <SpeakingSection />
          <ResearchSection />
          <BlogSection />
          <EducationSection />
          <AwardsSection />
          <ContactSection />
          <Footer />
        </Suspense>
      </PortfolioContent>
    </>
  );
};

export default ScrollExperience;
