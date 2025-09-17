import React from 'react';
// import { motion } from 'framer-motion';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 40px 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterText = styled.div`
  p {
    color: var(--text-secondary);
    margin-bottom: 5px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: var(--transition-fast);
    
    &:hover {
      color: var(--blue-primary);
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <FooterText>
            <p>&copy; 2025 Aviral Srivastava. All rights reserved.</p>
            <p>Elite Cybersecurity Engineer | Offensive AI Researcher</p>
          </FooterText>
          
          <FooterLinks>
            <a href="#home">Home</a>
            <a href="#expertise">Expertise</a>
            <a href="#research">Research</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </FooterLinks>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
