import React, { createContext, useContext, useState, useEffect } from 'react';

const AnimationContext = createContext();

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationPreset, setAnimationPreset] = useState('cyberpunk');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [particleEffects, setParticleEffects] = useState(true);
  const [glitchEffects, setGlitchEffects] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Load animation preferences from localStorage
    const savedPreset = localStorage.getItem('animation-preset');
    const savedParticleEffects = localStorage.getItem('particle-effects');
    const savedGlitchEffects = localStorage.getItem('glitch-effects');
    const savedSoundEnabled = localStorage.getItem('sound-enabled');

    if (savedPreset) setAnimationPreset(savedPreset);
    if (savedParticleEffects !== null) setParticleEffects(JSON.parse(savedParticleEffects));
    if (savedGlitchEffects !== null) setGlitchEffects(JSON.parse(savedGlitchEffects));
    if (savedSoundEnabled !== null) setSoundEnabled(JSON.parse(savedSoundEnabled));
  }, []);

  useEffect(() => {
    // Save animation preferences to localStorage
    localStorage.setItem('animation-preset', animationPreset);
    localStorage.setItem('particle-effects', particleEffects.toString());
    localStorage.setItem('glitch-effects', glitchEffects.toString());
    localStorage.setItem('sound-enabled', soundEnabled.toString());
  }, [animationPreset, particleEffects, glitchEffects, soundEnabled]);

  const toggleAnimations = () => {
    setIsAnimating(prev => !prev);
  };

  const updateAnimationPreset = (preset) => {
    setAnimationPreset(preset);
  };

  const toggleParticleEffects = () => {
    setParticleEffects(prev => !prev);
  };

  const toggleGlitchEffects = () => {
    setGlitchEffects(prev => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const getAnimationVariants = (type) => {
    if (reducedMotion || !isAnimating) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      };
    }

    const presets = {
      cyberpunk: {
        fadeInUp: {
          hidden: { opacity: 0, y: 50, scale: 0.95 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99]
            }
          }
        },
        slideInLeft: {
          hidden: { opacity: 0, x: -100, rotateY: -15 },
          visible: { 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            transition: {
              duration: 1,
              ease: [0.6, -0.05, 0.01, 0.99]
            }
          }
        },
        slideInRight: {
          hidden: { opacity: 0, x: 100, rotateY: 15 },
          visible: { 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            transition: {
              duration: 1,
              ease: [0.6, -0.05, 0.01, 0.99]
            }
          }
        },
        scaleIn: {
          hidden: { opacity: 0, scale: 0.8, rotateZ: -5 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            rotateZ: 0,
            transition: {
              duration: 0.6,
              ease: [0.68, -0.55, 0.265, 1.55]
            }
          }
        }
      },
      minimal: {
        fadeInUp: {
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
          }
        },
        slideInLeft: {
          hidden: { opacity: 0, x: -30 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5 }
          }
        },
        slideInRight: {
          hidden: { opacity: 0, x: 30 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5 }
          }
        },
        scaleIn: {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.4 }
          }
        }
      },
      futuristic: {
        fadeInUp: {
          hidden: { opacity: 0, y: 100, rotateX: -30 },
          visible: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            transition: {
              duration: 1.2,
              ease: [0.6, -0.05, 0.01, 0.99]
            }
          }
        },
        slideInLeft: {
          hidden: { opacity: 0, x: -150, rotateY: -45, scale: 0.8 },
          visible: { 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            scale: 1,
            transition: {
              duration: 1.5,
              ease: [0.6, -0.05, 0.01, 0.99]
            }
          }
        },
        slideInRight: {
          hidden: { opacity: 0, x: 150, rotateY: 45, scale: 0.8 },
          visible: { 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            scale: 1,
            transition: {
              duration: 1.5,
              ease: [0.6, -0.05, 0.01, 0.99]
            }
          }
        },
        scaleIn: {
          hidden: { opacity: 0, scale: 0.5, rotateZ: -180 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            rotateZ: 0,
            transition: {
              duration: 1,
              ease: [0.68, -0.55, 0.265, 1.55]
            }
          }
        }
      }
    };

    return presets[animationPreset]?.[type] || presets.cyberpunk[type];
  };

  const getHoverVariants = () => {
    if (reducedMotion) {
      return {
        hover: { scale: 1.02 }
      };
    }

    return {
      hover: { 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        transition: { duration: 0.3 }
      }
    };
  };

  const getTapVariants = () => {
    return {
      tap: { scale: 0.95 }
    };
  };

  const value = {
    isAnimating,
    animationPreset,
    reducedMotion,
    particleEffects,
    glitchEffects,
    soundEnabled,
    toggleAnimations,
    updateAnimationPreset,
    toggleParticleEffects,
    toggleGlitchEffects,
    toggleSound,
    getAnimationVariants,
    getHoverVariants,
    getTapVariants
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};
