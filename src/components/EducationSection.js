import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  position: relative;
  padding: 100px 24px 80px;
  background: var(--bg-void);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 0.25em;
  text-align: center;
  color: transparent;
  background: linear-gradient(135deg, var(--purple-light), var(--blue-accent));
  -webkit-background-clip: text;
  background-clip: text;
  margin-bottom: 16px;
`;

const Underline = styled.div`
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, var(--purple-glow), var(--blue-accent));
  border-radius: 2px;
  margin: 0 auto 60px;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  display: flex;
  gap: 24px;
  padding: 32px;
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.15);
  border-radius: 16px;
  transition: border-color 0.3s ease;
  animation: neonPulse 5s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};

  &:hover {
    animation: none;
    border-color: var(--purple-glow);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
    padding: 24px;
  }
`;

const Icon = styled.div`
  font-size: 2.5rem;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Degree = styled.h3`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

const School = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--purple-light);
  margin-bottom: 8px;
`;

const Details = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const Badge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  color: ${p => p.$color || 'var(--cyan-accent)'};
  border: 1px solid ${p => p.$color || 'var(--cyan-accent)'}40;
  background: ${p => p.$color || 'var(--cyan-accent)'}10;
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const education = [
  {
    icon: '🎓',
    degree: 'MS in Cybersecurity Analytics & Operations',
    school: 'Penn State University',
    gpa: '3.9 GPA',
    year: '2023 — 2024',
    highlights: ['Research Assistant', 'RSA Security Scholar', 'Teaching Assistant — Red Teaming'],
    description: 'Thesis: AI-Generated Cryptographic CTF Challenges. Focus on offensive security, adversarial ML, and applied cryptography.',
  },
  {
    icon: '🎓',
    degree: 'BTech in Computer Science',
    school: 'Amity University',
    gpa: '',
    year: '2019 — 2023',
    highlights: ['Cryptography', 'Network Security', 'Secure Systems'],
    description: 'Focus on cryptography, secure systems, and network security. Published 4 peer-reviewed papers during undergrad.',
  },
];

const EducationSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
            delay: i * 0.15,
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="education" ref={sectionRef}>
      <Container>
        <SectionTitle>EDUCATION</SectionTitle>
        <Underline />

        <Cards>
          {education.map((edu, i) => (
            <Card key={i} ref={el => cardsRef.current[i] = el} $delay={`${i * 1.5}s`}>
              <Icon>{edu.icon}</Icon>
              <Content>
                <Degree>{edu.degree}</Degree>
                <School>{edu.school}</School>
                <Details>
                  <Badge>{edu.year}</Badge>
                  {edu.gpa && <Badge $color="var(--purple-light)">{edu.gpa}</Badge>}
                  {edu.highlights.map((h, j) => (
                    <Badge key={j} $color="var(--pink-accent)">{h}</Badge>
                  ))}
                </Details>
                <Description>{edu.description}</Description>
              </Content>
            </Card>
          ))}
        </Cards>
      </Container>
    </Section>
  );
};

export default EducationSection;
