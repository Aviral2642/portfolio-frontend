import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const scaleOut = keyframes`
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to   { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(3, 1, 8, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: ${({ $closing }) => ($closing ? fadeOut : fadeIn)} 0.25s ease forwards;
`;

const Window = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  z-index: 201;
  max-width: 700px;
  width: 90%;
  background: #0a0612;
  border-radius: 12px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow: 0 0 40px rgba(118, 75, 162, 0.25), 0 0 80px rgba(168, 85, 247, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-mono, 'JetBrains Mono'), 'Fira Code', 'Courier New', monospace;
  animation: ${({ $closing }) => ($closing ? scaleOut : scaleIn)} 0.25s ease forwards;
`;

const Chrome = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #0d0818;
  border-bottom: 1px solid rgba(168, 85, 247, 0.15);
  user-select: none;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const Title = styled.span`
  margin-left: 8px;
  font-size: 13px;
  color: var(--text-primary, #f0eef5);
  opacity: 0.7;
  letter-spacing: 0.5px;
`;

const Body = styled.div`
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary, #f0eef5);
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(168, 85, 247, 0.3);
    border-radius: 3px;
  }
`;

const Line = styled.div`
  white-space: pre-wrap;
  word-break: break-word;

  ${({ $type }) =>
    $type === 'command' &&
    css`
      color: var(--cyan-accent, #22d3ee);
    `}

  ${({ $type }) =>
    $type === 'response' &&
    css`
      color: var(--text-primary, #f0eef5);
      opacity: 0.85;
      padding-left: 4px;
    `}

  ${({ $type }) =>
    $type === 'error' &&
    css`
      color: var(--pink-accent, #f093fb);
    `}

  ${({ $type }) =>
    $type === 'heading' &&
    css`
      color: var(--purple-glow, #a855f7);
      font-weight: 600;
    `}
`;

const InputRow = styled.form`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid rgba(168, 85, 247, 0.15);
  background: #0d0818;
`;

const Prompt = styled.span`
  color: var(--cyan-accent, #22d3ee);
  font-size: 14px;
  font-family: inherit;
  margin-right: 8px;
  user-select: none;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary, #f0eef5);
  font-size: 14px;
  font-family: inherit;
  caret-color: var(--cyan-accent, #22d3ee);

  &::placeholder {
    color: rgba(240, 238, 245, 0.25);
  }
`;

// ---------------------------------------------------------------------------
// Command definitions
// ---------------------------------------------------------------------------

const COMMANDS = {
  help: () => [
    { text: 'Available commands:', type: 'heading' },
    { text: '  help       Show this help message', type: 'response' },
    { text: '  whoami     Who is Aviral?', type: 'response' },
    { text: '  skills     Technical skill set', type: 'response' },
    { text: '  projects   Notable projects', type: 'response' },
    { text: '  contact    Get in touch', type: 'response' },
    { text: '  htb        HackTheBox stats', type: 'response' },
    { text: '  clear      Clear terminal', type: 'response' },
    { text: '  exit       Close terminal', type: 'response' },
  ],

  whoami: () => [
    {
      text: 'Aviral Srivastava \u2014 Security Engineer @ Amazon | RSA Scholar 2025',
      type: 'response',
    },
  ],

  skills: () => [
    { text: 'Technical Skills', type: 'heading' },
    { text: '', type: 'response' },
    { text: '  [Offensive Security]', type: 'heading' },
    { text: '    Penetration Testing \u00b7 Red Teaming \u00b7 Exploit Development', type: 'response' },
    { text: '    Vulnerability Research \u00b7 Reverse Engineering', type: 'response' },
    { text: '', type: 'response' },
    { text: '  [Cloud & Infrastructure]', type: 'heading' },
    { text: '    AWS \u00b7 Azure \u00b7 GCP \u00b7 Kubernetes \u00b7 Docker', type: 'response' },
    { text: '', type: 'response' },
    { text: '  [Languages]', type: 'heading' },
    { text: '    Python \u00b7 Go \u00b7 Rust \u00b7 JavaScript \u00b7 Bash \u00b7 C/C++', type: 'response' },
    { text: '', type: 'response' },
    { text: '  [Tools]', type: 'heading' },
    { text: '    Burp Suite \u00b7 Ghidra \u00b7 Wireshark \u00b7 Metasploit \u00b7 Nmap', type: 'response' },
  ],

  projects: () => [
    { text: 'Notable Projects', type: 'heading' },
    { text: '', type: 'response' },
    { text: '  \u2023 Automated Cloud Security Scanner', type: 'response' },
    { text: '  \u2023 Custom C2 Framework', type: 'response' },
    { text: '  \u2023 Malware Analysis Sandbox', type: 'response' },
    { text: '  \u2023 Network Traffic Anomaly Detector', type: 'response' },
    { text: '  \u2023 Zero-Day Vulnerability PoCs', type: 'response' },
  ],

  contact: () => [
    { text: 'Contact', type: 'heading' },
    { text: '', type: 'response' },
    { text: '  GitHub    https://github.com/aviral', type: 'response' },
    { text: '  LinkedIn  https://linkedin.com/in/aviral-srivastava', type: 'response' },
  ],

  htb: () => [
    {
      text: 'HackTheBox PRO HACKER | Global Rank: Top 200 | US Rank: #24',
      type: 'response',
    },
  ],

  'sudo rm -rf /': () => [
    { text: 'Nice try. \uD83D\uDE0F Access denied.', type: 'error' },
  ],
};

const WELCOME_MESSAGE = [
  { text: "Welcome to Aviral's terminal. Type 'help' for commands.", type: 'response' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TerminalEasterEgg = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');

  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const closingTimerRef = useRef(null);

  // ---- Open / close helpers ------------------------------------------------

  const openTerminal = useCallback(() => {
    setHistory([...WELCOME_MESSAGE]);
    setInput('');
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const closeTerminal = useCallback(() => {
    setIsClosing(true);
    closingTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250); // matches animation duration
  }, []);

  // ---- Global key listener (backtick toggle, Escape close) -----------------

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing inside an input / textarea that is NOT our terminal input
      const tag = e.target.tagName;
      const isOurInput = e.target === inputRef.current;

      if (e.key === '`') {
        if (!isOurInput && (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable)) {
          return; // don't hijack other inputs
        }

        e.preventDefault();

        if (isOpen && !isClosing) {
          closeTerminal();
        } else if (!isOpen) {
          openTerminal();
        }
        return;
      }

      if (e.key === 'Escape' && isOpen && !isClosing) {
        e.preventDefault();
        closeTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing, openTerminal, closeTerminal]);

  // ---- Auto-focus input when terminal opens --------------------------------

  useEffect(() => {
    if (isOpen && !isClosing && inputRef.current) {
      // Small delay so the animation has started and the element is rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  // ---- Auto-scroll to bottom on new history --------------------------------

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  // ---- Cleanup on unmount --------------------------------------------------

  useEffect(() => {
    return () => {
      if (closingTimerRef.current) clearTimeout(closingTimerRef.current);
    };
  }, []);

  // ---- Handle command submission -------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const commandLine = { text: `> ${trimmed}`, type: 'command' };

    // exit
    if (trimmed === 'exit') {
      setHistory((prev) => [...prev, commandLine]);
      setInput('');
      // brief delay so user sees the command echoed
      setTimeout(() => closeTerminal(), 150);
      return;
    }

    // clear
    if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    // known commands
    const handler = COMMANDS[trimmed];
    if (handler) {
      setHistory((prev) => [...prev, commandLine, ...handler()]);
    } else {
      setHistory((prev) => [
        ...prev,
        commandLine,
        {
          text: `Command not found: ${trimmed}. Type 'help' for available commands.`,
          type: 'error',
        },
      ]);
    }

    setInput('');
  };

  // ---- Clicking backdrop closes terminal -----------------------------------

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeTerminal();
    }
  };

  // ---- Render --------------------------------------------------------------

  if (!isOpen) return null;

  return (
    <>
      <Backdrop $closing={isClosing} onClick={handleBackdropClick} />
      <Window $closing={isClosing} role="dialog" aria-label="Terminal">
        {/* Window chrome */}
        <Chrome>
          <Dot $color="#ff5f57" />
          <Dot $color="#febc2e" />
          <Dot $color="#28c840" />
          <Title>aviral@kali:~</Title>
        </Chrome>

        {/* Scrollable history */}
        <Body ref={bodyRef}>
          {history.map((line, idx) => (
            <Line key={idx} $type={line.type}>
              {line.text}
            </Line>
          ))}
        </Body>

        {/* Input */}
        <InputRow onSubmit={handleSubmit} autoComplete="off">
          <Prompt>&gt;</Prompt>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type a command..."
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </InputRow>
      </Window>
    </>
  );
};

export default TerminalEasterEgg;
