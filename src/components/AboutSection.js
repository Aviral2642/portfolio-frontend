import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────── Styled Components ───────────────────────── */

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 120px 24px 100px;
  background: var(--bg-void);
  overflow: hidden;

  /* faint radial glow behind the name */
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 50%;
    width: 800px;
    height: 800px;
    transform: translateX(-50%);
    background: radial-gradient(
      circle,
      rgba(168, 85, 247, 0.08) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

/* ── Name ── */

const NameRow = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.3em;
`;

const NameWord = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, var(--purple-light), var(--blue-accent), var(--pink-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(60px) rotateX(40deg);
  will-change: transform, opacity;
  filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.35));
`;

/* ── Tagline ── */

const Tagline = styled.p`
  font-family: var(--font-mono);
  font-size: clamp(0.75rem, 1.6vw, 1.05rem);
  color: var(--purple-light);
  letter-spacing: 1.5px;
  margin: 0 0 40px;
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, opacity;

  span {
    color: var(--text-muted);
  }
`;

/* ── Bio ── */

const Bio = styled.p`
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 1.4vw, 1.15rem);
  line-height: 1.75;
  color: var(--text-secondary);
  max-width: 720px;
  margin: 0 0 72px;
  opacity: 0;
  transform: translateY(30px);
  will-change: transform, opacity;
`;

/* ── Resume Button ── */

const ResumeButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--cyan-accent);
  padding: 12px 28px;
  border: 1px solid rgba(34, 211, 238, 0.35);
  border-radius: 8px;
  background: rgba(34, 211, 238, 0.06);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(34, 211, 238, 0.12);
    border-color: var(--cyan-accent);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.15);
    color: var(--text-primary);
  }
`;

/* ── Stats Strip ── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 900px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const StatCard = styled.div`
  position: relative;
  padding: 28px 16px;
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid rgba(168, 85, 247, 0.12);
  opacity: 0;
  transform: translateY(40px);
  will-change: transform, opacity;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: var(--purple-glow);
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.15);
  }
`;

const StatValue = styled.span`
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--purple-glow), var(--cyan-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
`;

const StatLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
`;

/* ────────────────────────── Component ──────────────────────────────── */

const STATS = [
  { value: 30, suffix: '+', label: 'Papers Published' },
  { value: 24, prefix: '#', label: 'US Rank — HackTheBox' },
  { value: 6, suffix: 'x', label: 'Security Internships' },
  { value: 6, suffix: '+', label: 'Conference Talks' },
];

const AboutSection = () => {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const bioRef = useRef(null);
  const resumeRef = useRef(null);
  const statsRef = useRef(null);
  const statValueRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Name: split-word stagger ── */
      const words = nameRef.current.querySelectorAll('.name-word');

      gsap.fromTo(
        words,
        { opacity: 0, y: 60, rotateX: 40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: nameRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* ── Tagline ── */
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: taglineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* ── Bio ── */
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* ── Resume button ── */
      gsap.fromTo(
        resumeRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: resumeRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      /* ── Stat cards: slide up stagger ── */
      const cards = statsRef.current.querySelectorAll('.stat-card');

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            onEnter: () => animateCounters(),
          },
        }
      );

      /* ── Counter animation ── */
      function animateCounters() {
        STATS.forEach((stat, i) => {
          const el = statValueRefs.current[i];
          if (!el) return;

          const obj = { val: 0 };
          gsap.to(obj, {
            val: stat.value,
            duration: 2,
            ease: 'power2.out',
            delay: i * 0.15,
            onUpdate() {
              const rounded = Math.round(obj.val);
              el.textContent =
                (stat.prefix || '') + rounded + (stat.suffix || '');
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="about" ref={sectionRef}>
      <Container>
        {/* ── Name ── */}
        <NameRow ref={nameRef}>
          {'AVIRAL SRIVASTAVA'.split(' ').map((word, i) => (
            <NameWord key={i} className="name-word">
              {word}
            </NameWord>
          ))}
        </NameRow>

        {/* ── Tagline ── */}
        <Tagline ref={taglineRef}>
          Security Engineer @ Amazon <span>|</span> RSA Security Scholar 2025{' '}
          <span>|</span> Offensive AI Researcher
        </Tagline>

        {/* ── Bio ── */}
        <Bio ref={bioRef}>
          I break things to make them stronger. From kernel exploits to
          adversarial ML, I operate at the intersection of offensive security
          and artificial intelligence. Currently building security automation at
          Amazon, previously hunting zero-days and publishing at NeurIPS, ICLR,
          and AAAI. Penn State MS grad with a 3.9 GPA and an RSA Security Scholar.
        </Bio>

        {/* ── Buttons ── */}
        <div ref={resumeRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}>
          <ResumeButton href="/resume.pdf" download="Aviral_Srivastava_Resume.pdf">
            &#8595; Download Resume
          </ResumeButton>
          <ResumeButton href="/exploits" style={{ color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.35)', background: 'rgba(255,68,68,0.06)' }}>
            &#9760; Explore My Exploits
          </ResumeButton>
        </div>

        {/* ── Stats ── */}
        <StatsGrid ref={statsRef}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} className="stat-card">
              <StatValue
                ref={(el) => {
                  statValueRefs.current[i] = el;
                }}
              >
                {stat.prefix || ''}0{stat.suffix || ''}
              </StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Container>
    </Section>
  );
};

export default AboutSection;
