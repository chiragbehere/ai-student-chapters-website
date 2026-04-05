import React, { lazy, Suspense, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';

// Lazy-load all non-home pages for faster initial load
const Events = lazy(() => import('./pages/Events'));
const Team = lazy(() => import('./pages/Team'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Sessions = lazy(() => import('./pages/Sessions'));

// Page loading skeleton
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-foreground/40 text-sm font-heading font-medium tracking-wider">Loading...</p>
    </div>
  </div>
);

// Handle lazy load chunk errors (stuck "Loading..." upon deployment)
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Route Error:", error, errorInfo);
    // If we fail to fetch a component chunk (meaning a new deployment happened), auto-reload it
    if (error.name === 'ChunkLoadError' || error.message.includes('dynamically imported module') || error.message.includes('fetch') || error.message.toLowerCase().includes('syntaxerror')) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <h2 className="text-xl text-heading font-bold font-heading">Syncing new updates...</h2>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary/20 text-primary border border-primary/20 rounded-full hover:bg-primary/30 transition-colors">
            Tap to Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
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
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <SmoothScroll>
        <Layout>
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </Layout>
      </SmoothScroll>
    </Router>
  );
}

export default App;
