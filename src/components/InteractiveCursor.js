import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
`;

const Dot = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f093fb;
  box-shadow: 0 0 12px rgba(240, 147, 251, 0.8);
  transform: translate(-50%, -50%);
`;

const Ring = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.8);
  box-shadow: 0 0 24px rgba(102, 126, 234, 0.4);
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, width 0.15s ease, height 0.15s ease, border-color 0.15s ease;
`;

const InteractiveCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
      }
      // Smooth follow for ring
      ringX += (x - ringX) * 0.2;
      ringY += (y - ringY) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
    };

    const raf = () => {
      // keep animation loop minimal – handled in onMove smoothing
      frame = requestAnimationFrame(raf);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const interactive = target.closest('a, button, [role="button"], .btn');
      setIsHoveringInteractive(Boolean(interactive));
    };

    let frame = requestAnimationFrame(raf);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  useEffect(() => {
    if (!ringRef.current) return;
    if (isHoveringInteractive) {
      ringRef.current.style.width = '40px';
      ringRef.current.style.height = '40px';
      ringRef.current.style.borderColor = 'rgba(240, 147, 251, 0.9)';
      ringRef.current.style.transform = 'translate(-50%, -50%) scale(1.06)';
    } else {
      ringRef.current.style.width = '28px';
      ringRef.current.style.height = '28px';
      ringRef.current.style.borderColor = 'rgba(102, 126, 234, 0.8)';
      ringRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }, [isHoveringInteractive]);

  return (
    <Wrap aria-hidden="true">
      <Ring ref={ringRef} />
      <Dot ref={dotRef} />
    </Wrap>
  );
};

export default InteractiveCursor;


