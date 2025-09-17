import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { useAnimation } from 'framer-motion';

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
  background: var(--gradient-primary);
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
    background: var(--gradient-secondary);
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

const AwardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const AwardCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 40px 30px;
  text-align: center;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &.featured {
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }
`;

const AwardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  animation: iconFloat 3s ease-in-out infinite;
  
  @keyframes iconFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const AwardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-primary);
`;

const AwardDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const AwardsSection = () => {
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

  const awards = [
    {
      id: 1,
      title: 'RSA Security Scholar 2025',
      description: 'Honored to be selected as a 2025 RSA Security Scholar, representing the intersection of AI, cybersecurity, and red teaming',
      icon: '🏆',
      featured: true
    },
    {
      id: 2,
      title: 'Cybersecurity Innovator of the Year',
      description: 'BSides Bangalore',
      icon: '🥇'
    },
    {
      id: 3,
      title: 'Speaker',
      description: 'RSA, HOPE XV, CypherCon, CactusCon',
      icon: '🎤'
    },
    {
      id: 4,
      title: 'HackTheBox PRO HACKER',
      description: 'Global Rank: Top 200 | 🇺🇸 Rank: #24',
      icon: '👑'
    }
  ];

  return (
    <Section id="awards" ref={ref}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionTitle>
            <TitleIcon>🏆</TitleIcon>
            Awards & Recognition
          </SectionTitle>

          <AwardsGrid>
            {awards.map((award, index) => (
              <AwardCard
                key={award.id}
                className={award.featured ? 'featured' : ''}
                variants={containerVariants}
                whileHover={hoverVariants}
                whileTap={tapVariants}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AwardIcon>{award.icon}</AwardIcon>
                <AwardTitle>{award.title}</AwardTitle>
                <AwardDescription>{award.description}</AwardDescription>
              </AwardCard>
            ))}
          </AwardsGrid>
        </motion.div>
      </Container>
    </Section>
  );
};

export default AwardsSection;
