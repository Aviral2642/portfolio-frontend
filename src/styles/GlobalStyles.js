import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Advanced Gradient Color Palette */
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    --gradient-secondary: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #ff6b6b 100%);
    --gradient-tertiary: linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #ff9a9e 100%);
    --gradient-accent: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
    --gradient-hot: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ffa8a8 100%);
    
    /* Individual Colors */
    --blue-primary: #667eea;
    --blue-secondary: #4facfe;
    --purple-primary: #764ba2;
    --purple-secondary: #a8edea;
    --pink-primary: #f093fb;
    --pink-secondary: #fed6e3;
    --hot-pink: #ff6b6b;
    --hot-pink-light: #ff8e8e;
    
    /* Dark Theme Colors */
    --bg-primary: #0a0a0f;
    --bg-secondary: #111118;
    --bg-tertiary: #1a1a25;
    --bg-card: #0f0f15;
    --bg-hover: #1e1e2a;
    --bg-glass: rgba(15, 15, 21, 0.8);
    
    /* Text Colors */
    --text-primary: #ffffff;
    --text-secondary: #b8b8c8;
    --text-muted: #8a8a9a;
    --text-accent: #667eea;
    
    /* Borders and Effects */
    --border-color: #2a2a3a;
    --border-glow: #667eea;
    --shadow-glow: 0 0 30px rgba(102, 126, 234, 0.3);
    --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.6);
    --shadow-intense: 0 0 50px rgba(102, 126, 234, 0.4);
    
    /* Typography */
    --font-primary: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
    --font-display: 'Orbitron', 'Exo 2', sans-serif;
    --font-body: 'Inter', 'Segoe UI', system-ui, sans-serif;
    
    /* Spacing */
    --section-padding: 120px 0;
    --container-padding: 0 20px;
    --border-radius: 16px;
    --border-radius-lg: 24px;
    
    /* Animations */
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-bounce: 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    /* Z-Index Scale */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
    --z-toast: 1080;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: var(--font-body);
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Hide native cursor on devices with fine pointer (desktops) */
  @media (pointer: fine) {
    body { cursor: none; }
    a, button, [role="button"], .btn { cursor: none; }
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--gradient-primary);
    border-radius: 6px;
    border: 2px solid var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--gradient-secondary);
  }

  /* Selection Styling */
  ::selection {
    background: var(--blue-primary);
    color: var(--text-primary);
  }

  ::-moz-selection {
    background: var(--blue-primary);
    color: var(--text-primary);
  }

  /* Focus Styles */
  *:focus {
    outline: 2px solid var(--blue-primary);
    outline-offset: 2px;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    background: var(--gradient-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  h3 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--text-primary);
  }

  p {
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  a {
    color: var(--blue-primary);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  a:hover {
    color: var(--pink-primary);
    text-shadow: 0 0 10px rgba(240, 147, 251, 0.5);
  }

  /* Button Styles */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition-normal);
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: var(--transition-slow);
    z-index: -1;
  }

  .btn:hover::before {
    left: 100%;
  }

  .btn-primary {
    background: var(--gradient-primary);
    color: var(--text-primary);
    box-shadow: var(--shadow-glow);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-intense);
  }

  .btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 2px solid var(--blue-primary);
  }

  .btn-secondary:hover {
    background: var(--gradient-primary);
    color: var(--text-primary);
    transform: translateY(-2px);
  }

  /* Card Styles */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 2rem;
    transition: var(--transition-normal);
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--gradient-primary);
    opacity: 0;
    transition: var(--transition-normal);
  }

  .card:hover {
    transform: translateY(-8px);
    border-color: var(--blue-primary);
    box-shadow: var(--shadow-glow);
  }

  .card:hover::before {
    opacity: 1;
  }

  /* Glass Morphism */
  .glass {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Gradient Text */
  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-text-secondary {
    background: var(--gradient-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-text-hot {
    background: var(--gradient-hot);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Animation Classes */
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .fade-in-delay-1 {
    animation-delay: 0.2s;
  }

  .fade-in-delay-2 {
    animation-delay: 0.4s;
  }

  .fade-in-delay-3 {
    animation-delay: 0.6s;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-in-left {
    opacity: 0;
    transform: translateX(-50px);
    animation: slideInLeft 0.8s ease-out forwards;
  }

  @keyframes slideInLeft {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .slide-in-right {
    opacity: 0;
    transform: translateX(50px);
    animation: slideInRight 0.8s ease-out forwards;
  }

  @keyframes slideInRight {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .scale-in {
    opacity: 0;
    transform: scale(0.8);
    animation: scaleIn 0.8s ease-out forwards;
  }

  @keyframes scaleIn {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Glitch Effect */
  .glitch {
    position: relative;
  }

  .glitch::before,
  .glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .glitch::before {
    animation: glitch-1 0.3s infinite;
    color: var(--pink-primary);
    z-index: -1;
  }

  .glitch::after {
    animation: glitch-2 0.3s infinite;
    color: var(--blue-primary);
    z-index: -2;
  }

  @keyframes glitch-1 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }

  @keyframes glitch-2 {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(2px, -2px); }
    40% { transform: translate(2px, 2px); }
    60% { transform: translate(-2px, -2px); }
    80% { transform: translate(-2px, 2px); }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    :root {
      --section-padding: 80px 0;
      --container-padding: 0 16px;
    }

    .card {
      padding: 1.5rem;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    :root {
      --section-padding: 60px 0;
    }

    .card {
      padding: 1rem;
    }
  }

  /* Print Styles */
  @media print {
    * {
      background: white !important;
      color: black !important;
    }
  }
`;

export default GlobalStyles;
