import {defineConfig, transformWithOxc} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [{name: 'portfolio-jsx-in-js', enforce: 'pre',
      transform(code, id) {
        if (/\/src\/.*\.js$/.test(id)) return transformWithOxc(code, id, {lang: 'jsx', jsx: {runtime: 'automatic'}});
      },
    }, react()],
    // Keep the existing .js JSX sources and import paths; no mass file renaming.
    oxc: {include: /src\/.*\.[jt]sx?$/, jsx: {runtime: 'automatic'}},
    optimizeDeps: {rolldownOptions: {moduleTypes: {'.js': 'jsx'}}},
    // Lazy Three.js is ~695 KB minified / ~177 KB gzip. It loads near recognition.
    // The initial application is ~175 KB gzip; keep a bounded lazy-chunk budget.
    build: {outDir: 'build', sourcemap: false, chunkSizeWarningLimit: 750},
    test: {environment: 'jsdom', globals: true, include: ['src/**/*.test.js'], setupFiles: ['./src/testSetup.js']},
});
