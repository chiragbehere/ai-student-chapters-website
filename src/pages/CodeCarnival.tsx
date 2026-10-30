// CodeCarnival.tsx
// AAA Cinematic 3D Supernatural Experience: Stranger Things-inspired Alternate Dimension
// Features: Real-time 3D Forest, Procedural Portal Rift, Red Lightning, Shaders, Sound Engine, and Event Integration
import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import SEO from '../components/SEO';
import './CodeCarnival.css';

// 3D & Cinematic Components
import SupernaturalScene, { WebGLErrorBoundary } from '../components/code-carnival/SupernaturalScene';
import WebGLFallback from '../components/code-carnival/WebGLFallback';
import CinematicOverlay from '../components/code-carnival/CinematicOverlay';
import EventWebsiteContent from '../components/code-carnival/EventWebsiteContent';
import VHSOverlay from '../components/code-carnival/VHSOverlay';
import { detectPerformance, type PerformanceSettings } from '../components/code-carnival/PerformanceManager';
import soundEngine from '../components/code-carnival/SoundEngine';

export type CinematicPhase =
  | 'SCENE_1_INTRO'
  | 'SCENE_2_AWAKEN'
  | 'SCENE_3_REVEAL'
  | 'SCENE_4_WARP'
  | 'EXPLORING_SITE';

export const CodeCarnival: React.FC = () => {
  const [cinematicPhase, setCinematicPhase] = useState<CinematicPhase>('SCENE_1_INTRO');
  const [awakenProgress, setAwakenProgress] = useState(0.15);
  const [warpProgress, setWarpProgress] = useState(0.0);
  const [scrollY, setScrollY] = useState(0);
  const [isHoveredPortal, setIsHoveredPortal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showWarpFlash, setShowWarpFlash] = useState(false);
  const [performance] = useState<PerformanceSettings>(() => detectPerformance());

  const warpTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isTransitioningRef = useRef(false);

  // 1. Scene Timeline Director: Progressively reveals Scenes 1, 2, and 3
  useEffect(() => {
    // Scene 2: Portal Awakening after 1.8 seconds
    const awakenTimer = setTimeout(() => {
      setCinematicPhase((prev) => {
        if (prev === 'SCENE_1_INTRO') {
          setAwakenProgress(0.7);
          soundEngine.playPortalAwaken();
          return 'SCENE_2_AWAKEN';
        }
        return prev;
      });
    }, 1800);

    // Scene 3: CODE CARNIVAL Title Reveal after 3.6 seconds
    const revealTimer = setTimeout(() => {
      setCinematicPhase((prev) => {
        if (prev === 'SCENE_2_AWAKEN') {
          setAwakenProgress(1.0);
          return 'SCENE_3_REVEAL';
        }
        return prev;
      });
    }, 3600);

    return () => {
      clearTimeout(awakenTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  // 2. Track Window Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // If user scrolls during the opening scenes, automatically trigger the portal dive
      if (
        !isTransitioningRef.current &&
        cinematicPhase !== 'SCENE_4_WARP' &&
        cinematicPhase !== 'EXPLORING_SITE' &&
        currentScrollY > 40
      ) {
        triggerEnterExperience();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cinematicPhase]);

  // 3. Audio Toggle Handler
  const handleToggleAudio = useCallback(() => {
    soundEngine.init();
    const active = soundEngine.toggleMute();
    setIsPlayingAudio(active);
    if (active) {
      soundEngine.startAtmosphericDrone();
      soundEngine.playThemeMusic();
    }
  }, []);

  // 4. Trigger Scene 4: "ENTER THE EXPERIENCE" Portal Dive Warp
  const triggerEnterExperience = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // Start atmospheric audio if initialized
    soundEngine.init();
    soundEngine.playWarpImpact();
    if (isPlayingAudio) {
      soundEngine.playThemeMusic();
    }

    setCinematicPhase('SCENE_4_WARP');
    setShowWarpFlash(true);

    // GSAP Warp Progression
    const warpObj = { progress: 0 };
    warpTimelineRef.current = gsap.timeline({
      onUpdate: () => {
        setWarpProgress(warpObj.progress);
      },
      onComplete: () => {
        setCinematicPhase('EXPLORING_SITE');
        setShowWarpFlash(false);
      },
    });

    warpTimelineRef.current.to(warpObj, {
      progress: 1.0,
      duration: 1.6,
      ease: 'power3.inOut',
    });
  }, [isPlayingAudio]);

  // 5. Callback when Three.js camera passes through the rift
  const handleTransitionComplete = useCallback(() => {
    setCinematicPhase('EXPLORING_SITE');
    setShowWarpFlash(false);
  }, []);

  // 6. Portal Hover Feedback
  const handleHoverPortalStart = useCallback(() => {
    setIsHoveredPortal(true);
    soundEngine.playElectricArc();
  }, []);

  const handleHoverPortalEnd = useCallback(() => {
    setIsHoveredPortal(false);
  }, []);

  // Cleanup audio & GSAP timelines on unmount
  useEffect(() => {
    return () => {
      soundEngine.dispose();
      if (warpTimelineRef.current) {
        warpTimelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="st-page relative min-h-screen bg-[#020409] text-[#e8d5b5] overflow-x-hidden selection:bg-[#e50914] selection:text-white">
      <SEO
        title="Code Carnival 2.0 — The Upside Down of Code | AI Student Chapter"
        description="Enter the Upside Down! Code Carnival 2.0 is an AAA cinematic 24-hour State Level Hackathon with ₹50K+ prize pool organized by AI Student Chapter, RCPET's IMRD."
      />

      {/* 1. Real-time 3D Supernatural Canvas with Error Boundary & CSS Fallback */}
      <WebGLErrorBoundary fallback={<WebGLFallback entering={cinematicPhase === 'SCENE_4_WARP'} />}>
        <SupernaturalScene
          cinematicPhase={cinematicPhase}
          awakenProgress={awakenProgress}
          warpProgress={warpProgress}
          scrollY={scrollY}
          performance={performance}
          onTransitionComplete={handleTransitionComplete}
          isHoveredPortal={isHoveredPortal}
        />
      </WebGLErrorBoundary>

      {/* 2. Opening Cinematic UI Overlay (Scenes 1 to 4) */}
      <CinematicOverlay
        cinematicPhase={cinematicPhase}
        onEnterExperience={triggerEnterExperience}
        onHoverPortalStart={handleHoverPortalStart}
        onHoverPortalEnd={handleHoverPortalEnd}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
      />

      {/* 3. Blinding Dimensional Warp Flash */}
      {showWarpFlash && <div className="st-warp-flash" />}

      {/* 4. Full Event Website Content (Revealed after portal dive) */}
      {cinematicPhase === 'EXPLORING_SITE' && (
        <EventWebsiteContent
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* 5. Analog CRT Scanlines & Atmospheric Vignette */}
      <VHSOverlay />
    </div>
  );
};

export default CodeCarnival;
