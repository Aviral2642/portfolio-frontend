// The short form of each finding: what the homepage list and the build step need.
// Generated from findings.js (the full case files). findings.test.js fails if the two drift apart.
export const families = {
  execution: {label: 'Code execution', accent: '#ff6a45', seed: 3.1},
  identity: {label: 'Identity and OAuth', accent: '#4fd4ff', seed: 7.7},
  isolation: {label: 'Sandbox isolation', accent: '#ffb84a', seed: 11.3},
  memory: {label: 'Memory safety', accent: '#5cf2b0', seed: 17.9},
  data: {label: 'Data access', accent: '#ff73d0', seed: 23.5},
  protocol: {label: 'Protocol desync', accent: '#9d7bff', seed: 29.1},
};

// Each case has its own colour, hero field and seed; the family supplies the class label.
const looks = {
  'CVE-2026-33017': {accent: '#ff5630', mode: 5, seed: 2.3},
  'CVE-2026-129289': {accent: '#a98bff', mode: 4, seed: 8.2},
  'CVE-2026-115563': {accent: '#4fd4ff', mode: 1, seed: 1.1},
  'CVE-2026-104850': {accent: '#7d94ff', mode: 1, seed: 4.6},
  'CVE-2026-69258': {accent: '#ffc83d', mode: 4, seed: 3.7},
  'CVE-2026-73081': {accent: '#ff4d7e', mode: 5, seed: 9.4},
  'CVE-2026-73083': {accent: '#ff9d3c', mode: 2, seed: 5.2},
  'CVE-2026-73084': {accent: '#c4f04a', mode: 2, seed: 12.8},
  'CVE-2026-53923': {accent: '#5cf2b0', mode: 3, seed: 6.1},
  'CVE-2026-32628': {accent: '#ff73d0', mode: 4, seed: 15.5},
};
export const themeOf = finding => ({...families[finding.family], ...looks[finding.id]});

export const findingIndex = [
  {"id":"CVE-2026-33017","product":"Langflow","family":"execution","score":9.3,"severity":"Critical","title":"Unauthenticated remote code execution","line":"One request with no login could run Python on the server behind an AI workflow platform.","flags":["CISA KEV","Exploited in the wild"]},
  {"id":"CVE-2026-129289","product":"PHP","family":"protocol","score":9.2,"severity":"Critical","title":"PHP-FPM request smuggling through an unread request body","line":"Bytes an application never read were taken by PHP-FPM as the next request, one the web server never sent.","flags":["Co-reported"]},
  {"id":"CVE-2026-115563","product":"MCP Python SDK","family":"identity","score":7.5,"severity":"High","title":"OAuth credentials sent to the wrong issuer","line":"A malicious MCP server could tell the SDK’s OAuth client where to send credentials that were issued by someone else.","flags":["Co-reported"]},
  {"id":"CVE-2026-104850","product":"MCP TypeScript SDK","family":"identity","score":7.5,"severity":"High","title":"Stored OAuth credentials followed the server’s directions","line":"The TypeScript client would present saved credentials to whichever authorization server an MCP server named.","flags":["Co-reported"]},
  {"id":"CVE-2026-69258","product":"Flowise","family":"execution","score":8.8,"severity":"High","title":"Property injection into the flow execution context","line":"An unauthenticated request could overwrite the session identity and variables a Flowise flow runs with.","flags":["Sole reporter"]},
  {"id":"CVE-2026-73081","product":"Activepieces","family":"execution","score":8.7,"severity":"High","title":"Command injection before the sandbox exists","line":"The name of a code step ended up in a shell command on the worker host, at compile time.","flags":["Co-reported"]},
  {"id":"CVE-2026-73083","product":"Activepieces","family":"isolation","score":7.6,"severity":"High","title":"V8 isolate bypass through module loading","line":"User code was loaded with require() before the isolate applied, and loading a module runs it.","flags":["Co-reported"]},
  {"id":"CVE-2026-73084","product":"Activepieces","family":"identity","score":6.1,"severity":"Medium","title":"Reflected XSS in the OAuth redirect endpoint","line":"The OAuth callback page wrote a query parameter straight into an inline script.","flags":["Co-reported"]},
  {"id":"CVE-2026-53923","product":"vLLM","family":"memory","score":5.3,"severity":"Medium","title":"Cross-tenant GPU memory disclosure","line":"A 32-bit element count in the GGUF kernels left part of a GPU buffer holding another request’s data.","flags":["Sole reporter"]},
  {"id":"CVE-2026-32628","product":"AnythingLLM","family":"data","score":7.7,"severity":"High","title":"SQL injection through an agent tool call","line":"A table name chosen by the model, steered by the user, was pasted into a SQL query.","flags":["Sole reporter"]},
];
