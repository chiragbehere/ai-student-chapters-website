// SupernaturalScene.tsx
// Full-screen AAA 3D Supernatural Canvas: Supernatural Forest, Procedural Rift, Lightning, Mist, and Particles
import React, { useEffect, useState, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import ProceduralTrees from './ProceduralTrees';
import ForestTerrain from './ForestTerrain';
import SupernaturalPortal from './SupernaturalPortal';
import LightningDirector from './LightningDirector';
import InstancedForestParticles from './InstancedForestParticles';
import CinematicCamera from './CinematicCamera';
import type { PerformanceSettings } from './PerformanceManager';

export class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL Rendering Error caught by Boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SupernaturalSceneProps {
  cinematicPhase: 'SCENE_1_INTRO' | 'SCENE_2_AWAKEN' | 'SCENE_3_REVEAL' | 'SCENE_4_WARP' | 'EXPLORING_SITE';
  awakenProgress: number;
  warpProgress: number;
  scrollY?: number;
  performance: PerformanceSettings;
  onTransitionComplete?: () => void;
  isHoveredPortal?: boolean;
}

export const SupernaturalScene: React.FC<SupernaturalSceneProps> = ({
  cinematicPhase,
  awakenProgress = 1.0,
  warpProgress = 0.0,
  scrollY = 0,
  performance,
  onTransitionComplete,
  isHoveredPortal = false,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coords -1 to +1
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
        camera={{ position: [0, 0.4, 13.5], fov: performance.isMobile ? 65 : 55, near: 0.1, far: 80 }}
        dpr={performance.tier === 'HIGH' ? Math.min(window.devicePixelRatio, 2) : 1}
        gl={{
          antialias: performance.tier === 'HIGH',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        {/* Supernatural Forest Fog & Void Background */}
        <color attach="background" args={['#020409']} />
        <fogExp2
          attach="fog"
          args={[
            cinematicPhase === 'SCENE_4_WARP' ? '#330308' : '#03050c',
            cinematicPhase === 'SCENE_4_WARP' ? 0.18 : 0.082,
          ]}
        />

        {/* Ambient & Moonlight Lighting */}
        <ambientLight intensity={0.25} color="#150508" />
        <directionalLight position={[0, 15, 8]} intensity={0.35} color="#2b3b5c" />

        {/* 1. Procedural Ancient Gnarled Forest Trees */}
        <ProceduralTrees isMobile={performance.isMobile} />

        {/* 2. Corrupted Forest Floor & Drifting Mist */}
        <ForestTerrain isMobile={performance.isMobile} />

        {/* 3. Central Dimensional Rift Portal */}
        <SupernaturalPortal
          awakenProgress={awakenProgress}
          warpProgress={warpProgress}
          isHovered={isHoveredPortal}
        />

        {/* 4. Distant Red Lightning Flash Director */}
        <LightningDirector enabled={cinematicPhase !== 'SCENE_4_WARP'} />

        {/* 5. Instanced Spores & Rising Hot Embers */}
        <InstancedForestParticles
          count={performance.particleCount}
          warpProgress={warpProgress}
        />

        {/* 6. Cinematic Camera with GSAP Transitions */}
        <CinematicCamera
          cinematicPhase={cinematicPhase}
          warpProgress={warpProgress}
          scrollY={scrollY}
          mousePos={mousePos}
          isMobile={performance.isMobile}
          onTransitionComplete={onTransitionComplete}
        />
      </Canvas>
    </div>
  );
};

export default SupernaturalScene;
