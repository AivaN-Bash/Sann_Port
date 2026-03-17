import React, { Suspense, lazy, memo } from 'react';
import { AppProvider, useRouter } from './AppContext';
import Nav from './components/Nav';
import Cursor from './components/Cursor';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

const Home       = lazy(() => import('./components/Home'));
const Skills     = lazy(() => import('./components/Skills'));
const Projects   = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const Contact    = lazy(() => import('./components/Contact'));

const PAGES = {
  home:       Home,
  skills:     Skills,
  projects:   Projects,
  experience: Experience,
  contact:    Contact,
};

/* Memoised background — never re-renders */
const Background = memo(function Background() {
  return (
    <div className="app-bg" aria-hidden="true">
      <div className="app-bg__scanlines" />
      <div className="app-bg__noise" />
      <div className="app-bg__diagonal" />
    </div>
  );
});

function PageFallback() {
  return (
    <div className="page-fallback" role="status" aria-live="polite">
      <span className="page-fallback__dot" />
      <span className="page-fallback__dot" />
      <span className="page-fallback__dot" />
    </div>
  );
}

function AppInner() {
  const { page } = useRouter();
  const PageComponent = PAGES[page] || Home;

  return (
    <>
      <Background />
      <Cursor />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<PageFallback />}>
          <PageComponent />
        </Suspense>
      </main>
      <ScrollToTop />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <LoadingScreen>
        <AppInner />
      </LoadingScreen>
    </AppProvider>
  );
}
