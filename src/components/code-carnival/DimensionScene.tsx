// DimensionScene.tsx
// Full 3D environment with R3F Canvas, camera controller, volumetric fog, and fallback
import React, { useRef, useEffect, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Portal3D from './Portal3D';
import PortalParticles from './PortalParticles';
import type { PerformanceSettings } from './PerformanceManager';

interface DimensionSceneProps {
  intensity?: number;
  entering?: boolean;
  scrollY?: number;
  performance: PerformanceSettings;
  onTransitionComplete?: () => void;
}

// WebGL Error Boundary to render graceful CSS fallback
export class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL rendering fallback activated:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Camera controller with cinematic easing, mouse parallax, and transition zoom
function CinematicCamera({
  entering,
  scrollY = 0,
  mousePos,
  onTransitionComplete,
}: {
  entering: boolean;
  scrollY: number;
  mousePos: { x: number; y: number };
  onTransitionComplete?: () => void;
}) {
  const { camera } = useThree();
  const transitionProgress = useRef(0);
  const firedComplete = useRef(false);

  useFrame((_, delta) => {
    if (entering) {
      // Zoom through the portal during transition
      transitionProgress.current += delta * 1.2;
      
      // Dolly camera forward right into the rift
      const targetZ = THREE.MathUtils.lerp(3.5, -2.5, Math.min(transitionProgress.current, 1));
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
      
      // Subtle cinematic camera shake during dimensional penetration
      const shake = Math.sin(transitionProgress.current * 40) * 0.04 * (1 - transitionProgress.current);
      camera.position.x += shake;
      camera.position.y += shake;

      if (transitionProgress.current >= 1.0 && !firedComplete.current) {
        firedComplete.current = true;
        onTransitionComplete?.();
      }
    } else {
      // Gentle scroll depth & mouse parallax
      const scrollOffset = Math.min(scrollY / 1000, 1.2);
      const targetX = mousePos.x * 0.6;
      const targetY = -mousePos.y * 0.4;
      const targetZ = 3.6 - scrollOffset * 0.8;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.0, delta);
      camera.lookAt(0, 0, -2);
    }
  });

  return null;
}

// Distant dimensional silhouettes / floating corrupted obelisks
function DistantSilhouettes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, -8]}>
      {/* Dark jagged pillar silhouettes */}
      <mesh position={[-4.5, 0, 0]} rotation={[0, 0.2, 0.05]}>
        <boxGeometry args={[0.8, 8, 0.8]} />
        <meshBasicMaterial color="#060814" />
      </mesh>
      <mesh position={[4.2, -0.5, -1]} rotation={[0, -0.3, -0.08]}>
        <boxGeometry args={[1.0, 7.5, 0.9]} />
        <meshBasicMaterial color="#050610" />
      </mesh>
      <mesh position={[-2.8, -1.2, -2]} rotation={[0, 0.1, -0.04]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshBasicMaterial color="#070916" />
      </mesh>
      <mesh position={[3.1, -1.5, -2]} rotation={[0, 0.1, 0.06]}>
        <boxGeometry args={[0.6, 6.2, 0.6]} />
        <meshBasicMaterial color="#060714" />
      </mesh>
    </group>
  );
}

export const DimensionScene: React.FC<DimensionSceneProps> = ({
  intensity = 1.0,
  entering = false,
  scrollY = 0,
  performance,
  onTransitionComplete,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates -1 to 1
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
        camera={{ position: [0, 0, 3.6], fov: 60 }}
        dpr={performance.tier === 'HIGH' ? [1, 2] : [1, 1.5]}
        gl={{
          antialias: performance.tier === 'HIGH',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        {/* Deep blue/black volumetric fog with red transition hue */}
        <color attach="background" args={['#04050d']} />
        <fogExp2
          attach="fog"
          args={[entering ? '#250508' : '#04060f', entering ? 0.22 : 0.08]}
        />

        {/* Cinematic ambient lights */}
        <ambientLight intensity={0.4} color="#1c2541" />
        <directionalLight
          position={[0, 10, 5]}
          intensity={0.3}
          color="#3a506b"
        />

        {/* 3D Dimensional Portal Rift */}
        <Portal3D
          intensity={intensity}
          entering={entering}
          mousePos={mousePos}
        />

        {/* Multi-depth Spore & Ember Particle Field */}
        <PortalParticles
          count={performance.particleCount}
          entering={entering}
          mousePos={mousePos}
        />

        {/* Distant mysterious silhouettes */}
        <DistantSilhouettes />

        {/* Camera controller */}
        <CinematicCamera
          entering={entering}
          scrollY={scrollY}
          mousePos={mousePos}
          onTransitionComplete={onTransitionComplete}
        />
      </Canvas>
    </div>
  );
};

export default DimensionScene;
