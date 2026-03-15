import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 120px 0;
  background: var(--bg-void);
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 0.3em;
  color: var(--purple-light);
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
  opacity: 0;
  transform: translateY(40px);

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    margin: 20px auto 0;
    background: linear-gradient(90deg, var(--purple-deep), var(--pink-accent));
    border-radius: 2px;
  }
`;

const Heading = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3vw, 2rem);
  font-weight: 700;
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
`;

const TerminalWindow = styled.div`
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.2);
  border-radius: 12px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(40px);
`;

const TerminalHeader = styled.div`
  background: var(--bg-elevated);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(118, 75, 162, 0.15);
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const TerminalTitle = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: 8px;
  letter-spacing: 0.05em;
`;

const TerminalBody = styled.div`
  padding: 28px 24px;
`;

const TerminalLine = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 6px;
  opacity: 0;
  transform: translateX(-20px);
`;

const Prompt = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--purple-glow);
  margin-right: 10px;
  flex-shrink: 0;
  user-select: none;
`;

const Command = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const LinkEntry = styled.a`
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 14px 0;
  text-decoration: none;
  position: relative;
  opacity: 0;
  transform: translateX(-20px);
  border-bottom: 1px solid rgba(118, 75, 162, 0.08);

  &:last-of-type {
    border-bottom: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--purple-glow), var(--pink-accent));
    transition: width 0.4s ease;
  }

  &:hover::after {
    width: 100%;
  }

  &:hover ${Command} {
    color: var(--purple-light);
  }
`;

const LinkLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--cyan-accent);
  min-width: 80px;
  flex-shrink: 0;
  letter-spacing: 0.03em;
`;

const LinkValue = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;

  ${LinkEntry}:hover & {
    color: var(--purple-light);
  }
`;

const Separator = styled.div`
  height: 1px;
  background: rgba(118, 75, 162, 0.12);
  margin: 20px 0;
`;

const ScrollTopButton = styled.button`
  display: block;
  margin: 50px auto 0;
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.2);
  border-radius: 8px;
  padding: 14px 28px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--purple-light);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--purple-glow), var(--pink-accent));
    transition: width 0.4s ease;
  }

  &:hover {
    border-color: var(--purple-glow);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
    color: var(--text-primary);

    &::after {
      width: 100%;
    }
  }
`;

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const ContactSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const headingRef = useRef(null);
  const terminalRef = useRef(null);
  const linesRef = useRef([]);
  const linksRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dramatic title reveal
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Heading reveal
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Terminal window reveal
      gsap.to(terminalRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: terminalRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Terminal lines stagger
      const validLines = linesRef.current.filter(Boolean);
      gsap.to(validLines, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: terminalRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Link entries stagger
      const validLinks = linksRef.current.filter(Boolean);
      gsap.to(validLinks, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.15,
        delay: 0.4,
        scrollTrigger: {
          trigger: terminalRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Scroll-to-top button
      gsap.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="contact" ref={sectionRef}>
      <Container>
        <SectionTitle ref={titleRef}>LET'S CONNECT</SectionTitle>
        <Heading ref={headingRef}>Got a mission? Let's talk.</Heading>

        <TerminalWindow ref={terminalRef}>
          <TerminalHeader>
            <Dot $color="#ff5f57" />
            <Dot $color="#ffbd2e" />
            <Dot $color="#28c940" />
            <TerminalTitle>contact -- zsh</TerminalTitle>
          </TerminalHeader>

          <TerminalBody>
            <TerminalLine ref={(el) => (linesRef.current[0] = el)}>
              <Prompt>~$</Prompt>
              <Command>cat ./contact-info.txt</Command>
            </TerminalLine>

            <Separator />

            <LinkEntry
              href="https://github.com/Aviral2642"
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => (linksRef.current[1] = el)}
            >
              <Prompt>&gt;</Prompt>
              <LinkLabel>github</LinkLabel>
              <LinkValue>github.com/Aviral2642</LinkValue>
            </LinkEntry>

            <LinkEntry
              href="https://linkedin.com/in/aviralsrivastava23"
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => (linksRef.current[2] = el)}
            >
              <Prompt>&gt;</Prompt>
              <LinkLabel>linkedin</LinkLabel>
              <LinkValue>linkedin.com/in/aviralsrivastava23</LinkValue>
            </LinkEntry>

            <LinkEntry
              href="https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => (linksRef.current[3] = el)}
            >
              <Prompt>&gt;</Prompt>
              <LinkLabel>scholar</LinkLabel>
              <LinkValue>scholar.google.com/aviral</LinkValue>
            </LinkEntry>

            <Separator />

            <TerminalLine ref={(el) => (linesRef.current[1] = el)}>
              <Prompt>~$</Prompt>
              <Command>
                <span style={{ color: 'var(--text-muted)' }}>
                  # Typically respond within 24h
                </span>
              </Command>
            </TerminalLine>
          </TerminalBody>
        </TerminalWindow>

        <ScrollTopButton ref={buttonRef} onClick={handleScrollToTop}>
          &gt; cd ~
        </ScrollTopButton>
      </Container>
    </Section>
  );
};

export default ContactSection;
