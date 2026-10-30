// InstancedForestParticles.tsx
// High-performance particle systems: Drifting Upside-Down spores and rising incandescent red embers
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InstancedForestParticlesProps {
  count?: number;
  warpProgress?: number;
}

export const InstancedForestParticles: React.FC<InstancedForestParticlesProps> = ({
  count = 350,
  warpProgress = 0,
}) => {
  const sporesRef = useRef<THREE.Points>(null);
  const embersRef = useRef<THREE.Points>(null);

  // 1. Spores Data
  const sporeCount = count;
  const { sporeInitialPos, sporeVelocities, sporePhases } = useMemo(() => {
    const pos = new Float32Array(sporeCount * 3);
    const vel = new Float32Array(sporeCount * 3);
    const pha = new Float32Array(sporeCount);

    for (let i = 0; i < sporeCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = -1.5 + Math.random() * 8;
      pos[i * 3 + 2] = -14 + Math.random() * 28;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      pha[i] = Math.random() * Math.PI * 2;
    }
    return { sporeInitialPos: pos, sporeVelocities: vel, sporePhases: pha };
  }, [sporeCount]);

  // 2. Embers Data (Hot red rising particles)
  const emberCount = Math.floor(count * 0.45);
  const { emberInitialPos, emberSpeeds } = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const spd = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = -1.8 + Math.random() * 6;
      pos[i * 3 + 2] = -10 + Math.random() * 20;

      spd[i] = 0.4 + Math.random() * 0.8;
    }
    return { emberInitialPos: pos, emberSpeeds: spd };
  }, [emberCount]);

  const sporeGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(sporeInitialPos.slice(), 3));
    return geo;
  }, [sporeInitialPos]);

  const emberGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(emberInitialPos.slice(), 3));
    return geo;
  }, [emberInitialPos]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Animate Spores: gentle drifting + turbulence
    if (sporesRef.current) {
      const posAttr = sporesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const warpSpeed = 1.0 + warpProgress * 14.0;

      for (let i = 0; i < sporeCount; i++) {
        const idx = i * 3;
        array[idx + 0] += (sporeVelocities[idx + 0] + Math.sin(t * 0.8 + sporePhases[i]) * 0.05) * delta * warpSpeed;
        array[idx + 1] += (sporeVelocities[idx + 1] + Math.cos(t * 0.6 + sporePhases[i]) * 0.04) * delta * warpSpeed;
        // Move towards camera or through gate during warp
        array[idx + 2] += (sporeVelocities[idx + 2] + (warpProgress > 0 ? 6.0 : 0)) * delta * warpSpeed;

        // Bounding wrap
        if (array[idx + 1] > 7.0) array[idx + 1] = -1.5;
        if (array[idx + 1] < -1.6) array[idx + 1] = 6.8;
        if (array[idx + 2] > 14.0) array[idx + 2] = -12.0;
        if (array[idx + 2] < -14.0) array[idx + 2] = 13.5;
      }
      posAttr.needsUpdate = true;
    }

    // Animate Embers: rising upward with red flicker
    if (embersRef.current) {
      const posAttr = embersRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < emberCount; i++) {
        const idx = i * 3;
        array[idx + 1] += emberSpeeds[i] * delta * (1.0 + warpProgress * 4.0);
        array[idx + 0] += Math.sin(t * 2.0 + i) * 0.015;

        // Reset to ground
        if (array[idx + 1] > 6.0) {
          array[idx + 1] = -1.8;
          array[idx + 0] = (Math.random() - 0.5) * 16;
          array[idx + 2] = -10 + Math.random() * 20;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Drifting Upside-Down Atmospheric Spores */}
      <points ref={sporesRef} geometry={sporeGeometry}>
        <pointsMaterial
          size={0.05}
          color="#a2b3c7"
          transparent
          opacity={0.4}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Rising Incandescent Red Embers */}
      <points ref={embersRef} geometry={emberGeometry}>
        <pointsMaterial
          size={0.08}
          color="#ff2233"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default InstancedForestParticles;
