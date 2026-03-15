export const awards = [
  {
    id: 1,
    title: 'RSA Security Scholar 2025',
    organization: 'RSA Conference',
    year: 2025,
    description: 'Selected from 10,000+ applicants for AI x Cybersecurity research. Representing the intersection of AI, cybersecurity, and red teaming at one of the world\'s premier security conferences.',
    category: 'academic',
    featured: true,
    icon: '🏅'
  },
  {
    id: 2,
    title: 'Cybersecurity Innovator of the Year',
    organization: 'BSides',
    year: 2024,
    description: 'Awarded for groundbreaking research in AI security and red teaming',
    category: 'industry',
    featured: true,
    icon: '🥇'
  },
  {
    id: 3,
    title: 'HackTheBox PRO HACKER',
    organization: 'HackTheBox',
    year: 2024,
    description: 'Global Rank: Top 200 | US Rank: #24',
    category: 'competition',
    featured: true,
    icon: '🎯'
  },
  {
    id: 4,
    title: 'Conference Speaker',
    organization: 'Multiple Conferences',
    year: 2025,
    description: 'Invited speaker at RSA, HOPE XV, CypherCon, CactusCon, BSidesChicago, BSidesSLC',
    category: 'speaking',
    featured: true,
    icon: '🎤'
  }
];

export const getFeaturedAwards = () => awards.filter(a => a.featured);
export const getAwardsByCategory = (category) => awards.filter(a => a.category === category);
export const getAwardById = (id) => awards.find(a => a.id === id);
