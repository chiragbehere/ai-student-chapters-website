// MindFlayerShadow.tsx
// Authentic Stranger Things Element: The Colossal Shadow Monster (Mind Flayer) looming in distant stormy red sky
// Features: Spindly arachnid silhouette legs reaching down from stormy clouds, subtle swaying, and lightning rim glow
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MindFlayerShadowProps {
  scrollProgress?: number;
}

export const MindFlayerShadow: React.FC<MindFlayerShadowProps> = () => {
  const shadowGroupRef = useRef<THREE.Group>(null);

  // Procedural tentacle legs of the Mind Flayer
  const legGeometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    const legConfigs = [
      // Left massive legs
      [
        new THREE.Vector3(-14, 18, 0),
        new THREE.Vector3(-10, 12, 1),
        new THREE.Vector3(-8, 5, -1),
        new THREE.Vector3(-6, -1, 0),
      ],
      [
        new THREE.Vector3(-18, 16, -2),
        new THREE.Vector3(-12, 9, 0),
        new THREE.Vector3(-9, 2, -2),
        new THREE.Vector3(-8, -2, -1),
      ],
      // Right massive legs
      [
        new THREE.Vector3(14, 18, 0),
        new THREE.Vector3(10, 12, 1),
        new THREE.Vector3(8, 5, -1),
        new THREE.Vector3(6, -1, 0),
      ],
      [
        new THREE.Vector3(18, 16, -2),
        new THREE.Vector3(12, 9, 0),
        new THREE.Vector3(9, 2, -2),
        new THREE.Vector3(8, -2, -1),
      ],
      // Central arching torso tendrils
      [
        new THREE.Vector3(-3, 19, 0),
        new THREE.Vector3(-1, 14, 1),
        new THREE.Vector3(0, 9, 0),
        new THREE.Vector3(0, 4, -1),
      ],
      [
        new THREE.Vector3(3, 19, 0),
        new THREE.Vector3(1, 14, 1),
        new THREE.Vector3(0, 8, -1),
      ],
    ];

    legConfigs.forEach((pts) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 20, 0.45, 6, false);
      geos.push(geo);
    });

    return geos;
  }, []);

  const shadowMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#030105'),
      roughness: 0.95,
      metalness: 0.05,
      emissive: new THREE.Color('#220206'),
      emissiveIntensity: 0.2,
    });
  }, []);

  useFrame((state) => {
    if (!shadowGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Looming cosmic sway in the storm
    shadowGroupRef.current.position.y = 2.0 + Math.sin(t * 0.4) * 0.3;
    shadowGroupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
  });

  return (
    <group ref={shadowGroupRef} position={[0, 2, -58]}>
      {/* Central shadowy head mass */}
      <mesh position={[0, 16, 0]}>
        <sphereGeometry args={[4.2, 16, 16]} />
        <primitive object={shadowMat} attach="material" />
      </mesh>

      {/* Massive arching silhouette legs reaching through the red storm clouds */}
      {legGeometries.map((geo, idx) => (
        <mesh key={idx} geometry={geo} material={shadowMat} />
      ))}
    </group>
  );
};

export default MindFlayerShadow;
