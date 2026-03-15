export const skills = [
  {
    id: 1,
    title: 'Offensive Security',
    level: 95,
    description: 'Red teaming, penetration testing, exploit development, and adversary emulation',
    color: '#667eea',
    category: 'cybersecurity',
    featured: true
  },
  {
    id: 2,
    title: 'AI x Cybersecurity',
    level: 92,
    description: 'Adversarial ML, secure LLMs, AI red teaming, and automated attacks',
    color: '#764ba2',
    category: 'ai',
    featured: true
  },
  {
    id: 3,
    title: 'Red Teaming & Adversary Emulation',
    level: 94,
    description: 'MITRE ATT&CK, APT simulation, and advanced persistent threat emulation',
    color: '#f093fb',
    category: 'cybersecurity',
    featured: true
  },
  {
    id: 4,
    title: 'Symbolic Execution & Fuzzing',
    level: 88,
    description: 'Automated vulnerability discovery, protocol fuzzing, and runtime analysis',
    color: '#22d3ee',
    category: 'cybersecurity',
    featured: true
  },
  {
    id: 5,
    title: 'Cryptography & Secure Coding',
    level: 90,
    description: 'Cryptographic protocols, secure implementations, CTF automation, and crypto analysis',
    color: '#51cf66',
    category: 'cybersecurity',
    featured: true
  },
  {
    id: 6,
    title: 'Cloud Security & DevSecOps',
    level: 85,
    description: 'AWS security, container security, cloud governance, risk & compliance (GRC)',
    color: '#ff6b6b',
    category: 'cloud',
    featured: true
  },
  {
    id: 7,
    title: 'Malware Analysis',
    level: 90,
    description: 'Reverse engineering, static/dynamic analysis, and threat intelligence',
    color: '#ffd43b',
    category: 'cybersecurity',
    featured: false
  },
  {
    id: 8,
    title: 'Python',
    level: 95,
    description: 'Security tool development, automation, ML pipelines, and scripting',
    color: '#3776ab',
    category: 'programming',
    featured: false
  },
  {
    id: 9,
    title: 'C/C++ & Low-Level',
    level: 85,
    description: 'Kernel development, eBPF, system programming, and exploit development',
    color: '#00599c',
    category: 'programming',
    featured: false
  }
];

export const getFeaturedSkills = () => skills.filter(s => s.featured);
export const getSkillsByCategory = (category) => skills.filter(s => s.category === category);
export const getSkillById = (id) => skills.find(s => s.id === id);
