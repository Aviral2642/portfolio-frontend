import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [gradientIntensity, setGradientIntensity] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [particleDensity, setParticleDensity] = useState(1);

  useEffect(() => {
    // Load theme preferences from localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    const savedGradientIntensity = localStorage.getItem('portfolio-gradient-intensity');
    const savedAnimationSpeed = localStorage.getItem('portfolio-animation-speed');
    const savedParticleDensity = localStorage.getItem('portfolio-particle-density');

    if (savedTheme) setTheme(savedTheme);
    if (savedGradientIntensity) setGradientIntensity(parseFloat(savedGradientIntensity));
    if (savedAnimationSpeed) setAnimationSpeed(parseFloat(savedAnimationSpeed));
    if (savedParticleDensity) setParticleDensity(parseFloat(savedParticleDensity));
  }, []);

  useEffect(() => {
    // Save theme preferences to localStorage
    localStorage.setItem('portfolio-theme', theme);
    localStorage.setItem('portfolio-gradient-intensity', gradientIntensity.toString());
    localStorage.setItem('portfolio-animation-speed', animationSpeed.toString());
    localStorage.setItem('portfolio-particle-density', particleDensity.toString());
  }, [theme, gradientIntensity, animationSpeed, particleDensity]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateGradientIntensity = (intensity) => {
    setGradientIntensity(Math.max(0.1, Math.min(2, intensity)));
  };

  const updateAnimationSpeed = (speed) => {
    setAnimationSpeed(Math.max(0.1, Math.min(3, speed)));
  };

  const updateParticleDensity = (density) => {
    setParticleDensity(Math.max(0.1, Math.min(2, density)));
  };

  const resetSettings = () => {
    setTheme('dark');
    setGradientIntensity(1);
    setAnimationSpeed(1);
    setParticleDensity(1);
  };

  const value = {
    theme,
    gradientIntensity,
    animationSpeed,
    particleDensity,
    toggleTheme,
    updateGradientIntensity,
    updateAnimationSpeed,
    updateParticleDensity,
    resetSettings,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
