import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { experience } from '../data/experience';
import { useAnimation } from 'framer-motion';

const Section = styled.section`
  padding: var(--section-padding);
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled(motion.h2)`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  background: var(--gradient-hot);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: var(--gradient-primary);
    border-radius: 2px;
  }
`;

const TitleIcon = styled.span`
  font-size: 2.5rem;
  margin-right: 20px;
  background: var(--gradient-hot);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ExperienceTimeline = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ExperienceItem = styled(motion.div)`
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
  padding: 30px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &.current {
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ExperienceMarker = styled.div`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--bg-primary);
  animation: markerFloat 3s ease-in-out infinite;
  
  @keyframes markerFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const ExperienceContent = styled.div`
  flex: 1;
`;

const ExperienceHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ExperienceTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 700;
`;

const Company = styled.span`
  color: var(--blue-primary);
  font-weight: 600;
`;

const Duration = styled.span`
  color: var(--text-muted);
  font-size: 14px;
  background: var(--bg-tertiary);
  padding: 5px 12px;
  border-radius: 20px;
`;

const ExperienceDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 15px;
  line-height: 1.6;
`;

const ExperienceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span`
  background: var(--bg-tertiary);
  color: var(--blue-primary);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--blue-primary);
`;

const ExperienceSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
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

  const experiences = [
    {
      id: 1,
      title: 'Security Engineer',
      company: 'Amazon',
      duration: '2025–Present',
      description: 'Red Team Automation, Application security, Secure Coding',
      technologies: ['Red Teaming', 'Automation', 'AppSec'],
      current: true,
      icon: '💼'
    },
    {
      id: 2,
      title: 'Security Internships (6x)',
      company: 'Various Companies',
      duration: '2022–2024',
      description: 'Malware Reverse Engineering, Secure DevOps, GRC',
      technologies: ['Malware Analysis', 'DevSecOps', 'GRC'],
      icon: '🧪'
    },
    {
      id: 3,
      title: 'Teaching Assistant',
      company: 'Penn State University',
      duration: '2023–2024',
      description: 'Led offensive security labs and workshops',
      technologies: ['Red Teaming', 'CTFs', 'Education'],
      icon: '👨‍🏫'
    }
  ];

  return (
    <Section id="experience" ref={ref}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionTitle>
            <TitleIcon>💼</TitleIcon>
            Experience
          </SectionTitle>

          <ExperienceTimeline>
            {experiences.map((exp, index) => (
              <ExperienceItem
                key={exp.id}
                className={exp.current ? 'current' : ''}
                variants={containerVariants}
                whileHover={hoverVariants}
                whileTap={tapVariants}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ExperienceMarker>{exp.icon}</ExperienceMarker>
                
                <ExperienceContent>
                  <ExperienceHeader>
                    <ExperienceTitle>{exp.title}</ExperienceTitle>
                    <Company>{exp.company}</Company>
                    <Duration>{exp.duration}</Duration>
                  </ExperienceHeader>
                  
                  <ExperienceDescription>{exp.description}</ExperienceDescription>
                  
                  <ExperienceTags>
                    {exp.technologies.map((tech, techIndex) => (
                      <Tag key={techIndex}>{tech}</Tag>
                    ))}
                  </ExperienceTags>
                </ExperienceContent>
              </ExperienceItem>
            ))}
          </ExperienceTimeline>
        </motion.div>
      </Container>
    </Section>
  );
};

export default ExperienceSection;
