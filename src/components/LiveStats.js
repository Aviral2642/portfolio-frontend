import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;
  padding: 30px;
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1));
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const StatNumber = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
  opacity: 0.8;
`;

const LiveStats = () => {
  const [stats, setStats] = useState({
    githubStars: 0,
    githubCommits: 0,
    ctfRank: 0,
    papersPublished: 0,
    conferencesSpoken: 0,
    vulnerabilitiesFound: 0,
    toolsCreated: 0,
    certifications: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setStats(prev => ({
        githubStars: Math.min(prev.githubStars + Math.floor(Math.random() * 3), 2500),
        githubCommits: Math.min(prev.githubCommits + Math.floor(Math.random() * 5), 15000),
        ctfRank: Math.max(prev.ctfRank - Math.floor(Math.random() * 2), 24),
        papersPublished: prev.papersPublished,
        conferencesSpoken: prev.conferencesSpoken,
        vulnerabilitiesFound: Math.min(prev.vulnerabilitiesFound + Math.floor(Math.random() * 2), 150),
        toolsCreated: prev.toolsCreated,
        certifications: prev.certifications
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { icon: '⭐', number: stats.githubStars, label: 'GitHub Stars', color: '#f093fb' },
    { icon: '📊', number: stats.githubCommits, label: 'Commits This Year', color: '#667eea' },
    { icon: '🏆', number: `#${stats.ctfRank}`, label: 'HTB Global Rank', color: '#764ba2' },
    { icon: '📚', number: stats.papersPublished, label: 'Research Papers', color: '#f093fb' },
    { icon: '🎤', number: stats.conferencesSpoken, label: 'Conference Talks', color: '#667eea' },
    { icon: '🔍', number: stats.vulnerabilitiesFound, label: 'Vulns Discovered', color: '#764ba2' },
    { icon: '🛠️', number: stats.toolsCreated, label: 'Security Tools', color: '#f093fb' },
    { icon: '🏅', number: stats.certifications, label: 'Certifications', color: '#667eea' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <StatsContainer
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      onViewportEnter={() => setIsVisible(true)}
    >
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.05,
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          <StatIcon>{item.icon}</StatIcon>
          <StatNumber
            key={item.number}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {item.number}
          </StatNumber>
          <StatLabel>{item.label}</StatLabel>
        </StatCard>
      ))}
    </StatsContainer>
  );
};

export default LiveStats;
