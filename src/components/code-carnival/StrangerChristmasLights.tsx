// StrangerChristmasLights.tsx
// Authentic Stranger Things Element: Hanging 3D Christmas lights strung between trees/bunker
// Features: Catenary hanging wire cables, colored incandescent bulbs, and supernatural flickering
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BULB_COLORS = [
  '#e50914', // Red
  '#ff6b35', // Orange
  '#ffd700', // Gold/Yellow
  '#4ecdc4', // Cyan
  '#45b7d1', // Blue
  '#dda0dd', // Violet
  '#ff69b4', // Pink
  '#22ff66', // Lime Green
];

interface StrangerChristmasLightsProps {
  position?: [number, number, number];
  width?: number;
  sag?: number;
}

export const StrangerChristmasLights: React.FC<StrangerChristmasLightsProps> = ({
  position = [0, 2.8, 10],
  width = 8.5,
  sag = 0.9,
}) => {
  const bulbsRef = useRef<THREE.Group>(null);
  const bulbCount = 18;

  // Generate hanging wire curve (catenary curve approximation)
  const { curve, bulbPoints } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * 2 - 1; // -1 to 1
      const x = (t * width) / 2;
      const y = -sag * (1 - t * t); // Parabolic sag
      const z = Math.sin(t * Math.PI) * 0.4;
      points.push(new THREE.Vector3(x, y, z));
    }
    const catCurve = new THREE.CatmullRomCurve3(points);

    // Sample bulb positions along curve
    const bPts: Array<{ pos: THREE.Vector3; color: string; phase: number }> = [];
    for (let b = 0; b < bulbCount; b++) {
      const u = (b + 0.5) / bulbCount;
      const pt = catCurve.getPoint(u);
      bPts.push({
        pos: pt,
        color: BULB_COLORS[b % BULB_COLORS.length],
        phase: b * 0.45,
      });
    }

    return { curve: catCurve, bulbPoints: bPts };
  }, [width, sag, bulbCount]);

  const wireGeom = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, 0.02, 6, false);
  }, [curve]);

  const wireMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#0d120d' });
  }, []);

  // Shared bulb geometry
  const bulbGeom = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.12, 12, 12);
    geo.scale(1.0, 1.45, 1.0); // Teardrop elongated bulb shape
    return geo;
  }, []);

  const socketGeom = useMemo(() => {
    return new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8);
  }, []);

  const socketMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#061a0a' });
  }, []);

  useFrame((state) => {
    if (!bulbsRef.current) return;
    const t = state.clock.getElapsedTime();

    bulbsRef.current.children.forEach((child, idx) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const bp = bulbPoints[idx];
        if (bp) {
          // Supernatural flickering: subtle humming with occasional dimming and surges
          const flicker =
            Math.sin(t * 8.0 + bp.phase) * 0.25 +
            Math.sin(t * 19.0 + bp.phase * 2.0) * 0.15 +
            0.75;
          child.material.emissiveIntensity = Math.max(0.2, flicker * 1.5);
        }
      }
    });
  });

  return (
    <group position={position}>
      {/* 1. Dark Green Insulated Hanging Cable */}
      <mesh geometry={wireGeom} material={wireMat} />

      {/* 2. Individual Incandescent Colored Bulbs */}
      <group ref={bulbsRef}>
        {bulbPoints.map((b, i) => (
          <group key={i} position={b.pos}>
            {/* Dark green socket mount */}
            <mesh geometry={socketGeom} material={socketMat} position={[0, 0.07, 0]} />
            {/* Glowing teardrop glass bulb */}
            <mesh geometry={bulbGeom}>
              <meshStandardMaterial
                color={b.color}
                emissive={b.color}
                emissiveIntensity={1.2}
                roughness={0.2}
                metalness={0.1}
              />
            </mesh>
            {/* Subtle local glow point light on every 3rd bulb */}
            {i % 3 === 0 && (
              <pointLight color={b.color} intensity={0.65} distance={3.2} decay={2} />
            )}
          </group>
        ))}
      </group>
    </group>
  );
};

export default StrangerChristmasLights;
