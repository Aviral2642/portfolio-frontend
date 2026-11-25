// Page titles and descriptions for case pages, shared by the app and the build step.
export const SITE = 'https://www.aviralsrivastava.tech';
export const caseUrl = finding => `${SITE}/cve/${finding.id}/`;
export const caseTitle = finding => {
  const subject = finding.title.toLowerCase().includes(finding.product.toLowerCase()) ? finding.title : `${finding.product}: ${finding.title}`;
  return `${finding.id} · ${subject} | Aviral Srivastava`;
};
export const caseDescription = finding => {
  const score = typeof finding.score === 'number' ? `CVSS ${finding.score} ${finding.severity}. ` : `${finding.severity} severity. `;
  const text = `${finding.line} ${score}Root cause, how it works, fix, timeline and coverage.`;
  return text.length > 300 ? `${finding.line} ${score}`.trim() : text;
};
export const HOME_TITLE = 'Aviral Srivastava | AI Infrastructure Security Researcher';
export const HOME_DESCRIPTION = 'Security engineer and researcher. Vulnerability research in AI infrastructure and systems: Langflow (CISA KEV), PHP-FPM, MCP SDKs, vLLM. Pwnie Awards 2026 nominee.';
