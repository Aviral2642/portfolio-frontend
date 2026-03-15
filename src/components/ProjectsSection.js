import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const categoryGradients = {
  research: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
  cybersecurity: 'linear-gradient(135deg, #9b59b6 0%, #f093fb 100%)',
  ai: 'linear-gradient(135deg, #a855f7 0%, #22d3ee 100%)',
  default: 'linear-gradient(135deg, #764ba2 0%, #a855f7 100%)',
};

const Section = styled.section`
  position: relative;
  background: var(--bg-void);
  padding: 100px 24px 80px;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1100px;
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
  margin: 0 auto 60px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.2);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  animation: neonPulse 4s ease-in-out infinite;
  animation-delay: ${() => `${Math.random() * 4}s`};

  &:hover {
    animation: none;
    border-color: var(--purple-glow);
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
    transform: translateY(-4px);
  }

  /* Make featured cards span full width */
  &.featured {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1.2fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const CardHeader = styled.div`
  height: 180px;
  background: ${p => p.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .featured & {
    height: 100%;
    min-height: 220px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        0deg, transparent, transparent 30px,
        rgba(255,255,255,0.03) 30px, rgba(255,255,255,0.03) 31px
      ),
      repeating-linear-gradient(
        90deg, transparent, transparent 30px,
        rgba(255,255,255,0.03) 30px, rgba(255,255,255,0.03) 31px
      );
  }
`;

const CardIcon = styled.span`
  font-size: 3.5rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(0,0,0,0.5);
  color: var(--cyan-accent);
  border: 1px solid var(--cyan-accent);
  z-index: 2;
`;

const CardBody = styled.div`
  flex: 1;
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 16px;
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
`;

const TechTag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--purple-light);
  border: 1px solid rgba(192,132,252,0.25);
  background: rgba(192,132,252,0.06);
`;

const CardLink = styled.a`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--purple-light);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(192,132,252,0.2);
  background: rgba(192,132,252,0.06);
  transition: all 0.25s ease;
  margin-top: auto;
  align-self: flex-start;

  &:hover {
    background: rgba(192,132,252,0.15);
    border-color: var(--purple-glow);
    color: var(--text-primary);
  }
`;

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
            delay: (i % 2) * 0.12,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="projects" ref={sectionRef}>
      <Container>
        <SectionTitle>PROJECTS</SectionTitle>
        <Underline />

        <Grid>
          {projects.map((project, i) => (
            <Card
              key={project.id}
              className={project.featured ? 'featured' : ''}
              ref={el => cardsRef.current[i] = el}
            >
              <CardHeader $gradient={categoryGradients[project.category] || categoryGradients.default}>
                {project.featured && <FeaturedBadge>Featured</FeaturedBadge>}
                <CardIcon>{project.icon}</CardIcon>
              </CardHeader>
              <CardBody>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
                <TechTags>
                  {project.technologies.map((tech, j) => (
                    <TechTag key={j}>{tech}</TechTag>
                  ))}
                </TechTags>
                <CardLink href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub &#8599;
                </CardLink>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default ProjectsSection;
