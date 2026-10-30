// MindFlayerSky.tsx
// 100% Iconic Stranger Things Visual: The Mind Flayer (Shadow Monster) towering in the stormy crimson sky
// Backlit during supernatural red lightning strikes, with rolling storm clouds
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MindFlayerSkyProps {
  scrollProgress?: number;
}

// Procedural texture generator for the Mind Flayer silhouette
function createMindFlayerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 512);

  // Draw the towering spider-like silhouette of the Mind Flayer
  ctx.fillStyle = '#010204';
  ctx.strokeStyle = '#010204';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = 512;
  const cy = 340;

  // Central head/torso mass
  ctx.beginPath();
  ctx.ellipse(cx, cy, 55, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  // Arched towering spider legs (4 on left, 4 on right)
  const legs = [
    // Left legs: [kneeX, kneeY, footX, footY, width]
    [cx - 180, cy - 220, cx - 440, cy + 140, 24],
    [cx - 140, cy - 260, cx - 350, cy + 150, 22],
    [cx - 90, cy - 280, cx - 250, cy + 160, 20],
    [cx - 40, cy - 230, cx - 140, cy + 160, 16],
    // Right legs
    [cx + 180, cy - 220, cx + 440, cy + 140, 24],
    [cx + 140, cy - 260, cx + 350, cy + 150, 22],
    [cx + 90, cy - 280, cx + 250, cy + 160, 20],
    [cx + 40, cy - 230, cx + 140, cy + 160, 16],
  ];

  legs.forEach(([kx, ky, fx, fy, w]) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.quadraticCurveTo(kx, ky, fx, fy);
    ctx.stroke();
  });

  // Soft atmospheric blur around the silhouette
  ctx.filter = 'blur(6px)';
  ctx.drawImage(canvas, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const MindFlayerSky: React.FC<MindFlayerSkyProps> = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useMemo(() => createMindFlayerTexture(), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Subtle supernatural breathing scale
      const breath = 1.0 + Math.sin(t * 0.4) * 0.02;
      meshRef.current.scale.set(breath, breath, 1.0);
    }
  });

  return (
    <group position={[0, 8.0, -32]}>
      {/* 1. Distant Storm Silhouette Plane */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[44, 22]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Distant Crimson Atmosphere Storm Glow behind the monster */}
      <mesh position={[0, -2, -2]}>
        <planeGeometry args={[56, 28]} />
        <meshBasicMaterial
          ref={glowMatRef}
          color="#330408"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default MindFlayerSky;

