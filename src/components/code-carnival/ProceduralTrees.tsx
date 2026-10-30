// ProceduralTrees.tsx
// AAA Supernatural Forest: Gnarled ancient trees, twisted branches, protruding roots, and hanging tendrils
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralTreesProps {
  isMobile?: boolean;
}

// Helper to create a twisted gnarled tree geometry using CatmullRomCurve3
function createGnarledTrunkGeometry(height: number, radiusBottom: number, seed: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const segments = 8;
  const rng = (s: number) => Math.sin(s * 9301 + 49297) * 0.5;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * height - height * 0.05;
    const x = Math.sin(t * Math.PI * 1.5 + seed) * (0.4 + rng(seed + i) * 0.3) * (1 - t * 0.4);
    const z = Math.cos(t * Math.PI * 1.2 + seed * 1.3) * (0.3 + rng(seed * 2 + i) * 0.25) * (1 - t * 0.4);
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 18, radiusBottom, 7, false);
  return geometry;
}

// Single Ancient Tree Component
const TreeEntity: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  seed: number;
  barkMaterial: THREE.Material;
  rootMaterial: THREE.Material;
}> = ({ position, rotation, scale, seed, barkMaterial, rootMaterial }) => {
  const trunkRef = useRef<THREE.Group>(null);

  // Generate unique geometry per tree seed
  const { trunkGeom, branch1Geom, branch2Geom, rootGeoms } = useMemo(() => {
    const tGeom = createGnarledTrunkGeometry(6.5, 0.42, seed);

    // Primary branch 1 reaching inward toward center
    const b1Points = [
      new THREE.Vector3(0, 3.8, 0),
      new THREE.Vector3(Math.sin(seed) * 0.9, 4.8, Math.cos(seed) * 0.7),
      new THREE.Vector3(Math.sin(seed + 1) * 1.8, 5.8, Math.cos(seed + 1) * 1.4),
      new THREE.Vector3(Math.sin(seed + 2) * 2.5, 6.2, Math.cos(seed + 2) * 2.0),
    ];
    const b1Geom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(b1Points), 10, 0.2, 5, false);

    // Secondary branch arching upward
    const b2Points = [
      new THREE.Vector3(0, 4.5, 0),
      new THREE.Vector3(-Math.sin(seed) * 0.8, 5.5, -Math.cos(seed) * 0.8),
      new THREE.Vector3(-Math.sin(seed + 0.5) * 1.6, 6.4, -Math.cos(seed + 0.5) * 1.5),
    ];
    const b2Geom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(b2Points), 8, 0.16, 5, false);

    // Protruding creeping surface roots
    const rGeoms: THREE.BufferGeometry[] = [];
    for (let r = 0; r < 3; r++) {
      const angle = (r / 3) * Math.PI * 2 + seed;
      const rootPts = [
        new THREE.Vector3(0, 0.2, 0),
        new THREE.Vector3(Math.cos(angle) * 0.8, 0.05, Math.sin(angle) * 0.8),
        new THREE.Vector3(Math.cos(angle) * 1.6, -0.1, Math.sin(angle) * 1.6),
        new THREE.Vector3(Math.cos(angle) * 2.3, -0.2, Math.sin(angle) * 2.3),
      ];
      rGeoms.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rootPts), 8, 0.18 * (1 - r * 0.2), 5, false));
    }

    return { trunkGeom: tGeom, branch1Geom: b1Geom, branch2Geom: b2Geom, rootGeoms: rGeoms };
  }, [seed]);

  useFrame((state) => {
    if (trunkRef.current) {
      // Subtle supernatural breathing sway
      const t = state.clock.getElapsedTime() * 0.6 + seed;
      trunkRef.current.rotation.z = rotation[2] + Math.sin(t) * 0.015;
      trunkRef.current.rotation.x = rotation[0] + Math.cos(t * 0.8) * 0.012;
    }
  });

  return (
    <group ref={trunkRef} position={position} rotation={rotation} scale={scale}>
      <mesh geometry={trunkGeom} material={barkMaterial} castShadow={false} />
      <mesh geometry={branch1Geom} material={barkMaterial} />
      <mesh geometry={branch2Geom} material={barkMaterial} />
      {rootGeoms.map((rGeom, idx) => (
        <mesh key={idx} geometry={rGeom} material={rootMaterial} />
      ))}
    </group>
  );
};

export const ProceduralTrees: React.FC<ProceduralTreesProps> = ({ isMobile = false }) => {
  // Shared materials for optimal batching & performance
  const { barkMaterial, rootMaterial } = useMemo(() => {
    const bark = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0b0d14'),
      roughness: 0.85,
      metalness: 0.1,
      bumpScale: 0.05,
    });
    const root = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#07090f'),
      roughness: 0.9,
      metalness: 0.05,
    });
    return { barkMaterial: bark, rootMaterial: root };
  }, []);

  // Tree distribution framing the cinematic camera path
  const treesConfig = useMemo(() => {
    const list: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: [number, number, number];
      seed: number;
    }> = [
      // Foreground Rush Trees (Passing close to camera at start)
      { position: [-2.6, -1.8, 17.5], rotation: [0.08, 0.6, -0.09], scale: [1.35, 1.4, 1.35], seed: 0.7 },
      { position: [2.5, -1.8, 15.5], rotation: [-0.07, -0.8, 0.08], scale: [1.3, 1.35, 1.3], seed: 0.9 },

      // Left Forest Corridor
      { position: [-4.2, -1.8, 12], rotation: [0.05, 0.4, -0.05], scale: [1.1, 1.1, 1.1], seed: 1.2 },
      { position: [-5.5, -1.8, 8], rotation: [-0.04, 0.8, -0.08], scale: [1.25, 1.3, 1.25], seed: 2.7 },
      { position: [-3.8, -1.8, 4], rotation: [0.06, 0.2, 0.04], scale: [1.0, 1.1, 1.0], seed: 3.4 },
      { position: [-4.8, -1.8, 0], rotation: [-0.05, -0.3, -0.06], scale: [1.2, 1.2, 1.2], seed: 4.1 },
      { position: [-3.5, -1.8, -4], rotation: [0.04, 0.6, 0.05], scale: [0.95, 1.05, 0.95], seed: 5.8 },
      { position: [-5.2, -1.8, -8], rotation: [-0.03, 0.1, -0.04], scale: [1.3, 1.35, 1.3], seed: 6.3 },
      { position: [-6.8, -1.8, -12], rotation: [0.08, 0.9, -0.05], scale: [1.4, 1.5, 1.4], seed: 7.2 },

      // Right Forest Corridor
      { position: [4.0, -1.8, 11], rotation: [-0.04, -0.5, 0.06], scale: [1.05, 1.1, 1.05], seed: 8.5 },
      { position: [5.6, -1.8, 7], rotation: [0.05, -0.7, 0.09], scale: [1.2, 1.25, 1.2], seed: 9.3 },
      { position: [3.7, -1.8, 3.5], rotation: [-0.05, -0.2, -0.05], scale: [1.0, 1.05, 1.0], seed: 10.6 },
      { position: [4.9, -1.8, -0.5], rotation: [0.06, 0.4, 0.07], scale: [1.15, 1.2, 1.15], seed: 11.2 },
      { position: [3.4, -1.8, -4.5], rotation: [-0.04, -0.4, -0.06], scale: [0.95, 1.0, 0.95], seed: 12.9 },
      { position: [5.4, -1.8, -8.5], rotation: [0.05, 0.2, 0.04], scale: [1.3, 1.35, 1.3], seed: 13.7 },
      { position: [6.6, -1.8, -12.5], rotation: [-0.06, -0.8, 0.05], scale: [1.45, 1.5, 1.45], seed: 14.4 },
    ];

    // Filter for mobile to ensure high framerates
    return isMobile ? list.filter((_, i) => i % 2 === 0) : list;
  }, [isMobile]);

  return (
    <group>
      {treesConfig.map((tree, index) => (
        <TreeEntity
          key={index}
          position={tree.position}
          rotation={tree.rotation}
          scale={tree.scale}
          seed={tree.seed}
          barkMaterial={barkMaterial}
          rootMaterial={rootMaterial}
        />
      ))}
    </group>
  );
};

export default ProceduralTrees;

