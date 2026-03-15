import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { speaking, TOTAL_TALKS } from '../data/speaking';

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  position: relative;
  padding: 100px 24px 80px;
  background: var(--bg-dark);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 0.25em;
  text-align: center;
  color: transparent;
  background: linear-gradient(135deg, var(--purple-light), var(--pink-accent));
  -webkit-background-clip: text;
  background-clip: text;
  margin-bottom: 16px;
`;

const Underline = styled.div`
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, var(--purple-glow), var(--pink-accent));
  border-radius: 2px;
  margin: 0 auto 20px;
`;

const Subtitle = styled.p`
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 50px;
`;

/* Conference logo strip */
const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const LogoStrip = styled.div`
  overflow: hidden;
  margin-bottom: 50px;
  mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
`;

const LogoTrack = styled.div`
  display: flex;
  gap: 48px;
  align-items: center;
  width: max-content;
  animation: ${scroll} 25s linear infinite;
`;

const LogoItem = styled.span`
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
  opacity: 0.5;
  transition: opacity 0.3s;
  &:hover { opacity: 1; }
`;

/* Timeline */
const Timeline = styled.div`
  position: relative;
  padding-left: 32px;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--purple-glow), rgba(168,85,247,0.1));
  }
`;

const TalkCard = styled.div`
  position: relative;
  margin-bottom: 28px;
  padding: 20px 24px;
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.15);
  border-radius: 12px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  animation: neonPulse 5s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};

  &:hover {
    animation: none;
    border-color: var(--purple-glow);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.12);
  }

  /* Timeline dot */
  &::before {
    content: '';
    position: absolute;
    left: -28px;
    top: 26px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--purple-glow);
    box-shadow: 0 0 8px var(--purple-glow);
  }
`;

const TalkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Conference = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cyan-accent);
`;

const Year = styled.span`
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
`;

const TalkTitle = styled.h3`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.5;
`;

const UpcomingBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(168, 85, 247, 0.15);
  color: var(--purple-light);
  border: 1px solid rgba(168, 85, 247, 0.3);
`;

const conferences = ['RSAC', 'ISACA', 'HOPE XV', 'CactusCon', 'CypherCon', 'BSidesChicago', 'BSidesSLC', 'BSidesTC'];

const SpeakingSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
            delay: i * 0.08,
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="speaking" ref={sectionRef}>
      <Container>
        <SectionTitle>TALKS</SectionTitle>
        <Underline />
        <Subtitle>{TOTAL_TALKS} conference talks across RSAC, HOPE, BSides, CactusCon, CypherCon & more</Subtitle>

        <LogoStrip>
          <LogoTrack>
            {[...conferences, ...conferences].map((c, i) => (
              <LogoItem key={i}>{c}</LogoItem>
            ))}
          </LogoTrack>
        </LogoStrip>

        <Timeline>
          {speaking.map((talk, i) => (
            <TalkCard
              key={talk.id}
              ref={el => cardsRef.current[i] = el}
              $delay={`${i * 0.6}s`}
            >
              <TalkHeader>
                <Conference>{talk.conference}</Conference>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {talk.year >= 2026 && <UpcomingBadge>Upcoming</UpcomingBadge>}
                  <Year>{talk.year}</Year>
                </div>
              </TalkHeader>
              <TalkTitle>{talk.title}</TalkTitle>
            </TalkCard>
          ))}
        </Timeline>
      </Container>
    </Section>
  );
};

export default SpeakingSection;
