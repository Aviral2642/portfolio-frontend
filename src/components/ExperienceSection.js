import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience } from '../data/experience';

gsap.registerPlugin(ScrollTrigger);

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); }
`;

const Section = styled.section`
  padding: 120px 0;
  background: var(--bg-void);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
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

const Timeline = styled.div`
  position: relative;
  padding: 20px 0;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 3px;
  height: 0;
  background: linear-gradient(
    180deg,
    var(--purple-glow),
    var(--purple-vivid),
    var(--pink-accent)
  );
  transform: translateX(-50%);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.5),
    0 0 30px rgba(168, 85, 247, 0.2);
  border-radius: 2px;

  @media (max-width: 768px) {
    left: 24px;
  }
`;

const TimelineEntry = styled.div`
  display: flex;
  justify-content: ${({ $align }) =>
    $align === 'left' ? 'flex-start' : 'flex-end'};
  padding-bottom: 60px;
  position: relative;
  opacity: 0;
  transform: translateY(50px);

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 60px;
  }
`;

const EntryCard = styled.div`
  width: 45%;
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.2);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    border-color: var(--purple-glow);
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.15),
      0 8px 32px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  top: 36px;
  width: 18px;
  height: 18px;
  background: var(--purple-glow);
  border: 3px solid var(--bg-void);
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.6);

  @media (max-width: 768px) {
    left: 24px;
  }
`;

const LogoCircle = styled.div`
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--purple-deep), var(--blue-accent));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const Position = styled.h3`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  letter-spacing: 0.02em;
`;

const Company = styled.span`
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--purple-light);
`;

const DateRange = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 6px;
  letter-spacing: 0.05em;
`;

const CurrentBadge = styled.span`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--purple-glow);
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid var(--purple-glow);
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.15em;
  margin-left: 8px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Description = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 14px;
`;

const Responsibilities = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 18px 0;
`;

const Responsibility = styled.li`
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: 18px;
  margin-bottom: 6px;
  position: relative;

  &::before {
    content: '>';
    position: absolute;
    left: 0;
    color: var(--purple-glow);
    font-family: var(--font-mono);
    font-weight: 700;
  }
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cyan-accent);
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.03em;
  transition: background 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: rgba(34, 211, 238, 0.15);
    border-color: var(--cyan-accent);
  }
`;

const formatDate = (dateStr) => {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const ExperienceSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const entriesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
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

      // Timeline line draws as user scrolls
      gsap.to(lineRef.current, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 40%',
          end: 'bottom 70%',
          scrub: 0.8,
        },
      });

      // Each entry reveals as timeline reaches it
      entriesRef.current.forEach((entry, i) => {
        if (!entry) return;
        const direction = i % 2 === 0 ? -60 : 60;
        gsap.fromTo(
          entry,
          {
            opacity: 0,
            y: 50,
            x: window.innerWidth > 768 ? direction : 0,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: entry,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="experience" ref={sectionRef}>
      <Container>
        <SectionTitle ref={titleRef}>EXPERIENCE</SectionTitle>

        <Timeline>
          <TimelineLine ref={lineRef} />

          {experience.map((exp, index) => {
            const align = index % 2 === 0 ? 'left' : 'right';
            return (
              <TimelineEntry
                key={exp.id}
                $align={align}
                ref={(el) => (entriesRef.current[index] = el)}
              >
                <TimelineDot />
                <EntryCard>
                  <CardHeader>
                    <LogoCircle>{exp.logo}</LogoCircle>
                    <HeaderInfo>
                      <Position>
                        {exp.position}
                        {exp.current && <CurrentBadge>CURRENT</CurrentBadge>}
                      </Position>
                      <Company>{exp.company}</Company>
                      <DateRange>
                        {formatDate(exp.startDate)} &mdash;{' '}
                        {formatDate(exp.endDate)}
                      </DateRange>
                    </HeaderInfo>
                  </CardHeader>

                  <Description>{exp.description}</Description>

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <Responsibilities>
                      {exp.responsibilities.map((item, ri) => (
                        <Responsibility key={ri}>{item}</Responsibility>
                      ))}
                    </Responsibilities>
                  )}

                  <TechTags>
                    {exp.technologies.map((tech, ti) => (
                      <Tag key={ti}>{tech}</Tag>
                    ))}
                  </TechTags>
                </EntryCard>
              </TimelineEntry>
            );
          })}
        </Timeline>
      </Container>
    </Section>
  );
};

export default ExperienceSection;
