import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedSkills } from '../data/skills';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────── Styled Components ───────────────────────── */

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 120px 24px 120px;
  background: var(--bg-dark);
  overflow: hidden;

  /* ambient glow */
  &::before {
    content: '';
    position: absolute;
    bottom: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(
      circle,
      rgba(102, 126, 234, 0.06) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

/* ── Section Title ── */

const TitleWrap = styled.div`
  text-align: center;
  margin-bottom: 80px;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: 0.06em;
  background: linear-gradient(135deg, var(--purple-light), var(--blue-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(50px);
  will-change: transform, opacity;
  filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.25));

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    margin: 20px auto 0;
    background: linear-gradient(90deg, var(--purple-glow), var(--cyan-accent));
    border-radius: 2px;
  }
`;

/* ── Grid ── */

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Card ── */

const Card = styled.div`
  position: relative;
  background: var(--bg-card);
  border: 1px solid rgba(168, 85, 247, 0.1);
  border-radius: 18px;
  padding: 36px 32px 32px;
  opacity: 0;
  transform: translateY(50px);
  will-change: transform, opacity;
  transition: border-color 0.35s, box-shadow 0.35s;

  &:hover {
    border-color: var(--purple-glow);
    box-shadow: 0 0 40px rgba(168, 85, 247, 0.12),
                inset 0 0 40px rgba(168, 85, 247, 0.03);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 14px;
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) =>
    `radial-gradient(circle, ${$color}22, ${$color}08)`};
  border: 1.5px solid ${({ $color }) => `${$color}44`};
  box-shadow: 0 0 20px ${({ $color }) => `${$color}33`},
              inset 0 0 10px ${({ $color }) => `${$color}18`};
  transition: box-shadow 0.35s;

  ${Card}:hover & {
    box-shadow: 0 0 28px ${({ $color }) => `${$color}55`},
                inset 0 0 14px ${({ $color }) => `${$color}28`};
  }

  /* inner dot */
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    box-shadow: 0 0 8px ${({ $color }) => $color};
  }
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.04em;
`;

const CardDesc = styled.p`
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: 22px;
`;

/* ── Progress Bar ── */

const BarTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-elevated);
  overflow: hidden;
  position: relative;
`;

const BarFill = styled.div`
  height: 100%;
  width: 0%;
  border-radius: 3px;
  background: ${({ $color }) =>
    `linear-gradient(90deg, ${$color}, ${$color}88)`};
  position: relative;
  will-change: width;

  /* shimmer */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
    animation: shimmer 2.4s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const BarLabel = styled.span`
  display: block;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 6px;
  opacity: 0;
  will-change: opacity;
`;

/* ────────────────────────── Component ──────────────────────────────── */

const ExpertiseSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const barsRef = useRef([]);
  const labelsRef = useRef([]);

  const skills = getFeaturedSkills();

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Title parallax-style reveal ── */
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* subtle parallax on title while scrolling through section */
      gsap.to(titleRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      /* ── Cards stagger reveal ── */
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      /* ── Progress bars animate to value ── */
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;

        const skill = skills[i];
        if (!skill) return;

        gsap.to(bar, {
          width: `${skill.level}%`,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 92%',
            toggleActions: 'play none none none',
            onEnter: () => {
              /* show percentage label */
              const label = labelsRef.current[i];
              if (label) {
                const obj = { val: 0 };
                gsap.to(label, { opacity: 1, duration: 0.3 });
                gsap.to(obj, {
                  val: skill.level,
                  duration: 1.6,
                  ease: 'power2.out',
                  onUpdate() {
                    label.textContent = `${Math.round(obj.val)}%`;
                  },
                });
              }
            },
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [skills]);

  return (
    <Section id="expertise" ref={sectionRef}>
      <Container>
        {/* ── Title ── */}
        <TitleWrap>
          <SectionTitle ref={titleRef} data-speed="0.9">
            EXPERTISE
          </SectionTitle>
        </TitleWrap>

        {/* ── Skill Cards ── */}
        <SkillsGrid>
          {skills.map((skill, i) => (
            <Card
              key={skill.id}
              className="skill-card"
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
            >
              <CardHeader>
                <IconCircle $color={skill.color} />
                <CardTitle>{skill.title}</CardTitle>
              </CardHeader>

              <CardDesc>{skill.description}</CardDesc>

              <BarLabel
                ref={(el) => {
                  labelsRef.current[i] = el;
                }}
              >
                0%
              </BarLabel>
              <BarTrack>
                <BarFill
                  $color={skill.color}
                  ref={(el) => {
                    barsRef.current[i] = el;
                  }}
                />
              </BarTrack>
            </Card>
          ))}
        </SkillsGrid>
      </Container>
    </Section>
  );
};

export default ExpertiseSection;
