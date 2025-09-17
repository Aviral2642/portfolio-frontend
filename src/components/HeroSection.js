import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import TypingEffect from './TypingEffect';

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  padding: 60px 20px 0 20px;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  z-index: 2;
  margin-top: 20px;
`;

const TextContent = styled.div`
  z-index: 10;
  position: relative;
`;


const Title = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 20px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
`;

const Subtitle = styled(motion.div)`
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Separator = styled.span`
  color: var(--blue-primary);
  font-weight: bold;
  
  @media (max-width: 768px) {
    display: none;
  }
`;


const Actions = styled(motion.div)`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;


const HeroSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };


  return (
    <HeroContainer ref={ref}>
      <HeroContent>
        <TextContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div variants={itemVariants}>
              <Title
                whileHover={{ 
                  scale: 1.02,
                  textShadow: "0 0 40px rgba(102, 126, 234, 0.8)"
                }}
              >
                Aviral Srivastava
              </Title>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Subtitle>
                <TypingEffect 
                  texts={[
                    "Cybersecurity Engineer",
                    "Offensive AI Researcher", 
                    "Red Team Specialist",
                    "RSA Security Scholar 2025",
                    "Amazon Security Engineer",
                    "AI Security Expert",
                    "Zero-Day Hunter",
                    "CTF Champion"
                  ]}
                  speed={100}
                  deleteSpeed={50}
                  pauseTime={2000}
                />
              </Subtitle>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Actions>
                <motion.a
                  href="#projects"
                  className="btn btn-primary"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View Projects</span>
                  <span>→</span>
                </motion.a>
                <motion.a
                  href="#contact"
                  className="btn btn-secondary"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "#667eea"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Get In Touch</span>
                  <span>✉</span>
                </motion.a>
              </Actions>
            </motion.div>
          </motion.div>
        </TextContent>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
