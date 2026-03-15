import React, { useState, useEffect, useRef } from 'react';
import GlobalStyles from './styles/GlobalStyles';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import ScrollExperience from './components/ScrollExperience';
import TerminalEasterEgg from './components/TerminalEasterEgg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loading screen once per browser session
    return !sessionStorage.getItem('portfolio_loaded');
  });
  const lenisRef = useRef(null);

  useEffect(() => {
    // Scroll to top on every page load/refresh
    window.scrollTo(0, 0);

    // Initialize Lenis smooth scroll - tuned for buttery performance
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

    // Connect Lenis to GSAP ticker for perfectly synced scroll
    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('portfolio_loaded', 'true');
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <>
      <GlobalStyles />
      <div className="grain-overlay" />
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <TerminalEasterEgg />
      <Navigation />
      <ScrollExperience />
    </>
  );
}

export default App;
