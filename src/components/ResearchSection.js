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
  background: var(--gradient-tertiary);
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
  background: var(--gradient-tertiary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ResearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const ResearchCard = styled(motion.div)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 30px;
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &.featured {
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Venue = styled.span`
  background: var(--purple-primary);
  color: var(--text-primary);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const Status = styled.span`
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  &.published {
    background: var(--primary-green);
    color: var(--text-primary);
  }
  
  &.ongoing {
    background: var(--primary-orange);
    color: var(--text-primary);
  }
`;

const ResearchTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-primary);
`;

const ResearchDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Authors = styled.span`
  color: var(--text-muted);
  font-size: 14px;
`;

const ReadMore = styled(motion.a)`
  color: var(--blue-primary);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-fast);
  
  &:hover {
    text-shadow: 0 0 5px var(--blue-primary);
  }
`;

const ResearchSection = () => {
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

  const research = [
    {
      id: 1,
      title: 'The Fundamental Limits of LLM Unlearning',
      description: 'Complexity-Theoretic Barriers and Provably Optimal Protocols',
      venue: 'ICLR 2025',
      status: 'published',
      authors: 'Co-authored',
      featured: true
    },
    {
      id: 2,
      title: 'Crypto CTF Generation using LLMs',
      description: 'AI-powered challenge generation for security education',
      venue: 'MS Thesis',
      status: 'ongoing',
      authors: 'Thesis Work'
    },
    {
      id: 3,
      title: 'D-POM Framework',
      description: 'Dynamic Path Obfuscation & Monitoring for runtime anti-fuzzing systems',
      venue: 'Research',
      status: 'ongoing',
      authors: 'Lead Researcher'
    }
  ];

  return (
    <Section id="research" ref={ref}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionTitle>
            <TitleIcon>🔬</TitleIcon>
            Research Publications
          </SectionTitle>

          <ResearchGrid>
            {research.map((item, index) => (
              <ResearchCard
                key={item.id}
                className={item.featured ? 'featured' : ''}
                variants={containerVariants}
                whileHover={hoverVariants}
                whileTap={tapVariants}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <Venue>{item.venue}</Venue>
                  <Status className={item.status}>{item.status}</Status>
                </CardHeader>
                
                <ResearchTitle>{item.title}</ResearchTitle>
                <ResearchDescription>{item.description}</ResearchDescription>
                
                <CardFooter>
                  <Authors>{item.authors}</Authors>
                  <ReadMore
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read Paper ↗
                  </ReadMore>
                </CardFooter>
              </ResearchCard>
            ))}
          </ResearchGrid>
        </motion.div>
      </Container>
    </Section>
  );
};

export default ResearchSection;
