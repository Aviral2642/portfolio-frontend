import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TypingContainer = styled.div`
  position: relative;
  display: inline-block;
  min-height: 1.2em;
`;

const TypingText = styled(motion.span)`
  font-size: 1.2em;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
`;

const Cursor = styled(motion.span)`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: #f093fb;
  margin-left: 2px;
  vertical-align: text-bottom;
`;

const TypingEffect = ({ 
  texts = [
    "Cybersecurity Engineer",
    "Offensive AI Researcher", 
    "Red Team Specialist",
    "RSA Security Scholar 2025",
    "Amazon Security Engineer",
    "AI Security Expert",
    "Zero-Day Hunter",
    "CTF Champion"
  ],
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      const fullText = texts[currentTextIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        
        if (currentText === fullText) {
          setIsPaused(true);
        }
      }
    }, isPaused ? pauseTime : isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentTextIndex, texts, speed, deleteSpeed, pauseTime]);

  return (
    <TypingContainer>
      <TypingText
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentText}
      </TypingText>
      <Cursor
        animate={{ opacity: [1, 0, 1] }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </TypingContainer>
  );
};

export default TypingEffect;
