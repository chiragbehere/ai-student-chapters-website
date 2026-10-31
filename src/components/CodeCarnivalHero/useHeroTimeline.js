// useHeroTimeline.js
// Orchestrates the AAA 5-Phase Code Carnival opening sequence:
// Phase 1: Silent dark forest reveals through rolling mist + eerie ambient drone
// Phase 2: Electric surge, red lightning strikes, and thunder clap
// Phase 3: The portal awakens: cracks illuminate, energy ribbons spin, crimson keylight
// Phase 4: Cinematic impact bass + Stranger Things high-contrast title card
// Phase 5: "ENTER THE EXPERIENCE" portal dive CTA emerges
import { useState, useRef, useCallback } from 'react';

export function useHeroTimeline({ audioManager, lightningController, onPortalOpen, onComplete }) {
  const [phase, setPhase] = useState('INIT'); // INIT, FOREST, LIGHTNING, PORTAL_OPEN, TITLE_REVEAL, CTA_READY, COMPLETE
  const [lightingPreset, setLightingPreset] = useState('forest');
  const [haloScale, setHaloScale] = useState(1.0);
  const [titleVisible, setTitleVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [telemetryMessage, setTelemetryMessage] = useState('HAWKINS LAB TELEMETRY // SCANNING SECTOR 04...');
  const [transitionProgress, setTransitionProgress] = useState(0);
  const timelineRan = useRef(false);

  const startTimeline = useCallback(() => {
    if (timelineRan.current) return;
    timelineRan.current = true;

    // Step 1: Forest Atmosphere (0.0s)
    setPhase('FOREST');
    setLightingPreset('forest');
    setTelemetryMessage('DEPT OF ENERGY // SENSOR GRID 04 ACTIVE');

    // Step 2: Electric crackle & first lightning strikes (2.8s)
    const t1 = setTimeout(() => {
      setPhase('LIGHTNING');
      setTelemetryMessage('WARNING: POWER GRID VOLTAGE SPIKE // 104.7 MHz DETECTED');
      if (audioManager) audioManager.shot('crackle', 1.0);
      if (lightningController) lightningController.trigger();
    }, 2800);

    // Step 3: Second lightning burst (4.2s)
    const t2 = setTimeout(() => {
      if (audioManager) audioManager.shot('crackle', 0.85);
      if (lightningController) lightningController.trigger();
    }, 4200);

    // Step 4: Portal awakening & energy vortex (5.5s)
    const t3 = setTimeout(() => {
      setPhase('PORTAL_OPEN');
      setTelemetryMessage('DIMENSIONAL RIFT ACTIVE // TRANS-REALM GATE STABILIZED');
      if (audioManager) audioManager.shot('open', 1.0);
      setLightingPreset('portal');
      setHaloScale(1.4);
      if (onPortalOpen) onPortalOpen();
    }, 5500);

    // Step 5: Cinematic impact & high-contrast title reveal (8.0s)
    const t4 = setTimeout(() => {
      setPhase('TITLE_REVEAL');
      setTelemetryMessage('HAWKINS LAB // CLASSIFIED HACKATHON MISSION UNSEALED');
      if (audioManager) audioManager.shot('impact', 1.0);
      setTitleVisible(true);
    }, 8000);

    // Step 6: CTA button slides up with energy pulse (9.8s)
    const t5 = setTimeout(() => {
      setPhase('CTA_READY');
      setCtaVisible(true);
    }, 9800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [audioManager, lightningController, onPortalOpen]);

  // Trigger warp transition out of the intro
  const enterExperience = useCallback(() => {
    if (audioManager) audioManager.shot('transition', 1.0);
    setPhase('COMPLETE');
    setLightingPreset('red_alert');
    let p = 0;
    const interval = setInterval(() => {
      p += 0.05;
      if (p >= 1.0) {
        clearInterval(interval);
        setTransitionProgress(1.0);
        if (onComplete) onComplete();
      } else {
        setTransitionProgress(p);
      }
    }, 30);
  }, [audioManager, onComplete]);

  return {
    phase,
    lightingPreset,
    haloScale,
    setHaloScale,
    titleVisible,
    ctaVisible,
    telemetryMessage,
    transitionProgress,
    startTimeline,
    enterExperience,
  };
}

export default useHeroTimeline;

