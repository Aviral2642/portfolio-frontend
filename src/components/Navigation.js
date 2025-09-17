import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 0;
  transition: var(--transition-normal);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.div)`
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 10px var(--blue-primary);
  cursor: pointer;
`;

const LogoCursor = styled.span`
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const NavMenu = styled(motion.div)`
  display: flex;
  gap: 40px;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
    flex-direction: column;
    padding: 20px;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    z-index: var(--z-dropdown);
    
    &.active {
      transform: translateY(0);
    }
  }
`;

const NavLink = styled(motion.a)`
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-family: var(--font-primary);
  transition: var(--transition-fast);
  position: relative;
  
  &:hover {
    color: var(--text-accent);
    text-shadow: 0 0 5px var(--blue-primary);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--gradient-primary);
    transition: var(--transition-fast);
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  
  @media (max-width: 768px) {
    display: block;
  }
`;


const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const hoverVariants = {
    scale: 1.05,
    transition: { duration: 0.3 }
  };

  const tapVariants = {
    scale: 0.95,
    transition: { duration: 0.1 }
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#expertise', label: 'Expertise' },
    { href: '#research', label: 'Research' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <NavContainer
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={{
        background: scrolled 
          ? 'rgba(10, 10, 15, 0.98)' 
          : 'rgba(10, 10, 15, 0.95)'
      }}
    >
      <NavContent>
        <Logo
          whileHover={hoverVariants}
          whileTap={tapVariants}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          AVIRAL<LogoCursor>_</LogoCursor>
        </Logo>

        <NavMenu className={isMenuOpen ? 'active' : ''}>
          {navLinks.map((link, index) => (
            <NavLink
              key={link.href}
              href={link.href}
              whileHover={hoverVariants}
              whileTap={tapVariants}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </NavMenu>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MobileMenuButton
            whileHover={hoverVariants}
            whileTap={tapVariants}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </div>
      </NavContent>
    </NavContainer>
  );
};

export default Navigation;
