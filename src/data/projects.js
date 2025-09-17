export const projects = [
  {
    id: 1,
    title: 'AI Attack Mind Map',
    description: 'The world\'s most comprehensive AI security threat atlas covering LLMs, RAG, Agentic AI, RL, diffusion, MLOps, federated learning, and hardware side-channels',
    longDescription: 'A detailed mind map of adversarial techniques, attack surfaces, and pivot paths across modern AI systems with operator-style decision trees inspired by Active Directory attack maps.',
    technologies: ['OPML', 'XMind', 'AI Security', 'Threat Modeling'],
    githubUrl: 'https://github.com/Aviral2642/AI-Attack-Mind-Map-Comprehensive-AI-Security-Threats-Attack-Vectors',
    liveUrl: 'https://github.com/Aviral2642/AI-Attack-Mind-Map-Comprehensive-AI-Security-Threats-Attack-Vectors',
    icon: '🧠',
    featured: true,
    category: 'research',
    status: 'completed'
  },
  {
    id: 2,
    title: 'ZeroDayForge',
    description: 'Advanced red team exploitation framework featuring payload generation, direct syscall injection, protocol fuzzing, and memory manipulation',
    technologies: ['Python', 'Assembly', 'Red Team', 'Exploitation'],
    githubUrl: 'https://github.com/Aviral2642/ZeroDayForge',
    liveUrl: 'https://github.com/Aviral2642/ZeroDayForge',
    icon: '🔨',
    featured: true,
    category: 'cybersecurity',
    status: 'completed'
  },
  {
    id: 3,
    title: 'KernelGhost',
    description: 'Next-generation offensive security framework combining stealthy eBPF-based rootkit capabilities with advanced hypervisor escape techniques',
    technologies: ['eBPF', 'C', 'Kernel', 'Hypervisor'],
    githubUrl: 'https://github.com/Aviral2642/kernelghost',
    liveUrl: 'https://github.com/Aviral2642/kernelghost',
    icon: '👻',
    featured: false,
    category: 'cybersecurity',
    status: 'completed'
  },
  {
    id: 4,
    title: 'Polymorphic Shellcode Engine',
    description: 'Next-generation engine for generating metamorphic shellcode payloads with built-in evasion capabilities for red team operations',
    technologies: ['Python', 'Assembly', 'Evasion', 'Shellcode'],
    githubUrl: 'https://github.com/Aviral2642/Polymorphic-Shellcode-Engine',
    liveUrl: 'https://github.com/Aviral2642/Polymorphic-Shellcode-Engine',
    icon: '🔀',
    featured: false,
    category: 'cybersecurity',
    status: 'completed'
  },
  {
    id: 5,
    title: 'Adversary Emulation Framework',
    description: 'Fully functional framework to simulate real-world threat actor behavior using MITRE ATT&CK techniques for red team assessments',
    technologies: ['Python', 'MITRE ATT&CK', 'APT Simulation', 'Red Team'],
    githubUrl: 'https://github.com/Aviral2642/adversary-emulation-framework',
    liveUrl: 'https://github.com/Aviral2642/adversary-emulation-framework',
    icon: '🛡️',
    featured: false,
    category: 'cybersecurity',
    status: 'completed'
  }
];

export const getFeaturedProjects = () => projects.filter(project => project.featured);
export const getProjectsByCategory = (category) => projects.filter(project => project.category === category);
export const getProjectById = (id) => projects.find(project => project.id === id);
