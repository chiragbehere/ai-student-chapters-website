import React, { lazy, Suspense, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import SmoothScroll from './components/SmoothScroll';
import FloatingWidgets from './components/FloatingWidgets';
import Home from './pages/Home';

// Lazy-load all non-home pages for faster initial load
const Events = lazy(() => import('./pages/Events'));
const Team = lazy(() => import('./pages/Team'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Sessions = lazy(() => import('./pages/Sessions'));
const Tools = lazy(() => import('./pages/Tools'));
import CodeCarnival from './pages/CodeCarnival';

// Page loading skeleton
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-foreground/40 text-sm font-heading font-medium tracking-wider">Loading...</p>
    </div>
  </div>
);

// Handle route-level and lazy load chunk errors with safe recovery
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean; error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Route Error:", error, errorInfo);
    const isChunkError = error.name === 'ChunkLoadError' || 
                         error.message?.includes('dynamically imported module') || 
                         error.message?.includes('fetch') ||
                         error.message?.toLowerCase().includes('syntaxerror');
    if (isChunkError && !sessionStorage.getItem('chunk_reload_attempted')) {
      sessionStorage.setItem('chunk_reload_attempted', 'true');
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#050308] text-white p-6 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-red-800 border-t-[#e50914] animate-spin mb-2" />
          <h2 className="text-xl font-bold font-mono tracking-wider text-white">Updating Application...</h2>
          <p className="text-xs text-neutral-400 font-mono max-w-sm">
            A newer version was deployed or an asset is synchronizing.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => {
                try {
                  sessionStorage.clear();
                  localStorage.removeItem('codecarnival_intro_seen');
                } catch (e) {}
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#e50914] text-white font-mono text-xs font-bold tracking-widest uppercase rounded shadow-[0_0_20px_rgba(229,9,20,0.6)] hover:bg-[#ff1b27] transition-all cursor-pointer"
            >
              Tap to Reload
            </button>
            <a
              href="/"
              onClick={() => {
                try {
                  sessionStorage.clear();
                  localStorage.removeItem('codecarnival_intro_seen');
                } catch (e) {}
              }}
              className="px-6 py-2.5 border border-white/20 bg-black/60 text-white font-mono text-xs font-bold tracking-widest uppercase rounded hover:bg-white/10 transition-all"
            >
              Return Home
            </a>
          </div>
        </div>
      );       
    }
    return this.props.children;
  }
}

// Page transition — opacity only, no scale/spring to avoid repaints on mobile
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.18, ease: 'easeOut' }}
    style={{ willChange: 'opacity' }}
  >
    {children}
  </motion.div>
);

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/events" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><Events /></PageTransition>
          </Suspense>
        } />
        <Route path="/team" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><Team /></PageTransition>
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><About /></PageTransition>
          </Suspense>
        } />
        <Route path="/gallery" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><Gallery /></PageTransition>
          </Suspense>
        } />
        <Route path="/faq" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><FAQ /></PageTransition>
          </Suspense>
        } />
        <Route path="/sessions" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><Sessions /></PageTransition>
          </Suspense>
        } />
        <Route path="/tools" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><Tools /></PageTransition>
          </Suspense>
        } />
        <Route path="/code-carnival" element={
          <PageTransition><CodeCarnival /></PageTransition>
        } />

      </Routes>
    </AnimatePresence>
  );
};

import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <Router>
        <SmoothScroll>
          <Layout>
            <ErrorBoundary>
              <AnimatedRoutes />
            </ErrorBoundary>
          </Layout>
          <FloatingWidgets />
          <Analytics />
        </SmoothScroll>
    </Router>
  );
}

export default App;
