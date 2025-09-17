import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingContainer = styled(motion.div)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-end;
`;

const ActionButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ActionLabel = styled(motion.div)`
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.3);
`;

const MainButton = styled(ActionButton)`
  width: 70px;
  height: 70px;
  font-size: 28px;
  background: linear-gradient(135deg, #f093fb, #667eea);
  box-shadow: 0 12px 40px rgba(240, 147, 251, 0.4);
`;

const FloatingActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredAction, setHoveredAction] = useState(null);

  const actions = [
    {
      icon: '📧',
      label: 'Send Email',
      action: () => window.open('mailto:aviral@example.com'),
      color: '#667eea'
    },
    {
      icon: '💼',
      label: 'Download Resume',
      action: () => window.open('/resume.pdf'),
      color: '#764ba2'
    },
    {
      icon: '💬',
      label: 'LinkedIn',
      action: () => window.open('https://linkedin.com/in/aviralsrivastava23'),
      color: '#f093fb'
    },
    {
      icon: '🐙',
      label: 'GitHub',
      action: () => window.open('https://github.com/Aviral2642'),
      color: '#51cf66'
    }
  ];

  const containerVariants = {
    collapsed: {
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    expanded: {
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    collapsed: {
      scale: 0,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    },
    expanded: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const mainButtonVariants = {
    rotate: isExpanded ? 45 : 0,
    scale: isExpanded ? 1.1 : 1,
    transition: { duration: 0.3 }
  };

  return (
    <FloatingContainer
      variants={containerVariants}
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      <AnimatePresence>
        {isExpanded && actions.map((action, index) => (
          <motion.div
            key={action.label}
            variants={buttonVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            style={{ position: 'relative' }}
            onHoverStart={() => setHoveredAction(action.label)}
            onHoverEnd={() => setHoveredAction(null)}
          >
            <ActionButton
              onClick={action.action}
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                boxShadow: `0 12px 40px ${action.color}40`
              }}
              whileTap={{ scale: 0.9 }}
              style={{ background: `linear-gradient(135deg, ${action.color}, ${action.color}88)` }}
            >
              {action.icon}
            </ActionButton>
            <AnimatePresence>
              {hoveredAction === action.label && (
                <ActionLabel
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {action.label}
                </ActionLabel>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <MainButton
        onClick={() => setIsExpanded(!isExpanded)}
        variants={mainButtonVariants}
        animate={mainButtonVariants}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? '✕' : '⚡'}
      </MainButton>
    </FloatingContainer>
  );
};

export default FloatingActions;
