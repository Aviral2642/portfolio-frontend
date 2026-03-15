import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { awards } from '../data/awards';

gsap.registerPlugin(ScrollTrigger);

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Section = styled.section`
  padding: 120px 0;
  background: var(--bg-dark);
  position: relative;
  overflow: hidden;
  min-height: 80vh;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  text-align: center;
  margin-bottom: 80px;
  letter-spacing: 0.3em;
  color: var(--purple-light);
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
  opacity: 0;
  transform: translateY(40px);

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    margin: 20px auto 0;
    background: linear-gradient(90deg, var(--purple-deep), var(--pink-accent));
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.15);
  border-radius: 16px;
  padding: 36px 28px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(40px);
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;

  ${({ $featured }) =>
    $featured &&
    `
    grid-column: span 2;
    border-color: rgba(168, 85, 247, 0.3);
    background: linear-gradient(
      135deg,
      var(--bg-card) 0%,
      rgba(118, 75, 162, 0.08) 100%
    );

    @media (max-width: 768px) {
      grid-column: span 1;
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--purple-glow),
      #ffd700,
      var(--purple-glow),
      transparent
    );
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: var(--purple-glow);
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.15),
      0 12px 40px rgba(0, 0, 0, 0.4);

    &::before {
      opacity: 1;
      animation: ${shimmer} 2s linear infinite;
    }
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.2), rgba(255, 215, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 20px;

  ${({ $featured }) =>
    $featured &&
    `
    width: 72px;
    height: 72px;
    font-size: 2.4rem;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(168, 85, 247, 0.15));
    border-color: rgba(255, 215, 0, 0.25);
  `}
`;

const AwardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: ${({ $featured }) => ($featured ? '1.2rem' : '1rem')};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: 0.02em;
`;

const Organization = styled.span`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--purple-light);
  display: block;
  margin-bottom: 4px;
`;

const Year = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 14px;
`;

const AwardDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const AwardsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title scroll reveal
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Cards stagger reveal on scroll
      const validCards = cardsRef.current.filter(Boolean);
      gsap.to(validCards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: validCards[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="awards" ref={sectionRef}>
      <Container>
        <SectionTitle ref={titleRef}>RECOGNITION</SectionTitle>

        <Grid>
          {awards.map((award, index) => (
            <Card
              key={award.id}
              $featured={award.featured}
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <IconWrapper $featured={award.featured}>
                {award.icon}
              </IconWrapper>
              <AwardTitle $featured={award.featured}>{award.title}</AwardTitle>
              <Organization>{award.organization}</Organization>
              <Year>{award.year}</Year>
              <AwardDescription>{award.description}</AwardDescription>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default AwardsSection;
