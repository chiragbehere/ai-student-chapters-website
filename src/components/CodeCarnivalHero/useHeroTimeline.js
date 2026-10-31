// useHeroTimeline.js
// Orchestrates the Code Carnival opening sequence:
// 1. forest preset + ambient audio
// 2. crackle & first lightning
// 3. portal_open.wav + halo scale up + cross-fade to portal lighting preset
// 4. cinematic_impact.wav + title reveal
import { useState, useEffect, useRef, useCallback } from 'react';

export function useHeroTimeline({ audioManager, lightningController, onPortalOpen, onComplete }) {
  const [phase, setPhase] = useState('INIT'); // INIT, FOREST, LIGHTNING, PORTAL_OPEN, TITLE_REVEAL, COMPLETE
  const [lightingPreset, setLightingPreset] = useState('forest');
  const [haloScale, setHaloScale] = useState(1.0);
  const [titleVisible, setTitleVisible] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const timelineRan = useRef(false);

  const startTimeline = useCallback(() => {
    if (timelineRan.current) return;
    timelineRan.current = true;

    // Step 1: Forest Atmosphere
    setPhase('FOREST');
    setLightingPreset('forest');

    // Step 2: Electric crackle & first lightning after 2.2 seconds
    const t1 = setTimeout(() => {
      setPhase('LIGHTNING');
      if (audioManager) audioManager.shot('crackle', 0.9);
      if (lightningController) lightningController.trigger();
    }, 2200);

    // Step 3: Portal awakening after 4.0 seconds
    const t2 = setTimeout(() => {
      setPhase('PORTAL_OPEN');
      if (audioManager) audioManager.shot('open', 1.0);
      setLightingPreset('portal');
      if (onPortalOpen) onPortalOpen();
    }, 4200);

    // Step 4: Cinematic impact & title reveal after 6.2 seconds
    const t3 = setTimeout(() => {
      setPhase('TITLE_REVEAL');
      if (audioManager) audioManager.shot('impact', 1.0);
      setTitleVisible(true);
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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
    transitionProgress,
    startTimeline,
    enterExperience,
  };
}

export default useHeroTimeline;
