import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Shell from './studio/Shell';
import Home from './studio/Home';
import {preloadCase} from './studio/caseRoute';
import {preloadArchive} from './designer/archiveRoute';

const ExploitsPage = lazy(preloadArchive);
// Case pages load on demand. The shell holds its own Suspense boundary, so it stays mounted while they do.
const CvePage = lazy(preloadCase);
// The older pages keep their styled-components base styles; the studio pages do not load that library.
const LegacyChrome = lazy(() => import('./styles/LegacyChrome'));
const LegacyPortfolio = lazy(() => import('./designer/DesignerPortfolio'));
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
      <Suspense fallback={<main className="route-loading" role="status">Opening the page…</main>}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/cve/:id" element={<CvePage />} />
          </Route>
          <Route element={<LegacyChrome />}>
            {enableExperiments && <Route path="/preview/legacy" element={<LegacyPortfolio />} />}
            <Route path="/exploits" element={<ExploitsPage />} />
            {enableExperiments && <Route path="/preview/microscope" element={<MicroscopePreview />} />}
            <Route path="/research" element={<Navigate to="/#research" replace />} />
            <Route path="*" element={<main className="route-loading"><h1>Outside the known map.</h1><a href="/">Return to the portfolio</a></main>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
