import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Shell from './studio/Shell';
import Home from './studio/Home';
import {preloadCase} from './studio/caseRoute';
import {HOME_DESCRIPTION, HOME_TITLE} from './studio/data/caseMeta';
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
    if (pathname.startsWith('/cve/')) return; // the case page sets its own
    const archive = /^\/exploits\/?$/.test(pathname);
    const microscope = enableExperiments && pathname === '/preview/microscope';
    const title = microscope ? 'Under the microscope · local preview' : archive ? 'Exploits and Analysis: Kernel and AI Infrastructure Research | Aviral Srivastava' : HOME_TITLE;
    const url = `https://www.aviralsrivastava.tech/${archive ? 'exploits/' : ''}`;
    const description = archive ? 'Research archive by Aviral Srivastava: Linux kernel n-day analysis and AI infrastructure vulnerability research, with root cause, reproduction and detection notes.' : HOME_DESCRIPTION;
    document.title = title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    const set = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
    set('meta[property="og:title"]', title); set('meta[property="og:url"]', url); set('meta[property="og:description"]', description);
    set('meta[name="twitter:title"]', title); set('meta[name="twitter:description"]', description);
    set('meta[name="description"]', description);
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
            <Route path="/research" element={<Navigate to="/#findings" replace />} />
            <Route path="*" element={<main className="route-loading"><h1>Outside the known map.</h1><a href="/">Return to the portfolio</a></main>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
