import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --purple-deep: #764ba2;
    --purple-vivid: #9b59b6;
    --purple-light: #c084fc;
    --purple-glow: #a855f7;
    --blue-accent: #667eea;
    --pink-accent: #f093fb;
    --cyan-accent: #22d3ee;

    --bg-void: #030108;
    --bg-dark: #0a0612;
    --bg-card: #0d0a18;
    --bg-elevated: #150f24;

    --text-primary: #f0eef5;
    --text-secondary: #9b95ab;
    --text-muted: #5a5370;

    --font-display: 'Orbitron', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Inter', system-ui, sans-serif;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  html.lenis, html.lenis body {
    height: auto;
  }

  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }

  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }

  .lenis.lenis-stopped {
    overflow: hidden;
  }

  body {
    font-family: var(--font-body);
    background: var(--bg-void);
    color: var(--text-primary);
    overflow-x: hidden;
  }

  /* GPU-accelerate scrolling sections */
  section {
    will-change: transform;
    transform: translateZ(0);
  }

  /* Neon pulse border on cards */
  @keyframes neonPulse {
    0%, 100% { border-color: rgba(118, 75, 162, 0.2); box-shadow: 0 0 0 rgba(168, 85, 247, 0); }
    50% { border-color: rgba(168, 85, 247, 0.4); box-shadow: 0 0 15px rgba(168, 85, 247, 0.08); }
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-void); }
  ::-webkit-scrollbar-thumb {
    background: var(--purple-deep);
    border-radius: 3px;
  }

  ::selection {
    background: var(--purple-deep);
    color: white;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* Grain overlay */
  .grain-overlay {
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    z-index: 9998;
    pointer-events: none;
    opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    animation: grainShift 8s steps(4) infinite;
  }

  @keyframes grainShift {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(3%, 35%); }
    90% { transform: translate(-10%, 10%); }
  }
`;

export default GlobalStyles;
