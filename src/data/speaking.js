export const speaking = [
  {
    id: 1,
    title: 'Hacking Neural Networks: The Hidden Vulnerabilities of AI Systems',
    conference: 'BSidesChicago 2024',
    date: '2024-09-15',
    location: 'Chicago, IL',
    description: 'Exploring vulnerabilities in neural network architectures and training processes',
    type: 'talk',
    featured: true,
    slidesUrl: '#',
    videoUrl: '#'
  },
  {
    id: 2,
    title: 'Filling Gaps in AI Governance: How ISO/IEC 42001 Shapes the Future of AI Risk and Compliance',
    conference: 'BSidesSLC 2025',
    date: '2025-02-20',
    location: 'Salt Lake City, UT',
    description: 'Understanding AI governance frameworks and their impact on security practices',
    type: 'talk',
    featured: true,
    slidesUrl: '#',
    videoUrl: '#'
  },
  {
    id: 3,
    title: 'Weaponizing AI: Adversarial Attacks, Hallucinations, and the Offensive Security Frontier',
    conference: 'CactusCon 13 (2025)',
    date: '2025-01-25',
    location: 'Phoenix, AZ',
    description: 'Advanced techniques for exploiting AI systems in offensive security operations',
    type: 'workshop',
    featured: true,
    slidesUrl: '#',
    videoUrl: '#'
  },
  {
    id: 4,
    title: 'Deceiving the Deceivers: Offensive Security Strategies for Adversarial AI Attacks',
    conference: 'Cyphercon 2025',
    date: '2025-03-10',
    location: 'Milwaukee, WI',
    description: 'Counter-strategies for defending against AI-powered attacks',
    type: 'talk',
    featured: false,
    slidesUrl: '#',
    videoUrl: '#'
  }
];

export const getFeaturedSpeaking = () => speaking.filter(speak => speak.featured);
export const getSpeakingByType = (type) => speaking.filter(speak => speak.type === type);
export const getSpeakingById = (id) => speaking.find(speak => speak.id === id);
