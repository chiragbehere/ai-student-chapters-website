// SupernaturalWorld.tsx
// 100% Authentic Stranger Things 3D Universe
// Features:
// - Cascading multi-string incandescent Christmas fairy lights framing the viewport (Byers' house)
// - Vertical cascading Christmas light drops along the margins
// - The 3D Byers' Alphabet Light Wall actively communicating letters & words in real-time
// - Towering Mind Flayer silhouette emerging in the stormy red sky
// - Rolling volumetric ground mist & soft floating Upside Down spores and rising embers
// - The Central Glowing Dimensional Rift (The Gate)
// - Distant red lightning strikes
// (All unwanted abstract geometric primitive shapes, black worm tubes, and generic toruses purged)
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ForestTerrain from './ForestTerrain';
import { ChristmasLightGarland, ChristmasLightDrop } from './StrangerChristmasLights';
import AlphabetLightsWall from './AlphabetLightsWall';
import SupernaturalPortal from './SupernaturalPortal';
import LightningDirector from './LightningDirector';
import MindFlayerSky from './MindFlayerSky';
import InstancedForestParticles from './InstancedForestParticles';
import CinematicScrollCamera from './CinematicScrollCamera';
import type { PerformanceSettings } from './PerformanceManager';

interface SupernaturalWorldProps {
  scrollProgress: number; // 0.0 to 1.0
  activeZoneIndex?: number;
  performance: PerformanceSettings;
}

export const SupernaturalWorld: React.FC<SupernaturalWorldProps> = ({
  scrollProgress,
  performance,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.5, 16.0], fov: performance.isMobile ? 65 : 55, near: 0.1, far: 85 }}
        dpr={performance.tier === 'HIGH' ? Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) : 1}
        gl={{
          antialias: performance.tier === 'HIGH' && !performance.isMobile,
          alpha: true,
          powerPreference: performance.isMobile ? 'default' : 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        {/* Dark Supernatural Void with Atmospheric Fog */}
        <color attach="background" args={['#020308']} />
        <fogExp2 attach="fog" args={['#02040a', 0.055]} />

        {/* Ambient & Moonlight Lighting */}
        <ambientLight intensity={0.25} color="#181a28" />
        <directionalLight position={[0, 16, 10]} intensity={0.25} color="#253046" />

        {/* 1. Deep Distant Mind Flayer Silhouette in the Storm Sky */}
        <MindFlayerSky scrollProgress={scrollProgress} />

        {/* 2. Corrupted Forest Ground & Drifting Volumetric Mist */}
        <ForestTerrain isMobile={performance.isMobile} />

        {/* 3. The Iconic Stranger Things Christmas Lightings (The Hero Elements) */}
        {/* String 1: Foreground entrance canopy draped gracefully across the top of the screen */}
        <ChristmasLightGarland position={[0, 1.48, 14.5]} width={8.5} sag={0.52} bulbCount={18} />

        {/* String 2: Upper swag just behind the foreground canopy */}
        <ChristmasLightGarland position={[0, 1.88, 13.0]} width={9.5} sag={0.65} bulbCount={20} />

        {/* Vertical Light Drops: Framing the left and right sides of the viewport */}
        <ChristmasLightDrop position={[-3.1, 1.38, 14.2]} length={2.2} bulbCount={8} />
        <ChristmasLightDrop position={[3.1, 1.38, 14.2]} length={2.2} bulbCount={8} />

        {/* String 3: Midground draped garland crossing the corridor */}
        <ChristmasLightGarland position={[0, 1.55, 10.5]} width={8.0} sag={0.6} bulbCount={18} />

        {/* 4. The 3D Byers' Alphabet Christmas Light Wall (Prominently visible ahead) */}
        <AlphabetLightsWall position={[0, 0.35, 7.0]} scale={[0.88, 0.88, 0.88]} />

        {/* String 4: Approaching the Portal Rift */}
        <ChristmasLightGarland position={[0, 1.4, 2.5]} width={6.5} sag={0.5} bulbCount={16} />

        {/* 5. The Central Glowing Dimensional Rift (The Gate) */}
        <group position={[0, 0, -4.5]}>
          <SupernaturalPortal
            awakenProgress={0.45 + scrollProgress * 0.55}
            warpProgress={scrollProgress > 0.88 ? (scrollProgress - 0.88) * 8.0 : 0.0}
          />
        </group>

        {/* 6. Distant Red Lightning Flashes illuminating the sky & Mind Flayer */}
        <LightningDirector enabled={true} />

        {/* 7. Soft Circular Drifting Spores & Rising Hot Embers */}
        <InstancedForestParticles
          count={performance.particleCount}
          warpProgress={scrollProgress > 0.88 ? (scrollProgress - 0.88) * 5.0 : 0}
        />

        {/* 8. Cinematic Camera gliding forward under the Christmas light garlands */}
        <CinematicScrollCamera
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          isMobile={performance.isMobile}
        />
      </Canvas>
    </div>
  );
};

export default SupernaturalWorld;
