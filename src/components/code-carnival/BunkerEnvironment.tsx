// BunkerEnvironment.tsx
// Chapter 02 & 03: Industrial Underground Laboratory / Hawkins Control Bunker
// Features: Reinforced concrete pillars, overhead conduits, rotating emergency strobe, and glowing CRT terminal console
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BunkerEnvironmentProps {
  scrollProgress: number; // 0 to 1
}

export const BunkerEnvironment: React.FC<BunkerEnvironmentProps> = ({ scrollProgress }) => {
  const strobeLightRef = useRef<THREE.PointLight>(null);
  const crtGlowRef = useRef<THREE.MeshBasicMaterial>(null);

  // Pillar positions along the bunker corridor (z: +2 down to -20)
  const pillars = useMemo(() => {
    return [
      { pos: [-4.2, 0.5, 2] },
      { pos: [4.2, 0.5, 2] },
      { pos: [-4.2, 0.5, -4] },
      { pos: [4.2, 0.5, -4] },
      { pos: [-4.2, 0.5, -10] },
      { pos: [4.2, 0.5, -10] },
      { pos: [-4.2, 0.5, -16] },
      { pos: [4.2, 0.5, -16] },
    ];
  }, []);

  // Shared industrial materials
  const pillarMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0a0d14'),
      roughness: 0.88,
      metalness: 0.2,
    });
  }, []);

  const pipeMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1c202a'),
      roughness: 0.5,
      metalness: 0.7,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Revolving red emergency beacon strobe
    if (strobeLightRef.current) {
      strobeLightRef.current.position.x = Math.sin(t * 3.5) * 1.5;
      strobeLightRef.current.position.z = -5 + Math.cos(t * 3.5) * 1.5;
      // Strobe intensity peaks when in Chapter 2/3 range (0.15 to 0.50)
      const inBunker = scrollProgress >= 0.12 && scrollProgress <= 0.55;
      const baseIntensity = inBunker ? 4.5 : 0.8;
      strobeLightRef.current.intensity = baseIntensity * (0.6 + 0.4 * Math.sin(t * 8.0));
    }

    // CRT screen flicker
    if (crtGlowRef.current) {
      crtGlowRef.current.opacity = 0.75 + Math.sin(t * 22.0) * 0.1;
    }
  });

  return (
    <group position={[0, -1.2, 0]}>
      {/* 1. Concrete Structural Pillars */}
      {pillars.map((p, i) => (
        <mesh key={i} position={p.pos as [number, number, number]} material={pillarMat}>
          <boxGeometry args={[0.9, 7.5, 0.9]} />
        </mesh>
      ))}

      {/* 2. Overhead Conduits and Duct Pipes */}
      <mesh position={[-2.8, 3.8, -7]} rotation={[Math.PI / 2, 0, 0]} material={pipeMat}>
        <cylinderGeometry args={[0.22, 0.22, 28, 12]} />
      </mesh>
      <mesh position={[2.8, 3.8, -7]} rotation={[Math.PI / 2, 0, 0]} material={pipeMat}>
        <cylinderGeometry args={[0.22, 0.22, 28, 12]} />
      </mesh>

      {/* 3. Central Emergency Beacon Point Light */}
      <pointLight
        ref={strobeLightRef}
        position={[0, 3.2, -5]}
        color="#ff1122"
        intensity={3.5}
        distance={18}
        decay={2}
      />

      {/* 4. CRT Command Terminal Console (Positioned for Chapter 2 transmission view) */}
      <group position={[0, 0.2, -2.5]}>
        {/* Terminal desk chassis */}
        <mesh position={[0, -0.6, 0]} material={pillarMat}>
          <boxGeometry args={[2.4, 0.9, 1.2]} />
        </mesh>
        {/* CRT Monitor casing */}
        <mesh position={[0, 0.15, 0]} material={pipeMat}>
          <boxGeometry args={[1.3, 0.95, 0.8]} />
        </mesh>
        {/* Phosphor Glowing CRT Screen */}
        <mesh position={[0, 0.15, 0.41]}>
          <planeGeometry args={[1.05, 0.75]} />
          <meshBasicMaterial
            ref={crtGlowRef}
            color="#22ff66"
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Terminal Ambient Glow Light */}
        <pointLight position={[0, 0.2, 0.6]} color="#22ff66" intensity={1.2} distance={4} />
      </group>
    </group>
  );
};

export default BunkerEnvironment;

