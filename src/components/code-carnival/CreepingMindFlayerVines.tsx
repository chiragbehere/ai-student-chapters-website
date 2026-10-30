// CreepingMindFlayerVines.tsx
// Authentic Stranger Things Element: Parasitic Mind Flayer tendril vines crawling across trees and bunker walls
// Features: Undulating organic breathing tubes, corrupted black/blood-red color, and pulsing surface nodes
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CreepingMindFlayerVinesProps {
  scrollProgress?: number;
}

export const CreepingMindFlayerVines: React.FC<CreepingMindFlayerVinesProps> = () => {
  const vinesGroupRef = useRef<THREE.Group>(null);

  // Generate organic vine pathways crawling around the trees and concrete pillars
  const vineGeometries = useMemo(() => {
    const geos: THREE.TubeGeometry[] = [];

    // Vine clusters on left and right forest edges
    const vinePaths = [
      // Left tree climb
      [
        new THREE.Vector3(-4.5, -1.8, 11),
        new THREE.Vector3(-4.2, -0.5, 11.2),
        new THREE.Vector3(-3.8, 1.2, 10.8),
        new THREE.Vector3(-4.1, 2.8, 11.0),
        new THREE.Vector3(-3.6, 4.0, 10.5),
      ],
      // Ground crawler crossing the path
      [
        new THREE.Vector3(-5.0, -1.8, 6),
        new THREE.Vector3(-3.2, -1.82, 5.5),
        new THREE.Vector3(-1.2, -1.84, 5.0),
        new THREE.Vector3(1.5, -1.82, 4.5),
        new THREE.Vector3(3.8, -1.8, 4.0),
      ],
      // Right tree strangle vine
      [
        new THREE.Vector3(4.2, -1.8, 9),
        new THREE.Vector3(4.0, -0.4, 8.8),
        new THREE.Vector3(3.6, 1.4, 9.2),
        new THREE.Vector3(3.9, 3.2, 9.0),
      ],
      // Bunker entrance strangle tendril
      [
        new THREE.Vector3(-4.0, -1.8, -2),
        new THREE.Vector3(-3.8, 0.4, -2.5),
        new THREE.Vector3(-4.1, 2.2, -3.0),
        new THREE.Vector3(-3.5, 3.5, -3.2),
      ],
      // Vault frame creeping tendril
      [
        new THREE.Vector3(3.5, -1.8, -26),
        new THREE.Vector3(3.6, 0.8, -27),
        new THREE.Vector3(3.2, 2.5, -28),
        new THREE.Vector3(2.0, 3.6, -28.2),
      ],
    ];

    vinePaths.forEach((pts) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 24, 0.12, 6, false);
      geos.push(geo);
    });

    return geos;
  }, []);

  const vineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0e0306'),
      roughness: 0.5,
      metalness: 0.3,
      emissive: new THREE.Color('#440008'),
      emissiveIntensity: 0.4,
    });
  }, []);

  useFrame((state) => {
    if (!vinesGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Supernatural breathing pulsation
    const pulse = Math.sin(t * 2.2) * 0.05 + 1.0;
    vinesGroupRef.current.scale.set(pulse, pulse, 1.0);

    // Glow intensity rises during breathing peak
    vineMaterial.emissiveIntensity = 0.3 + Math.sin(t * 2.5) * 0.25;
  });

  return (
    <group ref={vinesGroupRef}>
      {vineGeometries.map((geo, idx) => (
        <mesh key={idx} geometry={geo} material={vineMaterial} />
      ))}
    </group>
  );
};

export default CreepingMindFlayerVines;
