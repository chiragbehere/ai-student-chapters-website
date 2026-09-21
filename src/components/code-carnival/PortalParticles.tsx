// PortalParticles.tsx
// Multi-depth spore, ember, and atmospheric dust particle simulation
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PortalParticlesProps {
  count?: number;
  entering?: boolean;
  mousePos?: { x: number; y: number };
}

export const PortalParticles: React.FC<PortalParticlesProps> = ({
  count = 350,
  entering = false,
  mousePos = { x: 0, y: 0 },
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions, colors, sizes, and velocities
  const [positions, colors, scales, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const vel = new Float32Array(count * 3);

    const emberColor = new THREE.Color('#ff3b30');
    const sporeColor = new THREE.Color('#d97706');
    const dustColor = new THREE.Color('#cbd5e1');
    const riftBlueColor = new THREE.Color('#60a5fa');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across camera view volume: X: -8..8, Y: -6..6, Z: -6..4
      pos[i3] = (Math.random() - 0.5) * 16;
      pos[i3 + 1] = (Math.random() - 0.5) * 12;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;

      // Particle type distribution:
      // 60% embers/spores, 30% dust, 10% cool blue flakes
      const roll = Math.random();
      let c: THREE.Color;
      if (roll < 0.45) {
        c = emberColor;
        sca[i] = 1.5 + Math.random() * 2.5;
      } else if (roll < 0.75) {
        c = sporeColor;
        sca[i] = 1.0 + Math.random() * 2.0;
      } else if (roll < 0.90) {
        c = dustColor;
        sca[i] = 0.8 + Math.random() * 1.5;
      } else {
        c = riftBlueColor;
        sca[i] = 1.2 + Math.random() * 2.2;
      }

      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;

      // Drift velocities
      vel[i3] = (Math.random() - 0.5) * 0.008;
      vel[i3 + 1] = 0.004 + Math.random() * 0.012; // slowly rising spores
      vel[i3 + 2] = 0.002 + Math.random() * 0.006;
    }

    return [pos, col, sca, vel];
  }, [count]);

  // Create soft circular sprite texture dynamically
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 220, 200, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 100, 80, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = positionAttr.array as Float32Array;

    const speedMultiplier = entering ? 7.0 : 1.0;
    const mouseInfluenceX = mousePos.x * 0.02;
    const mouseInfluenceY = -mousePos.y * 0.02;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Rising motion + organic oscillation
      posArr[i3] += velocities[i3] * speedMultiplier + Math.sin(time * 0.8 + i) * 0.002 + mouseInfluenceX;
      posArr[i3 + 1] += velocities[i3 + 1] * speedMultiplier + Math.cos(time * 0.5 + i) * 0.002 + mouseInfluenceY;
      
      // Moving forward towards camera, accelerating wildly during dimensional transition
      if (entering) {
        posArr[i3 + 2] += (0.15 + (posArr[i3 + 2] + 5) * 0.05) * delta * 60;
      } else {
        posArr[i3 + 2] += velocities[i3 + 2];
      }

      // Loop back boundaries
      if (posArr[i3 + 1] > 7) posArr[i3 + 1] = -7;
      if (posArr[i3 + 1] < -7) posArr[i3 + 1] = 7;
      if (posArr[i3] > 9) posArr[i3] = -9;
      if (posArr[i3] < -9) posArr[i3] = 9;
      if (posArr[i3 + 2] > 5) posArr[i3 + 2] = -6;
      if (posArr[i3 + 2] < -6) posArr[i3 + 2] = 5;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        map={particleTexture}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={entering ? 0.95 : 0.75}
      />
    </points>
  );
};

export default PortalParticles;
