// LightningDirector.tsx
// AAA Cinematic Red Lightning Generator: Multi-strike strobe flashes, dynamic point lighting, and atmospheric fog illumination
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import soundEngine from './SoundEngine';

interface LightningDirectorProps {
  enabled?: boolean;
}

export const LightningDirector: React.FC<LightningDirectorProps> = ({ enabled = true }) => {
  const { scene } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);
  const flashIntensity = useRef(0);
  const baseFogColor = useMemo(() => new THREE.Color('#03050c'), []);
  const flashFogColor = useMemo(() => new THREE.Color('#3d060b'), []);

  // Flash sequence scheduler
  useEffect(() => {
    if (!enabled) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const executeStrike = () => {
      // Strike sequence: initial spike, drop, micro re-strike, decay
      flashIntensity.current = 8.0 + Math.random() * 6.0;

      // Play procedural thunder crack
      soundEngine.playLightningThunder();

      setTimeout(() => {
        flashIntensity.current = 2.0;
        setTimeout(() => {
          flashIntensity.current = 10.0; // Secondary flash
        }, 60);
      }, 70);

      // Schedule next random strike between 6 and 14 seconds
      const nextDelay = 6000 + Math.random() * 8000;
      timeoutId = setTimeout(executeStrike, nextDelay);
    };

    // Initial first strike after 2.5 seconds
    timeoutId = setTimeout(executeStrike, 2500);

    return () => clearTimeout(timeoutId);
  }, [enabled]);

  useFrame((_, delta) => {
    // Exponential decay of lightning light
    flashIntensity.current = THREE.MathUtils.damp(flashIntensity.current, 0, 9.0, delta);

    if (lightRef.current) {
      lightRef.current.intensity = flashIntensity.current;
    }

    // Dynamic fog color shift during flash
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      const flashFactor = Math.min(flashIntensity.current / 8.0, 1.0);
      scene.fog.color.lerpColors(baseFogColor, flashFogColor, flashFactor);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 8, -4]}
      color="#ff3344"
      intensity={0}
      distance={35}
      decay={1.8}
    />
  );
};

export default LightningDirector;
