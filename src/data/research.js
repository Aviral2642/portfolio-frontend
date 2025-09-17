export const research = [
  {
    id: 1,
    title: 'The Fundamental Limits of LLM Unlearning: Complexity-Theoretic Barriers and Provably Optimal Protocols',
    venue: 'ICLR 2025',
    year: 2025,
    authors: ['Aviral Srivastava', 'Co-authors'],
    description: 'Research on the theoretical limits and optimal protocols for large language model unlearning',
    abstract: 'This paper explores the fundamental computational barriers in LLM unlearning and proposes provably optimal protocols for secure model updates.',
    pdfUrl: '#',
    githubUrl: '#',
    featured: true,
    status: 'submitted'
  },
  {
    id: 2,
    title: 'Crypto CTF Generation using LLMs — AI-powered challenge generation for security education',
    venue: 'MS Thesis',
    year: 2024,
    authors: ['Aviral Srivastava'],
    description: 'AI-powered challenge generation for security education and CTF competitions',
    abstract: 'Developed an AI system that automatically generates cryptographic CTF challenges for educational purposes.',
    pdfUrl: '#',
    githubUrl: '#',
    featured: true,
    status: 'completed'
  },
  {
    id: 3,
    title: 'D-POM (Dynamic Path Obfuscation & Monitoring) — Research on runtime anti-fuzzing systems',
    venue: 'Research Project',
    year: 2024,
    authors: ['Aviral Srivastava', 'Research Team'],
    description: 'Runtime anti-fuzzing systems for protecting software from automated vulnerability discovery',
    abstract: 'Novel approach to dynamically obfuscate execution paths to prevent fuzzing-based vulnerability discovery.',
    pdfUrl: '#',
    githubUrl: '#',
    featured: false,
    status: 'in-progress'
  }
];

export const getFeaturedResearch = () => research.filter(res => res.featured);
export const getResearchByVenue = (venue) => research.filter(res => res.venue === venue);
export const getResearchById = (id) => research.find(res => res.id === id);
