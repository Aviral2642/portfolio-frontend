import React, { useMemo } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 28px;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const Line = styled.path`
  fill: none;
  stroke: url(#sparkGrad);
  stroke-width: 2;
  filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.4));
`;

const Area = styled.path`
  fill: url(#sparkArea);
  opacity: 0.25;
`;

const Sparkline = ({ data = [], colorStart = '#667eea', colorEnd = '#f093fb' }) => {
  const points = useMemo(() => {
    const n = data.length;
    if (n === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = Math.max(1, max - min);
    return data
      .map((v, i) => {
        const x = (i / (n - 1)) * 100;
        const y = 100 - ((v - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data]);

  if (!data.length) return null;

  // Build path d attributes
  const dLine = `M ${points.replace(/ /g, ' L ')}`;
  const dArea = `M 0,100 L ${points.replace(/ /g, ' L ')} L 100,100 Z`;

  return (
    <Wrap aria-hidden="true">
      <Svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
          <linearGradient id="sparkArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorStart} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colorEnd} stopOpacity="0" />
          </linearGradient>
        </defs>
        <Area d={dArea} />
        <Line d={dLine} />
      </Svg>
    </Wrap>
  );
};

export default Sparkline;


