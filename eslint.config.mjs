export default [{
  files: ['**/*.{js,jsx,mjs}'],
  ignores: ['build/**', 'node_modules/**', 'output/**'],
  languageOptions: {ecmaVersion: 'latest', sourceType: 'module', parserOptions: {ecmaFeatures: {jsx: true}}},
  rules: {
    'no-unreachable': 'error', 'no-dupe-keys': 'error', 'no-duplicate-case': 'error',
    'no-debugger': 'error', 'no-constant-condition': 'error',
    'constructor-super': 'error', 'valid-typeof': 'error', 'no-unsafe-finally': 'error',
    'no-template-curly-in-string': 'error',
  },
}, {
  // The archive data contains literal source-code excerpts, not JS interpolation.
  files: ['src/data/**'], rules: {'no-template-curly-in-string': 'off'},
}];
