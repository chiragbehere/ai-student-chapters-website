// CinematicCamera.tsx
// AAA Camera Director: Smooth forward forest dolly, mouse parallax, scroll progression, and portal dive warp
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicCameraProps {
  cinematicPhase: 'SCENE_1_INTRO' | 'SCENE_2_AWAKEN' | 'SCENE_3_REVEAL' | 'SCENE_4_WARP' | 'EXPLORING_SITE';
  warpProgress: number; // 0 to 1
  scrollY: number;
  mousePos: { x: number; y: number };
  isMobile: boolean;
  onTransitionComplete?: () => void;
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  cinematicPhase,
  warpProgress,
  scrollY,
  mousePos,
  isMobile,
  onTransitionComplete,
}) => {
  const { camera } = useThree();
  const introProgress = useRef(0);
  const transitionFired = useRef(false);

  // Initial camera setup
  useEffect(() => {
    camera.position.set(0, 0.4, 13.5);
    camera.lookAt(0, 0.5, -2);
  }, [camera]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (cinematicPhase === 'SCENE_4_WARP') {
      // Hyperdrive dive through the portal rift
      // Target Z goes from current pos to behind the portal (-4.5)
      const warpZ = THREE.MathUtils.lerp(5.5, -4.5, warpProgress);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, warpZ, 5.0, delta);

      // Camera shake during rift penetration
      const shakeAmp = Math.sin(warpProgress * Math.PI) * 0.12;
      camera.position.x = (Math.random() - 0.5) * shakeAmp;
      camera.position.y = 0.5 + (Math.random() - 0.5) * shakeAmp;

      camera.lookAt(0, 0.5, -6);

      if (warpProgress >= 0.95 && !transitionFired.current) {
        transitionFired.current = true;
        onTransitionComplete?.();
      }
    } else if (cinematicPhase === 'EXPLORING_SITE') {
      // Inside the Event Site: Camera floats ambiently behind content with gentle scroll depth
      const scrollOffset = Math.min(scrollY / 1200, 2.5);
      const targetX = mousePos.x * 0.5;
      const targetY = 0.4 - mousePos.y * 0.3 - scrollOffset * 0.4;
      const targetZ = 5.2 - scrollOffset * 0.6;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.0, delta);
      camera.lookAt(0, 0.5, -2);
    } else {
      // Cinematic Scenes 1, 2, 3: Forward corridor dolly
      introProgress.current += delta * 0.22;
      const progress = Math.min(introProgress.current, 1.0);

      // Base camera trajectory: from z = 13.5 -> 6.2 (or 7.5 on mobile)
      const targetBaseZ = isMobile ? 7.6 : 6.0;
      const dollyZ = THREE.MathUtils.lerp(13.5, targetBaseZ, progress);

      // Subtle handheld breathing sway
      const swayX = Math.sin(t * 0.8) * 0.08 + mousePos.x * (isMobile ? 0.3 : 0.65);
      const swayY = 0.45 + Math.cos(t * 0.7) * 0.06 - mousePos.y * (isMobile ? 0.2 : 0.4);

      // Push forward slightly during Scene 3 reveal
      const revealPush = cinematicPhase === 'SCENE_3_REVEAL' ? 0.6 : 0.0;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, swayX, 2.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, swayY, 2.0, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, dollyZ - revealPush, 1.8, delta);

      camera.lookAt(0, 0.5, -2);
    }
  });

  return null;
};

export default CinematicCamera;
