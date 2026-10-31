// index.jsx
// Master Code Carnival 3D Hero Scene
// Integrates 3D canvas, overlays, timeline, title reveal, audio manager, transition wipe, and fallback
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useProgress } from '@react-three/drei';
import HeroScene from './HeroScene';
import Overlays from './Overlays';
import Title from './Title';
import CursorParticle from './CursorParticle';
import PortalTransition from './PortalTransition';
import SoundToggle from './SoundToggle';
import useHeroTimeline from './useHeroTimeline';
import { LightningController, AudioManager } from './codecarnival-animations';

const BASE = '/CodeCarnival_3D_Assets/';

// Themed 3D Asset Loader using drei's useProgress
function AssetLoadingScreen() {
  const { progress } = useProgress();
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050308] text-white">
      <div className="w-16 h-16 rounded-full border-2 border-red-900 border-t-[#e50914] animate-spin mb-4" />
      <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#e50914] font-bold">
        OPENING DIMENSIONAL RIFT
      </span>
      <span className="text-[11px] font-mono text-[#e8d5b5]/60 mt-2">
        {Math.round(progress)}% LOADED
      </span>
    </div>
  );
}

// WebGL Unsupported Static Fallback
function WebGLStaticFallback({ onEnter }) {
  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0408] via-[#080204] to-black text-center p-6">
      <img
        src={`${BASE}documentation/preview_render.png`}
        alt="Code Carnival 2.0 Realm"
        className="max-w-2xl w-full h-auto rounded-sm border border-red-900/60 shadow-2xl mb-6 opacity-85"
        onError={(e) => {
          e.currentTarget.src = `${BASE}graphics/code_carnival_logo.png`;
        }}
      />
      <h2 className="text-3xl font-bold font-mono text-white mb-3">CODE CARNIVAL 2.0</h2>
      <p className="text-xs text-[#e8d5b5]/80 font-mono max-w-md mb-6">
        State-Level Hackathon • 24 Hours • ₹50,000+ Bounty • IMRDA Campus Shirpur
      </p>
      <button
        onClick={onEnter}
        className="px-8 py-3 bg-[#e50914] text-white font-mono text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#ff1b27] transition-all cursor-pointer"
      >
        PROCEED TO EVENT
      </button>
    </div>
  );
}

export function CodeCarnivalHero({ onEnterComplete, isIntroActive = true }) {
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [flashIndex, setFlashIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGLSupported(false);
    } catch {
      setWebGLSupported(false);
    }

    // Detect reduced motion & mobile
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Audio & Lightning Controllers
  const audioManager = useMemo(() => new AudioManager(BASE + 'audio/'), []);
  const lightningControllerRef = useRef(null);

  useEffect(() => {
    audioManager.attach(window);
    lightningControllerRef.current = new LightningController({
      onFlash: (bolt, index) => {
        setFlashIndex(index);
        setFlashOpacity(0.9);
        setTimeout(() => setFlashOpacity(0.1), 60);
        setTimeout(() => setFlashOpacity(0.7), 120);
        setTimeout(() => setFlashOpacity(0), 220);
      },
    });

    return () => {
      audioManager.dispose();
    };
  }, [audioManager]);

  // Single Timeline Hook
  const {
    lightingPreset,
    titleVisible,
    transitionProgress,
    startTimeline,
    enterExperience,
  } = useHeroTimeline({
    audioManager,
    lightningController: lightningControllerRef.current,
    onComplete: onEnterComplete,
  });

  // Start timeline when mounted
  useEffect(() => {
    startTimeline();
  }, [startTimeline]);

  const handleEnterClick = () => {
    setIsTransitioning(true);
    enterExperience();
  };

  const handleSkipIntro = () => {
    try {
      sessionStorage.setItem('codecarnival_intro_seen', 'true');
    } catch {}
    if (onEnterComplete) onEnterComplete();
  };

  if (!webGLSupported) {
    return <WebGLStaticFallback onEnter={handleSkipIntro} />;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden select-none bg-[#050308]">
      {/* 1. Accessible Controls (Sound Toggle + Skip Button) */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-3">
        <SoundToggle audioManager={audioManager} />
        <button
          onClick={handleSkipIntro}
          className="px-3.5 py-1.5 rounded-full border border-[#e8d5b5]/30 bg-black/50 text-[#e8d5b5]/80 hover:text-white hover:border-white text-xs font-mono tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[#e50914] cursor-pointer"
          title="Skip Opening Scene and View Event Details"
          aria-label="Skip Intro"
        >
          SKIP INTRO
        </button>
      </div>

      {/* 2. 3D Canvas Scene */}
      <Suspense fallback={<AssetLoadingScreen />}>
        <div className="absolute inset-0 w-full h-full">
          <HeroScene
            activePresetName={lightingPreset}
            lightningControllerRef={lightningControllerRef}
            onFlashTriggered={(idx) => {
              setFlashIndex(idx);
              setFlashOpacity(0.9);
              setTimeout(() => setFlashOpacity(0), 180);
            }}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            enableBloom={!isMobile}
          />
        </div>
      </Suspense>

      {/* 3. Screen Overlays (Film grain, vignette, red glow, lightning flash) */}
      <Overlays
        flashOpacity={flashOpacity}
        flashIndex={flashIndex}
        reducedMotion={reducedMotion}
      />

      {/* 4. Mouse Cursor Trail Particle */}
      <CursorParticle enabled={!isMobile} />

      {/* 5. Title & Call to Action Overlay */}
      <Title
        visible={titleVisible}
        onEnterExperience={handleEnterClick}
      />

      {/* 6. Wipe Transition Out of the Intro */}
      <PortalTransition
        progress={transitionProgress}
        isTransitioning={isTransitioning}
      />
    </div>
  );
}

export default CodeCarnivalHero;
