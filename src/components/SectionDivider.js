import React from 'react';
import styled from 'styled-components';

const DividerWrap = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  overflow: hidden;
`;

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SectionDivider = ({ flip = false }) => {
  return (
    <DividerWrap aria-hidden="true">
      <Svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d={flip ?
            'M0,64 L80,58.7 C160,53,320,43,480,37.3 C640,32,800,32,960,42.7 C1120,53,1280,75,1360,85.3 L1440,96 L1440,0 L1360,0 C1280,0,1120,0,960,0 C800,0,640,0,480,0 C320,0,160,0,80,0 L0,0 Z'
            :
            'M0,0 L80,10.7 C160,21,320,43,480,53.3 C640,64,800,64,960,53.3 C1120,43,1280,21,1360,10.7 L1440,0 L1440,96 L1360,96 C1280,96,1120,96,960,96 C800,96,640,96,480,96 C320,96,160,96,80,96 L0,96 Z'
          }
          fill="url(#grad)"
          opacity="0.6"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#f093fb" />
          </linearGradient>
        </defs>
      </Svg>
    </DividerWrap>
  );
};

export default SectionDivider;


