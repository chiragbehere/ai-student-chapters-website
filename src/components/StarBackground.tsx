import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useState, useRef, Suspense, useMemo } from "react";
import type { Points as PointsType } from "three";

// Detect low-end device once at module level
const IS_LOW_END = typeof window !== 'undefined' && (
  window.innerWidth <= 768 ||
  (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4) ||
  window.matchMedia('(hover: none) and (pointer: coarse)').matches
);

const STAR_COUNT = IS_LOW_END ? 1500 : 3500;
const POINT_SIZE = IS_LOW_END ? 0.005 : 0.002;
// Cap DPR — huge perf win on high-DPI mobile screens
const MAX_DPR = IS_LOW_END ? 1 : 1.5;

// Generate random points inside a sphere
function generateSpherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

const StarBackground = () => {
  const ref = useRef<PointsType | null>(null);
  const [sphere] = useState(() => generateSpherePoints(STAR_COUNT, 1.2));

  // Slower rotation = fewer visible updates = less GPU work
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={sphere}
        frustumCulled
      >
        <PointMaterial
          transparent
          color="#fff"
          size={POINT_SIZE}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => {
  // Memoize DPR to avoid re-computation
  const dpr = useMemo(() => Math.min(window.devicePixelRatio || 1, MAX_DPR), []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
    }} className="stars-canvas-opacity">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={dpr}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        frameloop={IS_LOW_END ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
