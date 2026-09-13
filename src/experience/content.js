import { blogPosts } from '../data/blog';
export const langflowArticle = blogPosts.find(post => post.id === 12).url;
export const disclosures = [
  { name: 'Langflow', id: 'CVE-2026-33017', focus: 'AI workflow security', score: '9.3', label: 'Critical · CISA KEV', text: 'Unauthenticated remote code execution in an AI workflow platform. Listed in the CISA Known Exploited Vulnerabilities catalog.', href: langflowArticle },
  { name: 'Flowise', id: 'CVE-2026-69258', focus: 'Execution context integrity', score: '8.8', label: 'High', text: 'Unauthenticated property injection into the flow execution context.', href: 'https://www.cve.org/CVERecord?id=CVE-2026-69258' },
  { name: 'Activepieces', id: 'CVE-2026-73081', focus: 'Worker isolation', score: '8.7', label: 'High · Co-reported', text: 'Command injection in the worker compilation pipeline, before sandbox creation. Co-reported research.', href: 'https://www.cve.org/CVERecord?id=CVE-2026-73081' },
  { name: 'Activepieces', id: 'CVE-2026-73083', focus: 'Sandbox boundaries', score: '7.6', label: 'High · Co-reported', text: 'V8 isolate sandbox bypass involving module loading. Co-reported research.', href: 'https://www.cve.org/CVERecord?id=CVE-2026-73083' },
  { name: 'Activepieces', id: 'CVE-2026-73084', focus: 'OAuth security', score: '6.1', label: 'Medium', text: 'Reflected cross-site scripting in the OAuth redirect endpoint. Sole reporter.', href: 'https://www.cve.org/CVERecord?id=CVE-2026-73084' },
  { name: 'vLLM', id: 'CVE-2026-53923', focus: 'GPU memory isolation', score: '5.3', label: 'Medium', text: 'Cross-tenant GPU memory disclosure involving integer truncation in GGUF dequantization kernels.', href: 'https://www.cve.org/CVERecord?id=CVE-2026-53923' },
  { name: 'AnythingLLM', id: 'CVE-2026-32628', focus: 'AI agent data security', score: 'High', label: 'SQL injection', text: 'SQL injection research in an AI agent platform, followed by coordinated disclosure.', href: 'https://www.cve.org/CVERecord?id=CVE-2026-32628' },
];

export const sources = {
  nomination: 'https://github.com/Aviral2642',
  advisory: 'https://github.com/langflow-ai/langflow/security/advisories/GHSA-vwmf-pq79-vjvx',
  timeline: 'https://www.sysdig.com/blog/cve-2026-33017-how-attackers-compromised-langflow-ai-pipelines-in-20-hours',
  kev: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-33017',
  speaker: 'https://sessionize.com/aviral-srivastava/',
};
