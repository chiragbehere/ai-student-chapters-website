// CinematicScrollCamera.tsx
// Seamless 3D Camera Controller travelling along the Stranger Things Forest corridor under Christmas lights
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicScrollCameraProps {
  scrollProgress: number; // 0.0 to 1.0
  mousePos: { x: number; y: number };
  isMobile: boolean;
}

export const CinematicScrollCamera: React.FC<CinematicScrollCameraProps> = ({
  scrollProgress,
  mousePos,
  isMobile,
}) => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0.6, 16.0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.4, 0.0));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const p = THREE.MathUtils.clamp(scrollProgress, 0.0, 1.0);

    // Natural camera travel through the forest under Christmas lights:
    // From z = 16.0 (deep forest entry) down to z = -6.0 (approaching the glowing rift)
    const targetZ = THREE.MathUtils.lerp(16.0, -6.0, p);

    // Gentle camera height variation
    const targetY = 0.5 + Math.sin(p * Math.PI) * 0.15;

    // Subtle gentle curve as you journey down the path
    let targetX = Math.sin(p * Math.PI * 2.0) * 0.4;

    // Look target always focuses slightly ahead toward the portal rift
    const lookZ = targetZ - 9.0;
    const lookY = 0.4;
    const lookX = Math.sin(p * Math.PI) * 0.2;

    // Mouse parallax & subtle handheld breathing sway
    const parallaxFactor = isMobile ? 0.2 : 0.55;
    const swayX = Math.sin(t * 0.7) * 0.05 + mousePos.x * parallaxFactor;
    const swayY = Math.cos(t * 0.6) * 0.04 - mousePos.y * (parallaxFactor * 0.5);

    targetX += swayX;

    // Smooth camera damping
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX, 2.8, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY + swayY, 2.8, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, 2.4, delta);

    // Smooth lookAt damping
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookX + mousePos.x * 0.25, 3.2, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookY, 3.2, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, lookZ, 2.8, delta);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CinematicScrollCamera;
