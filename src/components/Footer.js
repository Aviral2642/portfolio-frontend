import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FooterWrapper = styled.footer`
  padding: 40px 0;
  background: var(--bg-void);
  border-top: 1px solid rgba(118, 75, 162, 0.1);
  text-align: center;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
`;

const MainText = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: var(--purple-light);
  }
`;

const SubText = styled.p`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  transition: color 0.3s ease;

  &:hover {
    color: var(--purple-light);
  }
`;

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <FooterWrapper ref={footerRef}>
      <Container>
        <MainText>
          Designed &amp; Built by Aviral Srivastava &copy; {new Date().getFullYear()}
        </MainText>
        <SubText>Crafted with Three.js, GSAP &amp; React</SubText>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
