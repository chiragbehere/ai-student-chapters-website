// SupernaturalWorld.tsx
// Full-screen AAA 3D Spatial Universe spanning Chapters 01 to 06
// 100% Authentic Stranger Things World:
// - Ancient Gnarled Forest & Volumetric Ground Mist
// - Hanging 3D Christmas Lights (Byers' House)
// - Creeping Mind Flayer Tendril Vines
// - Distant Looming Mind Flayer (Shadow Monster) Silhouette
// - Hawkins Laboratory Industrial Bunker & CRT Console
// - Authentic Lab Relics: EEG Station, Cerebro Radio, Security Fence, Spacetime Rift
// - Heavy Blast Vault Door unsealing with golden treasure spill
// - Hawkins Underground Tunnel Map Room
// - Colossal Final Gate Singularity
// - Distant Red Lightning & Upside Down Spores
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ProceduralTrees from './ProceduralTrees';
import ForestTerrain from './ForestTerrain';
import StrangerChristmasLights from './StrangerChristmasLights';
import CreepingMindFlayerVines from './CreepingMindFlayerVines';
import MindFlayerShadow from './MindFlayerShadow';
import BunkerEnvironment from './BunkerEnvironment';
import ChallengeProps from './ChallengeProps';
import VaultDoor from './VaultDoor';
import TacticalCommandRoom from './TacticalCommandRoom';
import FinalGatePortal from './FinalGatePortal';
import LightningDirector from './LightningDirector';
import InstancedForestParticles from './InstancedForestParticles';
import CinematicScrollCamera from './CinematicScrollCamera';
import type { PerformanceSettings } from './PerformanceManager';

interface SupernaturalWorldProps {
  scrollProgress: number; // 0.0 to 1.0
  activeZoneIndex: number;
  performance: PerformanceSettings;
}

export const SupernaturalWorld: React.FC<SupernaturalWorldProps> = ({
  scrollProgress,
  activeZoneIndex,
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

  // Compute adaptive fog color based on chapter
  const fogColor =
    scrollProgress < 0.15
      ? '#020409'
      : scrollProgress < 0.45
      ? '#06070e'
      : scrollProgress < 0.70
      ? '#080507'
      : '#030206';

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.6, 17.0], fov: performance.isMobile ? 65 : 55, near: 0.1, far: 95 }}
        dpr={performance.tier === 'HIGH' ? Math.min(window.devicePixelRatio, 2) : 1}
        gl={{
          antialias: performance.tier === 'HIGH',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <color attach="background" args={[fogColor]} />
        <fogExp2 attach="fog" args={[fogColor, 0.052]} />

        {/* Ambient & Moonlight Lighting */}
        <ambientLight intensity={0.22} color="#151824" />
        <directionalLight position={[0, 16, 10]} intensity={0.32} color="#2b3b5c" />

        {/* ── CHAPTER 01: Deep Supernatural Forest Realm (z: +18 to -4) ── */}
        <ProceduralTrees isMobile={performance.isMobile} />
        <ForestTerrain isMobile={performance.isMobile} />
        <LightningDirector enabled={scrollProgress < 0.35} />

        {/* ── Authentic Stranger Things Christmas Lights ── */}
        <StrangerChristmasLights position={[0, 2.8, 12]} width={8.5} sag={0.8} />
        <StrangerChristmasLights position={[0, 2.6, 4]} width={8.0} sag={0.9} />

        {/* ── Creeping Mind Flayer Parasitic Tendril Vines ── */}
        <CreepingMindFlayerVines scrollProgress={scrollProgress} />

        {/* ── Colossal Mind Flayer Shadow Monster in Distant Sky ── */}
        <MindFlayerShadow scrollProgress={scrollProgress} />

        {/* ── CHAPTER 02 & 03: Hawkins Lab Bunker & CRT Station (z: +2 to -22) ── */}
        <BunkerEnvironment scrollProgress={scrollProgress} />

        {/* ── CHAPTER 03: Authentic Hawkins Lab Relics & Challenge Props (z: -9 to -23) ── */}
        <ChallengeProps scrollProgress={scrollProgress} activeZoneIndex={activeZoneIndex} />

        {/* ── CHAPTER 04: Heavy Hawkins Lab Blast Vault Door (z: -28) ── */}
        <VaultDoor scrollProgress={scrollProgress} />

        {/* ── CHAPTER 05: Hawkins Underground Tunnel War-Room (z: -38) ── */}
        <TacticalCommandRoom scrollProgress={scrollProgress} />

        {/* ── CHAPTER 06: The Final Singularity Gate (z: -52) ── */}
        <FinalGatePortal scrollProgress={scrollProgress} />

        {/* Continuous Upside Down Spores & Rising Embers across the entire spatial realm */}
        <InstancedForestParticles
          count={performance.particleCount}
          warpProgress={scrollProgress > 0.85 ? (scrollProgress - 0.85) * 6.0 : 0}
        />

        {/* Spline-driven 6-Chapter Cinematic Camera */}
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
