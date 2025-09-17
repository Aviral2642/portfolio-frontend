import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { useAnimation } from 'framer-motion';
import ContactForm from './ContactForm';

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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const InfoCard = styled(motion.div)`
  padding: 30px;
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--blue-primary);
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-primary);
`;

const InfoText = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ContactLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 10px;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: var(--blue-primary);
    transform: translateX(5px);
  }
`;

const LinkIcon = styled.span`
  font-size: 1.5rem;
`;

const LinkText = styled.span`
  font-weight: 600;
`;

const ContactSection = () => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <Section id="contact" ref={ref}>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionTitle>
            <TitleIcon>📧</TitleIcon>
            Contact
          </SectionTitle>

          <ContactGrid>
            <ContactInfo>
              <InfoCard variants={itemVariants}>
                <InfoIcon>💼</InfoIcon>
                <InfoTitle>Let's Work Together</InfoTitle>
                <InfoText>
                  I'm always interested in new opportunities, collaborations, and interesting projects. 
                  Whether you're looking for a security consultant, researcher, or just want to chat about 
                  cybersecurity and AI, I'd love to hear from you.
                </InfoText>
              </InfoCard>

              <InfoCard variants={itemVariants}>
                <InfoIcon>🚀</InfoIcon>
                <InfoTitle>Quick Response</InfoTitle>
                <InfoText>
                  I typically respond to messages within 24 hours. For urgent matters, 
                  feel free to reach out through LinkedIn or GitHub.
                </InfoText>
              </InfoCard>

              <ContactLinks>
                <ContactLink
                  href="mailto:aviral@example.com"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LinkIcon>📧</LinkIcon>
                  <LinkText>aviral@example.com</LinkText>
                </ContactLink>
                
                <ContactLink
                  href="https://linkedin.com/in/aviralsrivastava23"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LinkIcon>💼</LinkIcon>
                  <LinkText>LinkedIn Profile</LinkText>
                </ContactLink>
                
                <ContactLink
                  href="https://github.com/Aviral2642"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LinkIcon>🐙</LinkIcon>
                  <LinkText>GitHub Profile</LinkText>
                </ContactLink>
              </ContactLinks>
            </ContactInfo>

            <motion.div variants={itemVariants}>
              <ContactForm />
            </motion.div>
          </ContactGrid>
        </motion.div>
      </Container>
    </Section>
  );
};

export default ContactSection;