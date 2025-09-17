import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CodeContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.9);
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  margin: 40px 0;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
`;

const CodeHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CodeTitle = styled.div`
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CodeTabs = styled.div`
  display: flex;
  gap: 5px;
`;

const Tab = styled(motion.button)`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
`;

const CodeBody = styled.div`
  padding: 20px;
  background: #0a0a0a;
  min-height: 300px;
  overflow-x: auto;
`;

const CodeLine = styled(motion.div)`
  margin: 2px 0;
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const LineNumber = styled.span`
  color: #666;
  font-size: 12px;
  min-width: 30px;
  text-align: right;
  user-select: none;
`;

const CodeContent = styled.span`
  color: ${props => props.color || '#e0e0e0'};
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
`;

const Keyword = styled.span`
  color: #c792ea;
  font-weight: 500;
`;

const String = styled.span`
  color: #c3e88d;
`;

const Comment = styled.span`
  color: #676e95;
  font-style: italic;
`;

const Function = styled.span`
  color: #82aaff;
  font-weight: 500;
`;

const Variable = styled.span`
  color: #f78c6c;
`;

const CodeSnippets = () => {
  const [activeTab, setActiveTab] = useState(0);

  const snippets = [
    {
      title: 'ZeroDayForge - AI Exploit Generator',
      language: 'python',
      code: [
        { line: 1, content: 'import torch', color: '#c792ea' },
        { line: 2, content: 'from transformers import AutoTokenizer, AutoModel', color: '#c792ea' },
        { line: 3, content: 'import numpy as np', color: '#c792ea' },
        { line: 4, content: '' },
        { line: 5, content: 'class ZeroDayForge:', color: '#82aaff' },
        { line: 6, content: '    """AI-powered exploit generation for red teaming"""', color: '#676e95' },
        { line: 7, content: '    ' },
        { line: 8, content: '    def __init__(self, model_path="microsoft/codebert-base"):', color: '#82aaff' },
        { line: 9, content: '        self.tokenizer = AutoTokenizer.from_pretrained(model_path)', color: '#e0e0e0' },
        { line: 10, content: '        self.model = AutoModel.from_pretrained(model_path)', color: '#e0e0e0' },
        { line: 11, content: '        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")', color: '#e0e0e0' },
        { line: 12, content: '' },
        { line: 13, content: '    def generate_exploit(self, target_info, vuln_type):', color: '#82aaff' },
        { line: 14, content: '        """Generate exploit based on target and vulnerability"""', color: '#676e95' },
        { line: 15, content: '        prompt = f"Generate {vuln_type} exploit for {target_info}"', color: '#c3e88d' },
        { line: 16, content: '        ' },
        { line: 17, content: '        inputs = self.tokenizer(prompt, return_tensors="pt")', color: '#e0e0e0' },
        { line: 18, content: '        with torch.no_grad():', color: '#c792ea' },
        { line: 19, content: '            outputs = self.model.generate(', color: '#e0e0e0' },
        { line: 20, content: '                inputs.input_ids,', color: '#e0e0e0' },
        { line: 21, content: '                max_length=512,', color: '#e0e0e0' },
        { line: 22, content: '                temperature=0.7,', color: '#e0e0e0' },
        { line: 23, content: '                do_sample=True', color: '#e0e0e0' },
        { line: 24, content: '            )', color: '#e0e0e0' },
        { line: 25, content: '        ' },
        { line: 26, content: '        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)', color: '#e0e0e0' }
      ]
    },
    {
      title: 'KernelGhost - eBPF Rootkit',
      language: 'c',
      code: [
        { line: 1, content: '#include <linux/bpf.h>', color: '#c792ea' },
        { line: 2, content: '#include <linux/if_ether.h>', color: '#c792ea' },
        { line: 3, content: '#include <linux/ip.h>', color: '#c792ea' },
        { line: 4, content: '#include <bpf/bpf_helpers.h>', color: '#c792ea' },
        { line: 5, content: '' },
        { line: 6, content: 'struct {', color: '#c792ea' },
        { line: 7, content: '    __uint(type, BPF_MAP_TYPE_HASH);', color: '#e0e0e0' },
        { line: 8, content: '    __type(key, __u32);', color: '#e0e0e0' },
        { line: 9, content: '    __type(value, __u64);', color: '#e0e0e0' },
        { line: 10, content: '} hidden_processes SEC(".maps");', color: '#e0e0e0' },
        { line: 11, content: '' },
        { line: 12, content: 'SEC("kprobe/sys_execve")', color: '#c792ea' },
        { line: 13, content: 'int hide_process(struct pt_regs *ctx) {', color: '#82aaff' },
        { line: 14, content: '    __u32 pid = bpf_get_current_pid_tgid() >> 32;', color: '#e0e0e0' },
        { line: 15, content: '    ' },
        { line: 16, content: '    // Check if process should be hidden', color: '#676e95' },
        { line: 17, content: '    __u64 *hidden = bpf_map_lookup_elem(&hidden_processes, &pid);', color: '#e0e0e0' },
        { line: 18, content: '    if (hidden) {', color: '#c792ea' },
        { line: 19, content: '        // Modify process visibility', color: '#676e95' },
        { line: 20, content: '        bpf_override_return(ctx, -ENOENT);', color: '#e0e0e0' },
        { line: 21, content: '    }', color: '#c792ea' },
        { line: 22, content: '    ' },
        { line: 23, content: '    return 0;', color: '#e0e0e0' },
        { line: 24, content: '}', color: '#c792ea' }
      ]
    },
    {
      title: 'AI-RedTeam - Payload Generator',
      language: 'python',
      code: [
        { line: 1, content: 'import openai', color: '#c792ea' },
        { line: 2, content: 'import base64', color: '#c792ea' },
        { line: 3, content: 'import hashlib', color: '#c792ea' },
        { line: 4, content: 'from typing import List, Dict', color: '#c792ea' },
        { line: 5, content: '' },
        { line: 6, content: 'class AIRedTeam:', color: '#82aaff' },
        { line: 7, content: '    """AI-powered red team automation"""', color: '#676e95' },
        { line: 8, content: '    ' },
        { line: 9, content: '    def __init__(self, api_key: str):', color: '#82aaff' },
        { line: 10, content: '        openai.api_key = api_key', color: '#e0e0e0' },
        { line: 11, content: '        self.payload_templates = self._load_templates()', color: '#e0e0e0' },
        { line: 12, content: '' },
        { line: 13, content: '    def generate_payload(self, target_os: str, attack_vector: str) -> str:', color: '#82aaff' },
        { line: 14, content: '        """Generate custom payload for target"""', color: '#676e95' },
        { line: 15, content: '        prompt = f"""', color: '#c3e88d' },
        { line: 16, content: '        Generate a {attack_vector} payload for {target_os}', color: '#c3e88d' },
        { line: 17, content: '        Requirements:', color: '#c3e88d' },
        { line: 18, content: '        - Evade common AV detection', color: '#c3e88d' },
        { line: 19, content: '        - Use polymorphic techniques', color: '#c3e88d' },
        { line: 20, content: '        - Include anti-analysis measures', color: '#c3e88d' },
        { line: 21, content: '        """', color: '#c3e88d' },
        { line: 22, content: '        ' },
        { line: 23, content: '        response = openai.ChatCompletion.create(', color: '#e0e0e0' },
        { line: 24, content: '            model="gpt-4",', color: '#e0e0e0' },
        { line: 25, content: '            messages=[{"role": "user", "content": prompt}],', color: '#e0e0e0' },
        { line: 26, content: '            temperature=0.8', color: '#e0e0e0' },
        { line: 27, content: '        )', color: '#e0e0e0' },
        { line: 28, content: '        ' },
        { line: 29, content: '        return response.choices[0].message.content', color: '#e0e0e0' }
      ]
    }
  ];

  const renderCodeLine = (line) => {
    return (
      <CodeLine
        key={line.line}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: line.line * 0.05 }}
      >
        <LineNumber>{line.line}</LineNumber>
        <CodeContent color={line.color}>{line.content}</CodeContent>
      </CodeLine>
    );
  };

  return (
    <CodeContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <CodeHeader>
        <CodeTitle>
          <span>💻</span>
          {snippets[activeTab].title}
        </CodeTitle>
        <CodeTabs>
          {snippets.map((snippet, index) => (
            <Tab
              key={index}
              active={activeTab === index}
              onClick={() => setActiveTab(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {snippet.language}
            </Tab>
          ))}
        </CodeTabs>
      </CodeHeader>
      <CodeBody>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {snippets[activeTab].code.map(renderCodeLine)}
          </motion.div>
        </AnimatePresence>
      </CodeBody>
    </CodeContainer>
  );
};

export default CodeSnippets;
