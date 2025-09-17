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
    level: 90,
    description: 'Adversarial ML, secure LLMs, AI security research, and automated attacks',
    color: '#764ba2',
    category: 'ai',
    featured: true
  },
  {
    id: 3,
    title: 'Red Teaming',
    level: 92,
    description: 'MITRE ATT&CK, APT simulation, and advanced persistent threat emulation',
    color: '#f093fb',
    category: 'cybersecurity',
    featured: true
  },
  {
    id: 4,
    title: 'Cryptography',
    level: 88,
    description: 'Cryptographic protocols, secure implementations, and crypto analysis',
    color: '#51cf66',
    category: 'cybersecurity',
    featured: true
  },
  {
    id: 5,
    title: 'Cloud Security',
    level: 85,
    description: 'AWS security, DevSecOps, container security, and cloud governance',
    color: '#ff6b6b',
    category: 'cloud',
    featured: true
  },
  {
    id: 6,
    title: 'Malware Analysis',
    level: 90,
    description: 'Reverse engineering, static/dynamic analysis, and threat intelligence',
    color: '#ffd43b',
    category: 'cybersecurity',
    featured: false
  },
  {
    id: 7,
    title: 'Python',
    level: 95,
    description: 'Security tool development, automation, and scripting',
    color: '#3776ab',
    category: 'programming',
    featured: false
  },
  {
    id: 8,
    title: 'C/C++',
    level: 85,
    description: 'Low-level programming, kernel development, and system programming',
    color: '#00599c',
    category: 'programming',
    featured: false
  }
];

export const getFeaturedSkills = () => skills.filter(skill => skill.featured);
export const getSkillsByCategory = (category) => skills.filter(skill => skill.category === category);
export const getSkillById = (id) => skills.find(skill => skill.id === id);
