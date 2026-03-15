import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const bootLines = [
  { text: '> INITIALIZING SYSTEM...', delay: 0 },
  { text: '> Loading kernel modules ██████████ OK', delay: 400 },
  { text: '> Mounting encrypted volumes... OK', delay: 800 },
  { text: '> Starting neural interface... OK', delay: 1200 },
  { text: '> Establishing secure tunnel ████ OK', delay: 1600 },
  { text: '> Loading portfolio.exe...', delay: 2000 },
  { text: '> ACCESS GRANTED', delay: 2600 },
];

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.8; }
  94% { opacity: 1; }
  96% { opacity: 0.6; }
  97% { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: var(--bg-void);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.8s ease, transform 0.8s ease;
  opacity: ${p => p.$exiting ? 0 : 1};
  transform: ${p => p.$exiting ? 'scale(1.05)' : 'scale(1)'};
  pointer-events: ${p => p.$exiting ? 'none' : 'all'};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    animation: ${flicker} 4s infinite;
  }
`;

const Scanline = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background: rgba(118, 75, 162, 0.15);
  box-shadow: 0 0 20px rgba(118, 75, 162, 0.3);
  animation: ${scanline} 3s linear infinite;
  pointer-events: none;
`;

const Terminal = styled.div`
  font-family: var(--font-mono);
  font-size: clamp(0.75rem, 1.2vw, 1rem);
  color: var(--purple-light);
  max-width: 600px;
  width: 90%;
`;

const Line = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : 10}px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  color: ${p => p.$isAccess ? '#22d3ee' : 'var(--purple-light)'};
  font-weight: ${p => p.$isAccess ? 700 : 400};
  font-size: ${p => p.$isAccess ? '1.2em' : '1em'};
`;

const ProgressBarWrap = styled.div`
  margin-top: 30px;
  width: 100%;
  height: 2px;
  background: rgba(118, 75, 162, 0.2);
  border-radius: 1px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--purple-deep), var(--pink-accent));
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px var(--purple-glow);
`;

const LoadingScreen = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers = bootLines.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(i + 1);
        setProgress(((i + 1) / bootLines.length) * 100);
      }, line.delay)
    );

    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onComplete(), 800);
    }, 3400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <Overlay $exiting={exiting}>
      <Scanline />
      <Terminal>
        {bootLines.map((line, i) => (
          <Line
            key={i}
            $visible={i < visibleLines}
            $isAccess={line.text.includes('ACCESS')}
          >
            {line.text}
          </Line>
        ))}
        <ProgressBarWrap>
          <ProgressFill $progress={progress} />
        </ProgressBarWrap>
      </Terminal>
    </Overlay>
  );
};

export default LoadingScreen;
