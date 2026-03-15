import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blogPosts, MEDIUM_PROFILE } from '../data/blog';

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  position: relative;
  padding: 100px 24px 80px;
  background: var(--bg-dark);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 0.25em;
  text-align: center;
  color: transparent;
  background: linear-gradient(135deg, var(--purple-light), var(--cyan-accent));
  -webkit-background-clip: text;
  background-clip: text;
  margin-bottom: 16px;
`;

const Underline = styled.div`
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, var(--purple-glow), var(--cyan-accent));
  border-radius: 2px;
  margin: 0 auto 50px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(118, 75, 162, 0.1);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(118, 75, 162, 0.15);
`;

const PostLink = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: var(--bg-card);
  text-decoration: none;
  transition: background 0.25s ease, transform 0.25s ease;

  &:hover {
    background: var(--bg-elevated);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const PostNumber = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  min-width: 28px;
`;

const PostTitle = styled.span`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-primary);
  flex: 1;
  line-height: 1.4;
`;

const PostTag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--cyan-accent);
  border: 1px solid rgba(34, 211, 238, 0.25);
  background: rgba(34, 211, 238, 0.06);
  white-space: nowrap;
`;

const Arrow = styled.span`
  color: var(--text-muted);
  font-size: 0.85rem;
  transition: transform 0.2s ease, color 0.2s ease;

  ${PostLink}:hover & {
    transform: translateX(4px);
    color: var(--purple-light);
  }
`;

const ViewAll = styled.a`
  display: block;
  text-align: center;
  margin-top: 28px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--purple-light);
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-primary);
  }
`;

const BlogSection = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
            delay: i * 0.05,
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <Section id="blog" ref={sectionRef}>
      <Container>
        <SectionTitle>BLOG</SectionTitle>
        <Underline />

        <List>
          {blogPosts.map((post, i) => (
            <PostLink
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              ref={el => itemsRef.current[i] = el}
            >
              <PostNumber>{String(i + 1).padStart(2, '0')}</PostNumber>
              <PostTitle>{post.title}</PostTitle>
              <PostTag>{post.tag}</PostTag>
              <Arrow>&#8599;</Arrow>
            </PostLink>
          ))}
        </List>

        <ViewAll href={MEDIUM_PROFILE} target="_blank" rel="noopener noreferrer">
          View all posts on Medium &#8594;
        </ViewAll>
      </Container>
    </Section>
  );
};

export default BlogSection;
