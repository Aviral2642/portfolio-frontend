import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
  background: ${p => p.$scrolled ? 'rgba(3, 1, 8, 0.85)' : 'transparent'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(20px)' : 'none'};
  -webkit-backdrop-filter: ${p => p.$scrolled ? 'blur(20px)' : 'none'};

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const Logo = styled.a`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--purple-light);
  text-decoration: none;
  opacity: 0;
  transform: translateY(-20px);

  span {
    color: var(--text-muted);
    font-weight: 400;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  position: relative;
  opacity: 0;
  transform: translateY(-20px);
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--purple-glow);
    transition: width 0.3s ease;
  }

  &:hover {
    color: var(--purple-light);
    &::after { width: 100%; }
  }
`;

const ScrollProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--purple-deep), var(--pink-accent), var(--cyan-accent));
  z-index: 101;
  transform-origin: left;
  transform: scaleX(0);
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate nav items in
      gsap.to(navRef.current.querySelectorAll('a'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 3.8,
      });

      // Scroll progress bar
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
          setScrolled(self.progress > 0.02);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#expertise', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#speaking', label: 'Talks' },
    { href: '#research', label: 'Research' },
    { href: '#blog', label: 'Blog' },
    { href: '#education', label: 'Education' },
    { href: '#awards', label: 'Awards' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      <ScrollProgress ref={progressRef} />
      <Nav ref={navRef} $scrolled={scrolled}>
        <Logo href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }}>
          AVIRAL<span>_</span>
        </Logo>
        <Links>
          {links.map(link => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </Links>
      </Nav>
    </>
  );
};

export default Navigation;
