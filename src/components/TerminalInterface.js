import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  max-width: 800px;
  margin: 40px auto;
`;

const TerminalHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TerminalButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color || '#ff5f57'};
`;

const TerminalTitle = styled.div`
  color: white;
  font-weight: 600;
  margin-left: 10px;
`;

const TerminalBody = styled.div`
  padding: 20px;
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  background: #0a0a0a;
`;

const TerminalLine = styled(motion.div)`
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const Prompt = styled.span`
  color: #667eea;
  font-weight: bold;
  flex-shrink: 0;
`;

const Command = styled.span`
  color: #f093fb;
  font-weight: 500;
`;

const Output = styled.span`
  color: #e0e0e0;
  white-space: pre-wrap;
`;

const Error = styled.span`
  color: #ff6b6b;
`;

const Success = styled.span`
  color: #51cf66;
`;

const Cursor = styled(motion.span)`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #667eea;
  margin-left: 2px;
`;

const TerminalInterface = () => {
  const [lines, setLines] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef(null);
  const [commandIndex, setCommandIndex] = useState(0);

  const commands = [
    {
      command: 'whoami',
      output: 'aviral-srivastava\nSecurity Engineer @ Amazon\nRSA Security Scholar 2025\nOffensive AI Researcher'
    },
    {
      command: 'ls -la /skills/',
      output: 'drwxr-xr-x 8 root root 4096 Jan 2025 .\ndrwxr-xr-x 3 root root 4096 Jan 2025 ..\n-rw-r--r-- 1 root root 2048 Jan 2025 offensive-security\n-rw-r--r-- 1 root root 1536 Jan 2025 ai-cybersecurity\n-rw-r--r-- 1 root root 1024 Jan 2025 red-teaming\n-rw-r--r-- 1 root root 1280 Jan 2025 cryptography\n-rw-r--r-- 1 root root 1024 Jan 2025 cloud-security\n-rw-r--r-- 1 root root 1536 Jan 2025 malware-analysis'
    },
    {
      command: 'cat /achievements/rsa-scholar.txt',
      output: 'RSA Security Scholar 2025\n========================\n\nSelected from 10,000+ applicants\nFocus: AI x Cybersecurity intersection\nResearch: LLM Unlearning & Adversarial ML\nConference: RSA 2025, San Francisco\n\nImpact: Shaping the future of AI security'
    },
    {
      command: 'git log --oneline -5',
      output: 'a1b2c3d ZeroDayForge v2.1 - Enhanced LLM exploit generation\nf4e5d6c KernelGhost - eBPF rootkit framework\ng7h8i9j AI-RedTeam - Automated payload crafting\nk1l2m3n D-POM - Dynamic path obfuscation\np5q6r7s CTF-Engine - Interactive challenge platform'
    },
    {
      command: 'curl -s https://api.github.com/users/Aviral2642 | jq .public_repos',
      output: '47\n\nActive repositories:\n- ZeroDayForge (2.1k stars)\n- AI-RedTeam (1.8k stars)\n- KernelGhost (1.2k stars)\n- CTF-Challenges (890 stars)'
    },
    {
      command: 'nmap -sS --script vuln target.com',
      output: 'Starting Nmap 7.94\nHost is up (0.045s latency).\n\nPORT     STATE SERVICE    VERSION\n22/tcp   open  ssh        OpenSSH 8.2\n80/tcp   open  http       Apache 2.4.41\n443/tcp  open  ssl/http   Apache 2.4.41\n\nVULNERABILITIES:\n- CVE-2021-44228 (Log4j) - CRITICAL\n- CVE-2020-1472 (Zerologon) - HIGH\n- CVE-2019-0708 (BlueKeep) - HIGH\n\nTotal: 3 vulnerabilities found'
    }
  ];

  useEffect(() => {
    const addLine = (line) => {
      setLines(prev => [...prev, line]);
    };

    const typeCommand = async (command, output) => {
      setIsTyping(true);
      
      // Add command line
      addLine({
        type: 'command',
        content: command,
        id: Date.now()
      });

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add output
      addLine({
        type: 'output',
        content: output,
        id: Date.now() + 1
      });

      // Wait before next command
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsTyping(false);
    };

    const runDemo = async () => {
      for (let i = 0; i < commands.length; i++) {
        await typeCommand(commands[i].command, commands[i].output);
      }
      
      // Restart after a pause
      setTimeout(() => {
        setLines([]);
        setCommandIndex(0);
        runDemo();
      }, 5000);
    };

    const timer = setTimeout(runDemo, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const renderLine = (line) => {
    switch (line.type) {
      case 'command':
        return (
          <TerminalLine key={line.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Prompt>aviral@cyber:~$</Prompt>
            <Command>{line.content}</Command>
            {isTyping && <Cursor animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
          </TerminalLine>
        );
      case 'output':
        return (
          <TerminalLine key={line.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Output>{line.content}</Output>
          </TerminalLine>
        );
      default:
        return null;
    }
  };

  return (
    <TerminalContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TerminalHeader>
        <TerminalButton color="#ff5f57" />
        <TerminalButton color="#ffbd2e" />
        <TerminalButton color="#28ca42" />
        <TerminalTitle>aviral@cyber-terminal</TerminalTitle>
      </TerminalHeader>
      <TerminalBody ref={terminalRef}>
        <AnimatePresence>
          {lines.map(renderLine)}
        </AnimatePresence>
        {isTyping && (
          <TerminalLine>
            <Prompt>aviral@cyber:~$</Prompt>
            <Cursor animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          </TerminalLine>
        )}
      </TerminalBody>
    </TerminalContainer>
  );
};

export default TerminalInterface;
