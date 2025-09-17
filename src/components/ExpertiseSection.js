import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import Reveal from './Reveal';
import Sparkline from './Sparkline';
import { getFeaturedSkills } from '../data/skills';

const Section = styled.section`
  padding: var(--section-padding);
  background: var(--bg-secondary);
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
  background: var(--gradient-secondary);
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
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const SkillCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 40px 30px;
  text-align: center;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: var(--transition-slow);
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SkillIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  animation: iconFloat 3s ease-in-out infinite;
  
  @keyframes iconFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const SkillTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-primary);
`;

const SkillDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 25px;
  font-size: 14px;
`;

const SkillBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const SkillProgress = styled(motion.div)`
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 3px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ExpertiseSection = () => {
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

  const skills = getFeaturedSkills();

  return (
    <Section id="expertise" ref={ref}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionTitle>
            <TitleIcon>🧩</TitleIcon>
            Expertise
          </SectionTitle>

          <SkillsGrid>
            {skills.map((skill, index) => (
              <Reveal key={skill.title} delay={index * 0.06}>
                <SkillCard
                  variants={containerVariants}
                  whileHover={hoverVariants}
                  whileTap={tapVariants}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SkillIcon style={{ color: skill.color }}>
                    {skill.icon}
                  </SkillIcon>
                  <SkillTitle>{skill.title}</SkillTitle>
                  <SkillDescription>{skill.description}</SkillDescription>
                  <Sparkline data={skill.trend} colorStart={skill.color} colorEnd={`${skill.color}`} />
                  <SkillBar>
                    <SkillProgress
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ duration: 2, delay: index * 0.2 }}
                      style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)` }}
                    />
                  </SkillBar>
                </SkillCard>
              </Reveal>
            ))}
          </SkillsGrid>
        </motion.div>
      </Container>
    </Section>
  );
};

export default ExpertiseSection;
