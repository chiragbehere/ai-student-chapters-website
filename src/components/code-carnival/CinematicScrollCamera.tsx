// CinematicScrollCamera.tsx
// Seamless 6-Chapter 3D Camera Controller: Smooth spline dolly, foreground depth rush, and mouse parallax
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
  const currentPos = useRef(new THREE.Vector3(0, 0.6, 17.0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.4, 0.0));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const p = THREE.MathUtils.clamp(scrollProgress, 0.0, 1.0);

    // Target position and lookAt calculated piecewise across the 6 chapters
    let targetX = 0;
    let targetY = 0.5;
    let targetZ = 17.0;
    let lookX = 0;
    let lookY = 0.4;
    let lookZ = 0;

    if (p < 0.15) {
      // CHAPTER 01: THE BREACH (Forest corridor dolly, z: 17.0 -> 4.5)
      const u = p / 0.15;
      targetZ = THREE.MathUtils.lerp(17.0, 4.5, u);
      targetY = THREE.MathUtils.lerp(0.6, 0.4, u);
      targetX = Math.sin(u * Math.PI) * 0.4; // Subtle curved path
      lookZ = targetZ - 10.0;
      lookY = 0.4;
    } else if (p < 0.30) {
      // CHAPTER 02: THE TRANSMISSION (Descend into industrial bunker, z: 4.5 -> -1.5)
      const u = (p - 0.15) / 0.15;
      targetZ = THREE.MathUtils.lerp(4.5, -1.0, u);
      targetY = THREE.MathUtils.lerp(0.4, -0.2, u);
      targetX = Math.sin(u * 2.0) * -0.3;
      lookZ = -3.5;
      lookY = -0.4; // Focus on CRT screen
    } else if (p < 0.50) {
      // CHAPTER 03: THE CHALLENGES (Glide through 4 zones, z: -1.0 -> -24.0)
      const u = (p - 0.30) / 0.20;
      targetZ = THREE.MathUtils.lerp(-1.0, -24.0, u);
      targetY = 0.2;
      // Weave gently left and right between the challenge artifacts
      targetX = Math.sin(u * Math.PI * 3.0) * 0.5;
      lookZ = targetZ - 6.0;
      lookY = 0.2;
    } else if (p < 0.70) {
      // CHAPTER 04: THE REWARD VAULT (Approach & enter vault, z: -24.0 -> -31.5)
      const u = (p - 0.50) / 0.20;
      targetZ = THREE.MathUtils.lerp(-24.0, -31.5, u);
      targetY = 0.4;
      targetX = 0;
      lookZ = -34.0;
      lookY = 0.4;
    } else if (p < 0.85) {
      // CHAPTER 05: THE PROTOCOL (Command Room, z: -31.5 -> -42.0)
      const u = (p - 0.70) / 0.15;
      targetZ = THREE.MathUtils.lerp(-31.5, -42.0, u);
      targetY = 0.3;
      targetX = Math.cos(u * 2.0) * 0.3;
      lookZ = -46.0;
      lookY = 0.2;
    } else {
      // CHAPTER 06: THE FINAL GATE (Approach Singularity, z: -42.0 -> -49.5)
      const u = (p - 0.85) / 0.15;
      targetZ = THREE.MathUtils.lerp(-42.0, -49.5, u);
      targetY = 0.5;
      targetX = 0;
      lookZ = -54.0;
      lookY = 0.5;
    }

    // Add mouse parallax + organic handheld sway
    const parallaxFactor = isMobile ? 0.25 : 0.65;
    const swayX = Math.sin(t * 0.7) * 0.05 + mousePos.x * parallaxFactor;
    const swayY = Math.cos(t * 0.6) * 0.04 - mousePos.y * (parallaxFactor * 0.6);

    targetX += swayX;
    targetY += swayY;

    // Smooth camera position damping
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX, 3.0, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY, 3.0, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, 2.5, delta);

    // Smooth lookAt damping
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookX + mousePos.x * 0.3, 3.5, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookY, 3.5, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, lookZ, 3.0, delta);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

export default CinematicScrollCamera;

