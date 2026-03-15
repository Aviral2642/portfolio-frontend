export const research = [
  {
    id: 1,
    title: 'The Rashomon Attack Surface (RAS): Navigating Predictive Multiplicity to Route Around AI Safety',
    venue: 'MURE Workshop 2025',
    year: 2025,
    authors: ['Aviral Srivastava', 'Sourav Panda'],
    description: 'Exposing how predictive multiplicity creates exploitable attack surfaces in AI safety mechanisms.',
    abstract: 'Explores how the Rashomon effect in ML models creates attack surfaces that can be exploited to bypass AI safeguards.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: true,
    status: 'published'
  },
  {
    id: 2,
    title: 'R₀ for Agentic Tool-Networks: Spectral Thresholds and Intervention Levers in LLM-Agent Systems',
    venue: 'AAAI 2026 Workshop FAST',
    year: 2025,
    authors: ['Aviral Srivastava', 'Sourav Panda', 'Kushagra Srivastva'],
    description: 'Modeling propagation dynamics in LLM-agent tool networks using epidemiological R₀ concepts.',
    abstract: 'Applies spectral graph theory to analyze and control information propagation thresholds in agentic LLM systems.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: true,
    status: 'published'
  },
  {
    id: 3,
    title: 'The Fundamental Limits of LLM Unlearning: Complexity-Theoretic Barriers and Provably Optimal Protocols',
    venue: 'BuildingTrust @ ICLR 2025',
    year: 2025,
    authors: ['Aviral Srivastava'],
    description: 'Proving computational barriers in LLM unlearning and designing optimal protocols.',
    abstract: 'Explores the fundamental computational barriers in LLM unlearning and proposes provably optimal protocols for secure model updates.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: true,
    status: 'published'
  },
  {
    id: 4,
    title: 'A Formal Framework for Assessing and Mitigating Emergent Security Risks in Generative AI Models',
    venue: 'Red Teaming GenAI @ NeurIPS 2024',
    year: 2024,
    authors: ['Aviral Srivastava', 'Sourav Panda'],
    description: 'Formal framework bridging theory and dynamic risk mitigation for generative AI security.',
    abstract: 'Presents a formal framework for assessing emergent security risks in generative AI and proposes dynamic mitigation strategies.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: true,
    status: 'published'
  },
  {
    id: 5,
    title: 'Beyond the Single Solution — The Rashomon Effect in Reinforcement Learning',
    venue: 'MURE Workshop 2025',
    year: 2025,
    authors: ['Sourav Panda', 'Aviral Srivastava', 'Jonathan Dodge'],
    description: 'How multiple equally-good RL policies create challenges for safety and interpretability.',
    abstract: 'Examines how multiple equally-performing RL policies create challenges for safety, interpretability, and deployment.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: false,
    status: 'published'
  },
  {
    id: 6,
    title: 'Unlocking New Strategies: Intrinsic Exploration for Evolving Macro and Micro Actions',
    venue: 'NeurIPS 2024 Workshop IMOL',
    year: 2024,
    authors: ['Sourav Panda', 'Aviral Srivastava', 'Jonathan Dodge'],
    description: 'Novel intrinsic motivation mechanisms for hierarchical action discovery in RL.',
    abstract: 'Proposes intrinsic exploration mechanisms for discovering and evolving macro and micro action strategies.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: false,
    status: 'published'
  },
  {
    id: 7,
    title: 'Anticipated Network Surveillance — Predicting Cyber-Attacks Using ML and Data Analytics',
    venue: 'CoRR 2023',
    year: 2023,
    authors: ['Aviral Srivastava', 'Dhyan Thakkar', 'Sharda Valiveti', 'Pooja Shah', 'Gaurang Raval'],
    description: 'Predictive cyber-attack detection using machine learning and network surveillance data.',
    abstract: 'An extrapolated study leveraging ML to anticipate and predict cyber-attacks through network surveillance data.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: false,
    status: 'published'
  },
  {
    id: 8,
    title: 'Unveiling the Veil of Deception: Adversarial Attacks and Defence Mechanisms in Deep Learning Networks',
    venue: 'IC3I 2023',
    year: 2023,
    authors: ['Aviral Srivastava', 'Priyansh Sanghavi', 'Viral Parmar'],
    description: 'Comprehensive survey of adversarial attack techniques and defense strategies in deep learning.',
    abstract: 'Surveys adversarial attack techniques and defense strategies across deep learning architectures.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: false,
    status: 'published'
  },
  {
    id: 9,
    title: 'Digital Power Play: Unraveling the Evolution of State-Sponsored Cyber Operations',
    venue: 'SIN 2023',
    year: 2023,
    authors: ['Aviral Srivastava', 'Viral Parmar', 'Priyansh Sanghavi', 'Seema Rani'],
    description: 'Analysis of the evolution, tactics, and strategic implications of nation-state cyber operations.',
    abstract: 'Examines the progression of nation-state cyber operations and their strategic implications.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: false,
    status: 'published'
  },
  {
    id: 10,
    title: 'Securing the Future of IoT: A Comprehensive Framework for Real-Time Attack Detection in IoT Networks',
    venue: 'Conference Paper',
    year: 2023,
    authors: ['Aviral Srivastava', 'Usha Jain'],
    description: 'Real-time attack detection and mitigation framework for IoT network security.',
    abstract: 'Proposes a comprehensive framework for detecting and mitigating attacks in IoT networks in real-time.',
    pdfUrl: 'https://scholar.google.com/citations?user=bwwumvAAAAAJ&hl=en',
    featured: false,
    status: 'published'
  },
];

// Total papers including ones not listed here
export const TOTAL_PAPERS = '30+';

export const getFeaturedResearch = () => research.filter(r => r.featured);
export const getResearchByVenue = (venue) => research.filter(r => r.venue === venue);
export const getResearchById = (id) => research.find(r => r.id === id);
