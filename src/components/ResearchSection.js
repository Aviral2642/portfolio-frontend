import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { research, TOTAL_PAPERS } from '../data/research';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────── styled-components ─────────────────────────── */

const Section = styled.section`
  position: relative;
  background: var(--bg-dark);
  padding: 120px 20px 140px;
  overflow: hidden;

  /* subtle radial gradient behind the cards */
  &::before {
    content: '';
    position: absolute;
    top: 30%;
    left: 50%;
    width: 800px;
    height: 800px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(118, 75, 162, 0.08) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 0.25em;
  text-align: center;
  margin-bottom: 72px;
  position: relative;
  display: inline-block;
  width: 100%;
  color: transparent;
  background: linear-gradient(135deg, var(--purple-light), var(--cyan-accent));
  -webkit-background-clip: text;
  background-clip: text;
  opacity: 0;
  transform: translateY(40px);
`;

const TitleUnderline = styled.span`
  display: block;
  margin: 16px auto 0;
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, var(--purple-glow), var(--cyan-accent));
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: center;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Card = styled.div`
  position: relative;
  background: var(--bg-card);
  border: 1px solid rgba(118, 75, 162, 0.18);
  border-left: 4px solid var(--purple-glow);
  border-radius: 12px;
  padding: 32px 36px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(50px);

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(168, 85, 247, 0.35);
    border-left-color: var(--purple-light);
    box-shadow: 0 8px 40px rgba(168, 85, 247, 0.12),
      0 0 0 1px rgba(168, 85, 247, 0.1);
  }

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
`;

const VenueBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--purple-deep), var(--blue-accent));
  color: var(--text-primary);
`;

const YearBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
`;

const FeaturedBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: 999px;
  color: var(--cyan-accent);
  border: 1px solid var(--cyan-accent);
  background: rgba(34, 211, 238, 0.08);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.2), 0 0 24px rgba(34, 211, 238, 0.08);
  animation: featuredPulse 3s ease-in-out infinite;

  @keyframes featuredPulse {
    0%, 100% {
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.2), 0 0 24px rgba(34, 211, 238, 0.08);
    }
    50% {
      box-shadow: 0 0 18px rgba(34, 211, 238, 0.35), 0 0 40px rgba(34, 211, 238, 0.15);
    }
  }
`;

const StatusBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 999px;
  margin-left: auto;
  color: ${(props) =>
    props.$status === 'completed' || props.$status === 'submitted'
      ? '#4ade80'
      : '#fbbf24'};
  border: 1px solid
    ${(props) =>
      props.$status === 'completed' || props.$status === 'submitted'
        ? 'rgba(74, 222, 128, 0.3)'
        : 'rgba(251, 191, 36, 0.3)'};
  background: ${(props) =>
    props.$status === 'completed' || props.$status === 'submitted'
      ? 'rgba(74, 222, 128, 0.08)'
      : 'rgba(251, 191, 36, 0.08)'};
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
  line-height: 1.4;
  letter-spacing: 0.01em;
`;

const Authors = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 14px;
  font-style: italic;
`;

const Abstract = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const LinkButton = styled.a`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--purple-light);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 8px;
  border: 1px solid rgba(192, 132, 252, 0.2);
  background: rgba(192, 132, 252, 0.06);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(192, 132, 252, 0.15);
    border-color: var(--purple-glow);
    color: var(--text-primary);
    box-shadow: 0 0 12px rgba(168, 85, 247, 0.25);
  }
`;

/* ────────────────────────────── component ──────────────────────────────────── */

const ResearchSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const underlineRef = useRef(null);
  const cardsRef = useRef([]);

  // store card refs
  const setCardRef = (el, i) => {
    if (el) cardsRef.current[i] = el;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── title reveal ───────────────────────────────────────────────── */
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.to(underlineRef.current, {
        scaleX: 1,
        duration: 0.7,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      /* ── card stagger reveal ────────────────────────────────────────── */
      const cards = cardsRef.current.filter(Boolean);

      cards.forEach((card, i) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      /* ── subtle left-border highlight on scroll ─────────────────────── */
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { borderLeftColor: 'rgba(168, 85, 247, 0.4)' },
          {
            borderLeftColor: 'var(--purple-light)',
            duration: 0.5,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="research" ref={sectionRef}>
      <Container>
        {/* ── Title ──────────────────────────────────────────────────────── */}
        <SectionTitle ref={titleRef}>
          RESEARCH
          <TitleUnderline ref={underlineRef} />
        </SectionTitle>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginBottom: '40px',
          marginTop: '-20px',
        }}>
          {TOTAL_PAPERS} peer-reviewed publications &bull; Showing selected highlights &bull;{' '}
          <a href="https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en"
            target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--purple-light)', textDecoration: 'underline' }}>
            View all on Google Scholar
          </a>
        </p>

        {/* ── Cards ──────────────────────────────────────────────────────── */}
        <CardsWrapper>
          {research.map((item, index) => (
            <Card key={item.id} ref={(el) => setCardRef(el, index)}>
              <CardTopRow>
                <VenueBadge>{item.venue}</VenueBadge>
                <YearBadge>{item.year}</YearBadge>
                {item.featured && <FeaturedBadge>Featured</FeaturedBadge>}
                <StatusBadge $status={item.status}>
                  {item.status === 'in-progress' ? 'In Progress' : item.status}
                </StatusBadge>
              </CardTopRow>

              <CardTitle>{item.title}</CardTitle>

              <Authors>
                {Array.isArray(item.authors)
                  ? item.authors.join(', ')
                  : item.authors}
              </Authors>

              <Abstract>{item.abstract || item.description}</Abstract>

              <CardLinks>
                {item.pdfUrl && item.pdfUrl !== '#' && (
                  <LinkButton
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PDF <span>&#8599;</span>
                  </LinkButton>
                )}
                {item.githubUrl && item.githubUrl !== '#' && (
                  <LinkButton
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code <span>&#8599;</span>
                  </LinkButton>
                )}
                {/* Fallback: if both are placeholder '#', show a generic Read More */}
                {((!item.pdfUrl || item.pdfUrl === '#') &&
                  (!item.githubUrl || item.githubUrl === '#')) && (
                  <LinkButton as="span" style={{ cursor: 'default', opacity: 0.5 }}>
                    Coming Soon
                  </LinkButton>
                )}
              </CardLinks>
            </Card>
          ))}
        </CardsWrapper>
      </Container>
    </Section>
  );
};

export default ResearchSection;
