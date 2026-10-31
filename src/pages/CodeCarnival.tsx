// CodeCarnival.tsx
// Master AAA Cinematic 3D Experience for Code Carnival 2.0
// 1. Procedural 3D Cinematic Opening Scene (CodeCarnivalHero with glTF models, portal, lightning, and audio)
// 2. 6-Chapter Interactive Supernatural Journey driven by GSAP ScrollTrigger and Three.js
import React, { useEffect, useState, useRef, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, ExternalLink, Shield, Play } from 'lucide-react';
import SEO from '../components/SEO';
import './CodeCarnival.css';

// 3D & Cinematic Components
import SupernaturalWorld from '../components/code-carnival/SupernaturalWorld';
import CinematicChapters from '../components/code-carnival/CinematicChapters';
import WebGLFallback from '../components/code-carnival/WebGLFallback';
import VHSOverlay from '../components/code-carnival/VHSOverlay';
import { detectPerformance, type PerformanceSettings } from '../components/code-carnival/PerformanceManager';
import soundEngine from '../components/code-carnival/SoundEngine';

// Lazy-load the AAA 3D Hero Scene
const CodeCarnivalHero = lazy(() => import('../components/CodeCarnivalHero'));

gsap.registerPlugin(ScrollTrigger);

const UNSTOP_URL = 'https://unstop.com';

// WebGL Error Boundary
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Supernatural 3D Scene Error fallback activated:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const CodeCarnival: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.0);
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [performance] = useState<PerformanceSettings>(() => detectPerformance());

  // Show intro once per session (honouring sessionStorage)
  const [showHeroIntro, setShowHeroIntro] = useState(() => {
    try {
      return sessionStorage.getItem('codecarnival_intro_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const handleEnterSite = useCallback(() => {
    try {
      sessionStorage.setItem('codecarnival_intro_seen', 'true');
    } catch {}
    setShowHeroIntro(false);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setShowHeroIntro(true);
  }, []);

  // Track threshold crossed for audio triggers
  const lastCrossedChapter = useRef(1);

  // 1. GSAP ScrollTrigger Engine: Synchronizes scrollbar with the 6-chapter world
  useEffect(() => {
    if (!containerRef.current || showHeroIntro) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // Calculate chapter for sound cues
          let chapter = 1;
          if (p >= 0.85) chapter = 6;
          else if (p >= 0.70) chapter = 5;
          else if (p >= 0.50) chapter = 4;
          else if (p >= 0.30) chapter = 3;
          else if (p >= 0.15) chapter = 2;

          // Sound cues on chapter entry
          if (chapter !== lastCrossedChapter.current) {
            lastCrossedChapter.current = chapter;
            if (chapter === 2) soundEngine.playTransmissionBeep();
            if (chapter === 4) soundEngine.playVaultUnseal();
            if (chapter === 6) soundEngine.playPortalAwaken();
          }

          // In Chapter 3 (0.30 to 0.50), dynamically update the active challenge zone based on scroll (5 tracks)
          if (p >= 0.30 && p < 0.50) {
            const zoneFraction = (p - 0.30) / 0.20;
            const zoneIdx = Math.min(Math.floor(zoneFraction * 5), 4);
            setActiveZoneIndex(zoneIdx);
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [showHeroIntro]);

  // 2. Audio Toggle Handler
  const handleToggleAudio = useCallback(() => {
    soundEngine.init();
    const active = soundEngine.toggleMute();
    setIsPlayingAudio(active);
    if (active) {
      soundEngine.startAtmosphericDrone();
      soundEngine.playThemeMusic();
    }
  }, []);

  // 3. Chapter HUD Navigation: Smooth scroll to selected chapter
  const handleNavigateChapter = useCallback((chapterIndex: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targets = [0.0, 0.20, 0.38, 0.58, 0.76, 0.94];
    const targetScrollY = totalHeight * targets[chapterIndex];
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundEngine.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="st-page relative w-full bg-[#020409] text-[#e8d5b5] selection:bg-[#e50914] selection:text-white"
    >
      <SEO
        title="Code Carnival 2.0 — The Upside Down of Code | AI Student Chapter"
        description="Experience Code Carnival 2.0: A 24-hour State-Level Hackathon with ₹50K+ bounty presented by AI Student Chapter, RCPET's IMRD. Enter the Upside Down."
      />

      {/* ── 3D Opening Cinematic Hero Scene (Mounted upon entry, once per session or on replay) ── */}
      {showHeroIntro && (
        <Suspense fallback={<div className="fixed inset-0 bg-[#050308] z-50" />}>
          <CodeCarnivalHero onEnterComplete={handleEnterSite} />
        </Suspense>
      )}

      {/* ── Fixed Top Cinematic Control Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 backdrop-blur-md bg-black/40 border-b border-red-950/40">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 text-white font-bold tracking-widest text-xs hover:text-[#e50914] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#e50914] shadow-[0_0_8px_#e50914] animate-pulse" />
            <span style={{ fontFamily: "'Libre Baskerville', serif", letterSpacing: '0.12em' }}>
              CODE CARNIVAL 2.0
            </span>
          </a>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono tracking-widest text-[#ffd700] border border-[#ffd700]/30 bg-[#ffd700]/10">
            <Shield size={10} className="inline mr-1" />
            STATE LEVEL
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 font-mono text-xs">
          {/* Replay 3D Intro Button */}
          <button
            onClick={handleReplayIntro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-900/40 bg-black/50 text-[#e8d5b5]/70 hover:text-white hover:border-[#e50914] text-[11px] tracking-wider transition-all"
            title="Replay 3D Cinematic Opening Scene"
            aria-label="Replay 3D Scene"
          >
            <Play size={11} className="text-[#e50914]" />
            <span className="hidden md:inline">3D INTRO</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] tracking-wider transition-all duration-300 ${
              isPlayingAudio
                ? 'border-[#e50914] text-[#e50914] bg-[#e50914]/15 shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                : 'border-[#e8d5b5]/25 text-[#e8d5b5]/60 hover:text-white hover:border-[#e8d5b5]/50'
            }`}
            title={isPlayingAudio ? 'Mute Ambience' : 'Enable Cinematic Audio'}
            aria-label="Toggle Audio"
          >
            {isPlayingAudio ? <Volume2 size={13} className="text-[#e50914]" /> : <VolumeX size={13} />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          {/* Quick Register Gateway */}
          <a
            href={UNSTOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-[#e50914] text-white font-bold tracking-widest text-[11px] uppercase shadow-[0_0_20px_rgba(229,9,20,0.6)] hover:bg-[#ff1b27] transition-all"
          >
            <span>REGISTER</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* ── Persistent Fullscreen 3D Spatial Universe (Pinned in Background) ── */}
      <WebGLErrorBoundary fallback={<WebGLFallback intensity={1.2} />}>
        <SupernaturalWorld
          scrollProgress={scrollProgress}
          activeZoneIndex={activeZoneIndex}
          performance={performance}
        />
      </WebGLErrorBoundary>

      {/* ── The 6-Chapter Narrative Storyboard Overlay (With 20 Problem Statements) ── */}
      <CinematicChapters
        scrollProgress={scrollProgress}
        activeZoneIndex={activeZoneIndex}
        setActiveZoneIndex={setActiveZoneIndex}
        onNavigateChapter={handleNavigateChapter}
      />

      {/* ── Analog CRT Scanlines & Atmospheric Vignette ── */}
      <VHSOverlay />
    </div>
  );
};

export default CodeCarnival;
