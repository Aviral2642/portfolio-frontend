import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import ScrollExperience from './components/ScrollExperience';
import TerminalEasterEgg from './components/TerminalEasterEgg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const ExploitsPage = lazy(() => import('./pages/Exploits'));

gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('portfolio_loaded');
  });

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('portfolio_loaded', 'true');
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <TerminalEasterEgg />
      <Navigation />
      <ScrollExperience />
    </>
  );
}

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      lerp: 0.08,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const rafCallback = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return (
    <Router>
      <GlobalStyles />
      <div className="grain-overlay" />
      <Suspense fallback={<div style={{ background: '#030108', minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exploits" element={<ExploitsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
