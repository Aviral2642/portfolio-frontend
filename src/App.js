import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Portfolio from './designer/DesignerPortfolio';
import {preloadArchive} from './designer/archiveRoute';

const ExploitsPage = lazy(preloadArchive);
const enableExperiments = import.meta.env.DEV || import.meta.env.MODE === 'review';
const MicroscopePreview = enableExperiments ? lazy(() => import('./designer/microscope/Microscope')) : null;

function RouteMetadata() {
  const {pathname} = useLocation();
  useEffect(() => {
    const archive = /^\/exploits\/?$/.test(pathname);
    const microscope = enableExperiments && pathname === '/preview/microscope';
    const title = microscope ? 'Under the microscope — local preview' : archive ? 'Exploits & Analysis — Aviral Srivastava' : 'Aviral Srivastava - Security Researcher';
    const url = `https://www.aviralsrivastava.tech/${archive ? 'exploits/' : ''}`;
    const description = archive ? 'Independent security research archive. Kernel and AI infrastructure research, analysis, and disclosure references by Aviral Srivastava.' : 'Aviral Srivastava — security engineer and researcher. Explore systems security, binary and malware analysis, AI infrastructure research, talks, and selected work.';
    document.title = title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    for (const type of ['og', 'twitter']) {
      document.querySelector(`meta[property="${type}:title"]`)?.setAttribute('content', title);
      document.querySelector(`meta[property="${type}:url"]`)?.setAttribute('content', url);
      document.querySelector(`meta[property="${type}:description"]`)?.setAttribute('content', description);
    }
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [pathname]);
  return null;
}

function App() {
  return (
    // The archive owns its native View Transition snapshot. Its flushSync commit
    // must not be deferred inside React Router's separate startTransition.
    <Router useTransitions={false}>
      <RouteMetadata/>
      <GlobalStyles />
      <Suspense fallback={<main className="route-loading" role="status">Opening the page…</main>}>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/exploits" element={<ExploitsPage />} />
          {enableExperiments && <Route path="/preview/microscope" element={<MicroscopePreview />} />}
          <Route path="/research" element={<Navigate to="/#research" replace />} />
          <Route path="*" element={<main className="route-loading"><h1>Outside the known map.</h1><a href="/">Return to the portfolio</a></main>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
