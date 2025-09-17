export const awards = [
  {
    id: 1,
    title: 'RSA Security Scholar 2025',
    organization: 'RSA Conference',
    year: 2025,
    description: 'Selected from 10,000+ applicants for AI x Cybersecurity research',
    category: 'academic',
    featured: true,
    icon: '🏅'
  },
  {
    id: 2,
    title: 'Cybersecurity Innovator of the Year',
    organization: 'BSides Bangalore',
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
    title: 'Conference Speaker Recognition',
    organization: 'Multiple Conferences',
    year: 2024,
    description: 'Invited speaker at RSA, HOPE XV, CypherCon, CactusCon',
    category: 'speaking',
    featured: false,
    icon: '🎤'
  }
];

export const getFeaturedAwards = () => awards.filter(award => award.featured);
export const getAwardsByCategory = (category) => awards.filter(award => award.category === category);
export const getAwardById = (id) => awards.find(award => award.id === id);
