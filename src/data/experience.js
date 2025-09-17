export const experience = [
  {
    id: 1,
    company: 'Amazon',
    position: 'Security Engineer',
    location: 'Seattle, WA',
    startDate: '2025-01-01',
    endDate: null,
    current: true,
    description: 'Red Team Automation, Application security, Secure Coding',
    responsibilities: [
      'Developed automated red team tools for internal security assessments',
      'Implemented secure coding practices across multiple development teams',
      'Conducted application security reviews and penetration testing',
      'Built security automation tools using Python and cloud services'
    ],
    technologies: ['Python', 'AWS', 'Docker', 'Kubernetes', 'Security Tools'],
    logo: '🛒'
  },
  {
    id: 2,
    company: 'Penn State University',
    position: 'Teaching Assistant - Red Teaming',
    location: 'State College, PA',
    startDate: '2023-09-01',
    endDate: '2024-12-31',
    current: false,
    description: 'Led offensive security labs and workshops',
    responsibilities: [
      'Taught advanced red teaming techniques to graduate students',
      'Developed hands-on CTF challenges and lab exercises',
      'Mentored students in cybersecurity research projects',
      'Created educational content for offensive security courses'
    ],
    technologies: ['Red Team Tools', 'CTF Platforms', 'Educational Content'],
    logo: '🎓'
  },
  {
    id: 3,
    company: 'Multiple Security Firms',
    position: 'Security Intern (6x)',
    location: 'Various Locations',
    startDate: '2022-06-01',
    endDate: '2023-08-31',
    current: false,
    description: 'Malware Reverse Engineering, Secure DevOps, GRC',
    responsibilities: [
      'Conducted malware analysis and reverse engineering',
      'Implemented secure DevOps practices and CI/CD pipelines',
      'Assisted with Governance, Risk & Compliance (GRC) assessments',
      'Participated in security incident response activities'
    ],
    technologies: ['Malware Analysis', 'DevOps', 'GRC', 'Incident Response'],
    logo: '🔒'
  }
];

export const getCurrentExperience = () => experience.filter(exp => exp.current);
export const getExperienceById = (id) => experience.find(exp => exp.id === id);
